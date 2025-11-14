# Deployment Guide

## Frontend (Vercel)

### Setup
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `dist`

### Environment Variables
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
VITE_MEILISEARCH_HOST=your_meilisearch_host
VITE_MEILISEARCH_API_KEY=your_meilisearch_key
```

### vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Database (Supabase)

### Initial Setup
1. Create new Supabase project
2. Run migrations from DATABASE_SCHEMA.md
3. Enable Row Level Security (RLS)
4. Configure storage bucket for audio files

### RLS Policies
```sql
-- Public read for published recordings
CREATE POLICY "Public recordings are viewable by everyone"
ON recordings FOR SELECT
USING (consent_status = 'public' AND published_at IS NOT NULL);

-- Authenticated users can read their own playlists
CREATE POLICY "Users can view own playlists"
ON playlists FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage everything
CREATE POLICY "Admins full access"
ON recordings FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

### Storage Bucket
```sql
-- Create audio storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('recordings', 'recordings', false);

-- Policy for signed URLs
CREATE POLICY "Authenticated users can access recordings"
ON storage.objects FOR SELECT
USING (bucket_id = 'recordings' AND auth.role() = 'authenticated');
```

## MCP Servers (Node Service)

### Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 3001 3002
CMD ["node", "index.js"]
```

### Deploy to Railway/Render
```bash
# Railway
railway init
railway up

# Render
render deploy
```

## Meilisearch

### Cloud Setup (Meilisearch Cloud)
1. Create account at cloud.meilisearch.com
2. Create index: `recordings`
3. Configure searchable attributes: `title`, `tags`, `transcripts`
4. Set filterable attributes: `lineage`, `language`, `elder_id`

### Self-hosted (Docker)
```yaml
version: '3'
services:
  meilisearch:
    image: getmeili/meilisearch:latest
    ports:
      - "7700:7700"
    environment:
      - MEILI_MASTER_KEY=${MEILI_MASTER_KEY}
    volumes:
      - ./meili_data:/meili_data
```

## CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoring

### Sentry Setup
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Access Logging
All recording access is logged to `access_logs` table for governance and analytics.
