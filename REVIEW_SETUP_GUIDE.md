# 🚀 Review Workflow Setup Guide

**Last Updated**: 2026-05-20  
**Difficulty**: ⭐⭐ Intermediate

---

## Quick Start

The review workflow is **already implemented** in the codebase. This guide helps you set it up and start using it.

---

## Step 1: Database Migration (Supabase)

### Option A: Fresh Setup (New Project)

If you're setting up Supabase for the first time, the tables will automatically use `review_status`:

```sql
-- Run in Supabase SQL Editor

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'spam')),
  reviewed_at TIMESTAMPTZ,
  review_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_comments_page_status ON comments(page_id, review_status);
CREATE INDEX idx_comments_status ON comments(review_status);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- Guestbook table
CREATE TABLE guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected', 'spam')),
  reviewed_at TIMESTAMPTZ,
  review_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guestbook_status ON guestbook(review_status);
CREATE INDEX idx_guestbook_created ON guestbook(created_at DESC);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Anyone can read approved comments" ON comments
  FOR SELECT USING (review_status = 'approved');

CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- RLS Policies for guestbook
CREATE POLICY "Anyone can read approved guestbook" ON guestbook
  FOR SELECT USING (review_status = 'approved');

CREATE POLICY "Anyone can insert guestbook" ON guestbook
  FOR INSERT WITH CHECK (true);
```

### Option B: Migrate Existing Data

If you already have `is_approved` column:

```sql
-- Add new column
ALTER TABLE comments ADD COLUMN review_status TEXT DEFAULT 'pending';
ALTER TABLE guestbook ADD COLUMN review_status TEXT DEFAULT 'pending';

-- Add tracking columns
ALTER TABLE comments ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE comments ADD COLUMN review_reason TEXT;
ALTER TABLE guestbook ADD COLUMN reviewed_at TIMESTAMPTZ;
ALTER TABLE guestbook ADD COLUMN review_reason TEXT;

-- Migrate data
UPDATE comments SET review_status = 'approved' WHERE is_approved = true;
UPDATE comments SET review_status = 'pending' WHERE is_approved = false;
UPDATE guestbook SET review_status = 'approved' WHERE is_approved = true;
UPDATE guestbook SET review_status = 'pending' WHERE is_approved = false;

-- Add constraints
ALTER TABLE comments ADD CONSTRAINT check_review_status 
  CHECK (review_status IN ('pending', 'approved', 'rejected', 'spam'));
ALTER TABLE guestbook ADD CONSTRAINT check_review_status 
  CHECK (review_status IN ('pending', 'approved', 'rejected', 'spam'));

-- Create indexes
CREATE INDEX idx_comments_page_status ON comments(page_id, review_status);
CREATE INDEX idx_comments_status ON comments(review_status);
CREATE INDEX idx_guestbook_status ON guestbook(review_status);

-- Drop old column (after verification)
ALTER TABLE comments DROP COLUMN is_approved;
ALTER TABLE guestbook DROP COLUMN is_approved;
```

---

## Step 2: Environment Variables

Add to `.env.local` (local development) or Vercel environment variables (production):

```env
# Admin review token - use a strong random string
# Generate with: openssl rand -hex 32
ADMIN_REVIEW_TOKEN=your-secure-random-token-here

# Existing Supabase variables (should already be set)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Existing notification variables
QMSG_KEY=your-qmsg-key
```

### Generate Secure Token

```bash
# macOS/Linux
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

## Step 3: Deploy Updated APIs

The following files have been updated and need to be deployed:

1. **`api/comments.js`** - Updated to use `review_status`
2. **`api/guestbook.js`** - Updated to use `review_status`
3. **`api/admin-review.js`** - NEW: Admin review endpoint

### Deploy to Vercel

```bash
# Commit changes
git add api/
git commit -m "feat: implement review workflow with review_status"

# Push to main (or create PR)
git push origin main

# Vercel will auto-deploy
```

---

## Step 4: Review Procedures

### Method 1: Supabase Dashboard (Recommended for Simple Use)

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** or **Table Editor**
4. Navigate to `comments` or `guestbook` table
5. Filter by `review_status = 'pending'`
6. Review each submission
7. Update `review_status` to:
   - `approved` - Show to public
   - `rejected` - Hide from public
   - `spam` - Hide and mark as spam

**Example SQL Query:**
```sql
SELECT * FROM comments WHERE review_status = 'pending' ORDER BY created_at DESC;
SELECT * FROM guestbook WHERE review_status = 'pending' ORDER BY created_at DESC;
```

### Method 2: Feishu Integration (Recommended for Team Review)

1. Create a Feishu Bitable to track submissions
2. Set up a webhook to sync pending items from Supabase
3. Review in Feishu
4. Update status in Supabase

**Feishu Bitable Columns:**
- 类型 (Type): comments / guestbook
- 作者 (Author): author_name
- 内容 (Content): content
- 页面 (Page): page_id (for comments)
- 状态 (Status): pending / approved / rejected / spam
- 提交时间 (Submitted): created_at
- 审核时间 (Reviewed): reviewed_at
- 审核原因 (Reason): review_reason

### Method 3: Admin API (Recommended for Automation)

Use the `/api/admin-review` endpoint for programmatic review:

```bash
# Get all pending items
curl -H "X-Admin-Token: your-token" \
  "https://your-domain.com/api/admin-review?status=pending"

