# Governance & Cultural Protocols

## Core Principles

### 1. Elder Consent is Paramount
Every recording in the archive must have explicit, informed consent from the elder or their designated representative. No recording may be published without documented consent.

### 2. Cultural Respect
This platform preserves sacred knowledge. All users, contributors, and administrators must approach the content with reverence and respect for its cultural significance.

### 3. Transparency
All access to recordings is logged. Elders and their families can request access logs at any time to see who has listened to their recordings.

### 4. Revenue Sharing
When recordings generate revenue (subscriptions, donations, licensing), proceeds are distributed according to the terms specified in each elder's consent document.

## Consent Framework

### Consent Levels
- **Public**: Freely accessible to all users
- **Restricted**: Requires authentication and agreement to usage terms
- **Private**: Only accessible to specific users/roles
- **Pending**: Not yet published, awaiting consent documentation

### Required Documentation
For each recording, the following must be on file:
1. Signed consent form from elder
2. Usage restrictions (if any)
3. Revenue sharing terms
4. Cultural protocols to observe
5. Citation requirements

### Consent Review Process
1. Elder or representative signs consent form
2. Admin uploads document to secure storage
3. Admin sets consent_status in database
4. Recording becomes visible based on consent level
5. Annual review to confirm consent remains valid

## Access Control

### User Roles

**Guest (Unauthenticated)**
- Browse public recordings
- View elder profiles
- Search catalog
- Cannot save playlists or access restricted content

**Member (Authenticated)**
- All guest permissions
- Create and manage playlists
- Access restricted recordings
- Track study progress
- Receive notifications

**Editor**
- All member permissions
- Upload new recordings
- Edit transcripts and metadata
- Manage elder profiles
- Cannot change consent status

**Admin**
- All editor permissions
- Manage consent documents
- Set consent status
- Assign user roles
- View access logs
- Export data for transparency reports

### Access Logging

Every interaction with a recording is logged:
```typescript
{
  user_id: string | null,
  recording_id: string,
  action: 'view' | 'play' | 'download' | 'share',
  timestamp: Date,
  ip_address: string (hashed),
  user_agent: string
}
```

Logs are:
- Retained for 7 years
- Available to elders/families on request
- Used for analytics and compensation
- Anonymized for public reporting

## Cultural Protocols

### Citation Requirements
When referencing recordings in academic work, publications, or other media:

```
[Elder Name], "[Recording Title]," Ejiogbe Voices Archive, 
[Lineage], recorded [Date], accessed [Date], 
https://ejiogbevoices.com/recordings/[id]
```

### Usage Restrictions
Some recordings may have specific restrictions:
- No commercial use without additional permission
- No derivative works (remixes, samples)
- No use in political contexts
- Must credit elder and lineage
- Cannot be used to train AI models without consent

### Sacred Content Warnings
Certain recordings contain:
- Sacred names that should not be spoken aloud casually
- Ritual instructions that require initiation to practice
- Genealogies that are private to specific lineages
- Herbal formulas that require proper training

These recordings are clearly marked and may have additional access restrictions.

## Revenue Sharing

### Revenue Sources
- Subscription fees (future)
- One-time donations
- Institutional licensing
- Educational bundles
- API access fees

### Distribution Model
1. **Platform Operations** (40%): Server costs, development, maintenance
2. **Elder/Family** (40%): Distributed per consent terms
3. **Community Fund** (20%): Supports cultural preservation initiatives

### Payout Process
- Calculated quarterly
- Minimum payout: $25 USD
- Paid via: Bank transfer, PayPal, or check
- Detailed statement provided with each payout
- Elders can designate beneficiaries

## Data Sovereignty

### Elder Rights
Elders retain full ownership of their recordings and can:
- Request removal at any time
- Update consent terms
- Restrict access
- Receive all their data in portable format
- Designate a cultural heir

### Platform Obligations
The platform commits to:
- Never sell elder data to third parties
- Obtain consent before any new use case
- Provide annual transparency reports
- Maintain secure backups
- Honor takedown requests within 48 hours

## Dispute Resolution

### Process
1. Issue reported to governance committee
2. Committee reviews within 7 days
3. Parties notified of decision
4. 30-day appeal period
5. Final decision binding

### Governance Committee
- 3 elders from different lineages
- 2 community representatives
- 1 legal advisor
- 1 technical representative

Meets quarterly and as needed for urgent matters.

## Amendments

This governance framework may be updated with:
- Majority vote of governance committee
- 30-day public comment period
- Notification to all registered users
- Opt-out option for users who disagree

Last updated: October 2024
