# 📋 Review Workflow Documentation

**Last Updated**: 2026-05-20  
**Status**: ✅ Implementation Complete

---

## Overview

The CNCG website implements a semi-automated review workflow for user-generated content (comments and guestbook messages). This document describes the complete workflow, database schema, API endpoints, and review procedures.

---

## 1. Review Status States

All user-generated content goes through the following states:

| Status | Description | Public Visible | Author Visible |
|--------|-------------|-----------------|-----------------|
| `pending` | Awaiting review | ❌ No | ✅ Yes (localStorage) |
| `approved` | Approved for display | ✅ Yes | ✅ Yes |
| `rejected` | Rejected by reviewer | ❌ No | ✅ Yes (localStorage) |
| `spam` | Marked as spam | ❌ No | ❌ No |

---

## 2. Database Schema

### Comments Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,                    -- e.g., "note-slug" or "blog-slug"
  author_name TEXT NOT NULL,                -- 1-30 characters
  author_email TEXT,                        -- Optional, not public
  content TEXT NOT NULL,                    -- 1-1000 characters
  parent_id UUID REFERENCES comments(id),   -- For nested replies
  review_status TEXT DEFAULT 'pending',     -- pending|approved|rejected|spam
  reviewed_at TIMESTAMPTZ,                  -- When reviewed
  review_reason TEXT,                       -- Why rejected/spam
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_page_status ON comments(page_id, review_status);
CREATE INDEX idx_comments_status ON comments(review_status);
```

### Guestbook Table

```sql
CREATE TABLE guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,                -- 1-30 characters
  content TEXT NOT NULL,                    -- 1-500 characters
  review_status TEXT DEFAULT 'pending',     -- pending|approved|rejected|spam
  reviewed_at TIMESTAMPTZ,                  -- When reviewed
  review_reason TEXT,                       -- Why rejected/spam
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guestbook_status ON guestbook(review_status);
```

### Migration from `is_approved` to `review_status`

If migrating from the old `is_approved` boolean column:

```sql
-- Add new column
ALTER TABLE comments ADD COLUMN review_status TEXT DEFAULT 'pending';
ALTER TABLE guestbook ADD COLUMN review_status TEXT DEFAULT 'pending';

-- Migrate data
UPDATE comments SET review_status = 'approved' WHERE is_approved = true;
UPDATE comments SET review_status = 'pending' WHERE is_approved = false;
UPDATE guestbook SET review_status = 'approved' WHERE is_approved = true;
UPDATE guestbook SET review_status = 'pending' WHERE is_approved = false;

-- Add new columns for tracking
ALTER TABLE comments ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN review_reason TEXT;
ALTER TABLE guestbook ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE guestbook ADD COLUMN review_reason TEXT;

-- Drop old column (optional, after verification)
ALTER TABLE comments DROP COLUMN is_approved;
ALTER TABLE guestbook DROP COLUMN is_approved;
```

---

## 3. API Endpoints

### 3.1 Comments API (`/api/comments`)

#### GET - Fetch Comments

```bash
GET /api/comments?page_id=note-slug&status=approved
```

**Parameters:**
- `page_id` (required): Page identifier (e.g., "note-slug", "blog-slug")
- `status` (optional): Filter by status - `approved`, `pending`, `rejected`, `spam`, `all` (default: `approved`)

**Response:**
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "author_name": "John",
      "content": "Great post!",
      "created_at": "2026-05-20T10:00:00Z",
      "parent_id": null,
      "review_status": "approved"
    }
  ]
}
```

#### POST - Submit Comment

```bash
POST /api/comments
Content-Type: application/json

{
  "pageId": "note-slug",
  "authorName": "John",
  "authorEmail": "john@example.com",
  "content": "Great post!",
  "parentId": null,
  "website": ""
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "author_name": "John",
    "content": "Great post!",
    "created_at": "2026-05-20T10:00:00Z",
    "parent_id": null,
    "review_status": "pending"
  }
}
```

### 3.2 Guestbook API (`/api/guestbook`)

#### GET - Fetch Messages

```bash
GET /api/guestbook?limit=50&status=approved
```

**Parameters:**
- `limit` (optional): Number of messages (1-100, default: 50)
- `status` (optional): Filter by status - `approved`, `pending`, `rejected`, `spam`, `all` (default: `approved`)