# Approve a comment
curl -X PATCH \
  -H "X-Admin-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "comments",
    "id": "uuid-here",
    "status": "approved"
  }' \
  "https://your-domain.com/api/admin-review"

# Reject with reason
curl -X PATCH \
  -H "X-Admin-Token: your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "guestbook",
    "id": "uuid-here",
    "status": "rejected",
    "reason": "Inappropriate content"
  }' \
  "https://your-domain.com/api/admin-review"
```

---

## Step 5: Test the Workflow

### Local Testing

1. Start the dev server:
```bash
npm run dev
```

2. Submit a comment or guestbook message
3. Check Supabase Dashboard - should show `review_status: 'pending'`
4. Update status to `approved` in Supabase
5. Refresh the page - comment should now appear

### Production Testing

1. Deploy to production
2. Submit test content
3. Verify it appears in Supabase with `review_status: 'pending'`
4. Approve in Supabase
5. Verify it appears on the live site

---

## Step 6: Monitor & Maintain

### Check Pending Items

```sql
-- Count pending items
SELECT COUNT(*) as pending_count FROM comments WHERE review_status = 'pending';
SELECT COUNT(*) as pending_count FROM guestbook WHERE review_status = 'pending';

-- List pending items with details
SELECT 
  id, 
  author_name, 
  content, 
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 as hours_pending
FROM comments 
WHERE review_status = 'pending'
ORDER BY created_at DESC;
```

### Monitor Approval Rate

```sql
SELECT 
  review_status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM comments
GROUP BY review_status;
```

### Set Up Alerts

Consider setting up alerts for:
- More than 10 pending items
- Pending items older than 24 hours
- High spam rate (>20%)

---

## Step 7: Optional - Create Admin Dashboard

To create a simple admin review interface at `/admin/review`:

1. Create `src/views/AdminReviewPage.vue`
2. Add route to `src/router/index.js`
3. Implement review UI using the `/api/admin-review` endpoint

**Example Route:**
```javascript
{
  path: '/admin/review',
  component: () => import('@/views/AdminReviewPage.vue'),
  meta: { title: 'Admin Review' }
}
```

---

## Troubleshooting

### Issue: "Unauthorized" when calling admin API

**Solution**: 
- Verify `ADMIN_REVIEW_TOKEN` is set in environment variables
- Check token is passed correctly in `X-Admin-Token` header
- Ensure token matches exactly (case-sensitive)

### Issue: Pending content not showing to author

**Solution**:
- Check browser localStorage is enabled
- Verify localStorage key: `cncg_guestbook_pending` or `cncg_comments_pending`
- Clear localStorage and resubmit

### Issue: Approved content not appearing on site

**Solution**:
- Verify `review_status` is set to `approved` in Supabase
- Clear browser cache
- Check API response includes `review_status` field
- Verify RLS policies allow reading `approved` status

### Issue: Old `is_approved` column still exists

**Solution**:
- Run migration SQL to drop old column
- Update any custom queries to use `review_status`

---

## Best Practices

1. **Review Regularly**: Check pending items daily
2. **Add Reasons**: Always add `review_reason` for rejections
3. **Track Metrics**: Monitor approval rate and spam rate
4. **Secure Token**: Rotate `ADMIN_REVIEW_TOKEN` monthly
5. **Document Decisions**: Keep notes on why content was rejected
6. **Backup Data**: Regular Supabase backups

---

## Next Steps

- [ ] Run database migration
- [ ] Set `ADMIN_REVIEW_TOKEN` in environment
- [ ] Deploy updated APIs
- [ ] Test workflow locally
- [ ] Test workflow in production
- [ ] Set up monitoring
- [ ] (Optional) Create admin dashboard
- [ ] Document your review process

---

## Support

For issues or questions:
1. Check `REVIEW_WORKFLOW.md` for detailed documentation
2. Review API endpoint specs in `REVIEW_WORKFLOW.md` section 3
3. Check Supabase logs for errors
4. Verify environment variables are set correctly

---

**Last Updated**: 2026-05-20  
**Maintained By**: CNCG Team
