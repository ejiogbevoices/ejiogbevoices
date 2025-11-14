# MCP Server Implementation Guide

## voices-catalog-mcp (Read-only Server)

### Setup
```bash
npm init -y
npm install @modelcontextprotocol/sdk pg
```

### Implementation (Node.js)
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const server = new Server({
  name: 'voices-catalog-mcp',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler('tools/list', async () => ({
  tools: [
    {
      name: 'listRecordings',
      description: 'List all recordings with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          lineage: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    {
      name: 'getRecording',
      description: 'Get detailed recording by ID',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id']
      }
    },
    {
      name: 'search',
      description: 'Full-text search across recordings',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query']
      }
    }
  ]
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case 'listRecordings':
      const result = await pool.query(
        'SELECT * FROM recordings WHERE ($1::text IS NULL OR lineage = $1)',
        [args.lineage || null]
      );
      return { content: [{ type: 'text', text: JSON.stringify(result.rows) }] };
    
    case 'getRecording':
      const recording = await pool.query(
        'SELECT r.*, e.name as elder_name FROM recordings r JOIN elders e ON r.elder_id = e.id WHERE r.id = $1',
        [args.id]
      );
      return { content: [{ type: 'text', text: JSON.stringify(recording.rows[0]) }] };
    
    case 'search':
      // Implement full-text search
      const searchResults = await pool.query(
        `SELECT * FROM recordings WHERE 
         title ILIKE $1 OR 
         EXISTS (SELECT 1 FROM unnest(tags) tag WHERE tag ILIKE $1)`,
        [`%${args.query}%`]
      );
      return { content: [{ type: 'text', text: JSON.stringify(searchResults.rows) }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## ops-mcp (Role-gated Operations)

### Implementation with Auth
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  const userRole = request.meta?.userRole || 'guest';
  
  switch (name) {
    case 'createRecordingRow':
      if (!['admin', 'editor'].includes(userRole)) {
        throw new Error('Unauthorized: admin or editor role required');
      }
      const result = await pool.query(
        `INSERT INTO recordings (title, language, lineage, tags, duration_ms, storage_url, elder_id, consent_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [args.title, args.language, args.lineage, args.tags, args.duration_ms, args.storage_url, args.elder_id, args.consent_status]
      );
      return { content: [{ type: 'text', text: result.rows[0].id }] };
    
    case 'updateConsent':
      if (userRole !== 'admin') {
        throw new Error('Unauthorized: admin role required');
      }
      await pool.query(
        'UPDATE consents SET access_restrictions = $1, revenue_share_terms = $2 WHERE elder_id = $3',
        [args.access_restrictions, args.revenue_share_terms, args.elder_id]
      );
      return { content: [{ type: 'text', text: 'Consent updated' }] };
    
    case 'publish':
      if (!['admin', 'editor'].includes(userRole)) {
        throw new Error('Unauthorized: admin or editor role required');
      }
      await pool.query(
        'UPDATE recordings SET published_at = NOW() WHERE id = $1',
        [args.recording_id]
      );
      // Log access event
      await pool.query(
        'INSERT INTO access_logs (user_id, recording_id, action) VALUES ($1, $2, $3)',
        [args.user_id, args.recording_id, 'publish']
      );
      return { content: [{ type: 'text', text: 'Recording published' }] };
  }
});
```

## Running MCP Servers

### Development
```bash
# Terminal 1: voices-catalog-mcp
node voices-catalog-mcp.js

# Terminal 2: ops-mcp
node ops-mcp.js
```

### Production (Docker)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
CMD ["node", "server.js"]
```