**Response:**
```json
{
  "code": 0,
  "data": [
    {
      "id": "uuid",
      "author_name": "Alice",
      "content": "Love your work!",
      "created_at": "2026-05-20T10:00:00Z",
      "review_status": "approved"
    }
  ]
}
```

#### POST - Submit Message

```bash
POST /api/guestbook
Content-Type: application/json

{
  "authorName": "Alice",
  "content": "Love your work!",
  "website": ""
}
```

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "author_name": "Alice",
    "content": "Love your work!",
    "created_at": "2026-05-20T10:00:00Z",
    "review_status": "pending"
  }
}
```

### 3.3 Admin Review API (`/api/admin-review`)

**Authentication**: Requires `X-Admin-Token` header or `token` query parameter

#### GET - Fetch Items for Review

```bash
GET /api/admin-review?type=all&status=pending
X-Admin-Token: your-admin-token
```

**Parameters:**
- `type` (optional): `comments`, `guestbook`, or `all` (default: `all`)
- `status` (optional): `pending`, `approved`, `rejected`, `spam` (default: `pending`)

**Response:**
```json
{
  "code": 0,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "page_id": "note-slug",
        "author_name": "John",
        "author_email": "john@example.com",
        "content": "Comment text",
        "created_at": "2026-05-20T10:00:00Z",
        "review_status": "pending",
        "parent_id": null
      }
    ],
    "guestbook": [
      {
        "id": "uuid",
        "author_name": "Alice",
        "content": "Message text",
        "created_at": "2026-05-20T10:00:00Z",
        "review_status": "pending"
      }
    ]
  }
}
```

#### PATCH - Update Review Status

```bash
PATCH /api/admin-review
X-Admin-Token: your-admin-token
Content-Type: application/json

{
  "type": "comments",
  "id": "uuid",
  "status": "approved",
  "reason": "Looks good"
}
```

**Parameters:**
- `type` (required): `comments` or `guestbook`
- `id` (required): Item ID
- `status` (required): `approved`, `rejected`, or `spam`
- `reason` (optional): Reason for rejection/spam

**Response:**
```json
{
  "code": 0,
  "data": {
    "id": "uuid",
    "review_status": "approved",
    "reviewed_at": "2026-05-20T10:05:00Z"
  }
}
```

#### DELETE - Permanently Delete Submission

```bash
DELETE /api/admin-review
X-Admin-Token: your-admin-token
Content-Type: application/json

{
  "type": "comments",
  "id": "uuid"
}
```

**Response:**
```json
{
  "code": 0,
  "message": "已删除"
}
```

---

## 4. Frontend Implementation

### 4.1 Optimistic UI Pattern

The frontend uses localStorage to show pending content immediately to the author:

```javascript
// GuestbookSection.vue & CommentSection.vue
const pendingStorageKey = 'cncg_guestbook_pending' // or 'cncg_comments_pending'

function readPendingMessages() {
  const raw = window.localStorage.getItem(pendingStorageKey)
  return raw ? JSON.parse(raw) : []
}

function mergeMessages(serverMessages, pendingMessages) {
  const approvedIds = new Set(serverMessages.map(item => item.id))
  const stillPending = pendingMessages.filter(item => !approvedIds.has(item.id))
  return [...stillPending, ...serverMessages]
}
```

### 4.2 Display Logic

**For Public Visitors:**
- Only see `approved` content
- Pending/rejected/spam content is hidden

**For Content Authors:**
- See their own pending content via localStorage
- See approved content from others
- Pending badge shows "待审核" status

### 4.3 Status Badge

```vue
<span v-if="msg.pending" class="message-status">待审核</span>
```

---

## 5. Review Procedures

### 5.1 Manual Review via Supabase Dashboard

1. Open Supabase Dashboard
2. Navigate to `comments` or `guestbook` table
3. Filter by `review_status = 'pending'`
4. Review each submission
5. Update `review_status` to `approved`, `rejected`, or `spam`
6. Optionally add `review_reason` for rejections

### 5.2 Manual Review via Feishu

1. Set up a Feishu Bitable to track submissions
2. Create a webhook to sync pending items
3. Review in Feishu and update status
4. Sync status back to Supabase

### 5.3 Programmatic Review via Admin API

```bash
# Get all pending items
curl -H "X-Admin-Token: your-token" \
  "https://your-domain.com/api/admin-review?status=pending"

# Approve a comment
curl -X PATCH \
  -H "X-Admin-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{"type":"comments","id":"uuid","status":"approved"}' \
  "https://your-domain.com/api/admin-review"

# Reject a guestbook message
curl -X PATCH \
  -H "X-Admin-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{"type":"guestbook","id":"uuid","status":"rejected","reason":"Spam"}' \
  "https://your-domain.com/api/admin-review"
```

---

## 6. Notification Integration

### 6.1 QMSG Notification Format

When a new submission is received, QMSG sends a notification with:

```
【新评论】
作者: John
内容: Great post!
页面: note-slug
状态: 待审核
链接: https://cncg.me/note/slug
```

### 6.2 Notification Channels

- **QMSG**: Real-time QQ notification
- **Feishu**: Optional Bitable sync
- **Email**: Optional email notification (future)

---

## 7. Environment Variables

Add to `.env.local` or Vercel environment:

```env
# Admin review token (for /api/admin-review)
ADMIN_REVIEW_TOKEN=your-secure-token-here

# Existing variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
QMSG_KEY=your-qmsg-key
```

---

## 8. Security Considerations

### 8.1 Rate Limiting

- Comments: 6 per 10 minutes per IP
- Guestbook: 6 per 10 minutes per IP
- Honeypot field: `website` (must be empty)

### 8.2 Input Validation

- Author name: 1-30 characters
- Email: Valid format, 1-100 characters
- Comment content: 1-1000 characters
- Guestbook content: 1-500 characters

### 8.3 Admin Token Security

- Store `ADMIN_REVIEW_TOKEN` in Vercel environment variables
- Never commit to git
- Rotate periodically
- Use strong random token (32+ characters)

### 8.4 CORS & Origin Validation

- Only allow requests from your domain
- Validate Origin/Referer headers
- Use CORS headers appropriately

---

## 9. Monitoring & Analytics

### 9.1 Metrics to Track

- Total submissions per day
- Approval rate (approved / total)
- Average review time
- Spam detection rate

### 9.2 Queries

```sql
-- Pending items count
SELECT COUNT(*) FROM comments WHERE review_status = 'pending';
SELECT COUNT(*) FROM guestbook WHERE review_status = 'pending';

-- Approval rate
SELECT 
  COUNT(CASE WHEN review_status = 'approved' THEN 1 END) as approved,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(CASE WHEN review_status = 'approved' THEN 1 END) / COUNT(*), 2) as approval_rate
FROM comments;

-- Average review time
SELECT 
  AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at))) / 3600 as avg_hours
FROM comments
WHERE reviewed_at IS NOT NULL;
```

---

## 10. Troubleshooting

### Issue: Pending content not showing to author

**Solution**: Check localStorage key name matches component configuration

### Issue: Admin API returns 401

**Solution**: Verify `ADMIN_REVIEW_TOKEN` environment variable is set and token is correct

### Issue: Content not appearing after approval

**Solution**: 
1. Verify `review_status` is set to `approved` in database
2. Clear browser cache
3. Check API response includes `review_status` field

### Issue: Spam content still visible

**Solution**: Ensure RLS policies allow only `approved` status for public queries

---

## 11. Future Enhancements

- [ ] Admin dashboard UI at `/admin/review`
- [ ] Email notifications for new submissions
- [ ] Automated spam detection (keyword filtering)
- [ ] User reputation system
- [ ] Comment threading UI improvements
- [ ] Bulk review operations
- [ ] Review history/audit log

---

## 12. Related Files

- `api/comments.js` - Comments API endpoint
- `api/guestbook.js` - Guestbook API endpoint
- `api/admin-review.js` - Admin review API endpoint
- `src/components/common/CommentSection.vue` - Comments component
- `src/components/common/CommentItem.vue` - Single comment component
- `src/components/common/GuestbookSection.vue` - Guestbook component
- `src/composables/useComments.js` - Comments composable
- `src/composables/useGuestbook.js` - Guestbook composable

---

**Last Updated**: 2026-05-20  
**Maintained By**: CNCG Team
