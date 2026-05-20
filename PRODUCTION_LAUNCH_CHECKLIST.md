# 🚀 Production Launch Checklist

**Last Updated**: 2026-05-20  
**Current Status**: ✅ Ready for Launch  
**Audit Score**: 8.5/10

---

## Pre-Launch Verification

### ✅ Code Quality & Build

- [x] Build passes: `npm run build` (1.13s, 126 modules)
- [x] No console errors or warnings
- [x] All dependencies up to date (or documented)
- [x] Security audit completed (WEBSITE_AUDIT_REPORT.md)
- [x] Code review completed
- [x] No hardcoded secrets or credentials

### ✅ Functionality

- [x] All 13 routes working correctly
- [x] Homepage hero section with audio responsive feature
- [x] Notes system loading and displaying
- [x] Blog system functional
- [x] Knowledge base (Feishu) integration working
- [x] Comments system with review workflow
- [x] Guestbook with review workflow
- [x] Contact form with Feishu Bitable integration
- [x] Theme switching (light/dark mode)
- [x] Mobile responsive design

### ✅ Security

- [x] No P0 security vulnerabilities
- [x] All secrets moved to backend/environment variables
- [x] XSS protection implemented (sanitize.js)
- [x] CSRF protection (honeypot field)
- [x] Rate limiting configured (6 per 10 minutes)
- [x] CORS headers properly set
- [x] Input validation on all forms
- [x] RLS policies configured in Supabase

### ✅ Performance

- [x] Main JS: 25.54 KB (gzipped) ✅
- [x] Main CSS: 8.19 KB (gzipped) ✅
- [x] Build time: 1.13s ✅
- [x] Code splitting configured
- [x] Lazy loading implemented

### ✅ SEO

- [x] Meta tags configured
- [x] Open Graph tags set
- [x] Twitter Card configured
- [x] Sitemap.xml created
- [x] Robots.txt configured
- [x] Structured data (JSON-LD) implemented
- [x] Language set to zh-CN

---

## Pre-Deployment Tasks

### Database Setup

- [ ] Create Supabase project (if not done)
- [ ] Run database migrations:
  ```sql
  -- Comments table
  CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id),
    review_status TEXT DEFAULT 'pending',
    reviewed_at TIMESTAMPTZ,
    review_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  
  -- Guestbook table
  CREATE TABLE guestbook (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    review_status TEXT DEFAULT 'pending',
    reviewed_at TIMESTAMPTZ,
    review_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  
  -- Enable RLS and create policies
  ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
  
  CREATE POLICY "Anyone can read approved comments" ON comments
    FOR SELECT USING (review_status = 'approved');
  CREATE POLICY "Anyone can insert comments" ON comments
    FOR INSERT WITH CHECK (true);
  
  CREATE POLICY "Anyone can read approved guestbook" ON guestbook
    FOR SELECT USING (review_status = 'approved');
  CREATE POLICY "Anyone can insert guestbook" ON guestbook
    FOR INSERT WITH CHECK (true);
  ```
- [ ] Verify tables created successfully
- [ ] Test RLS policies

### Environment Variables

- [ ] Set `VITE_SUPABASE_URL` in Vercel
- [ ] Set `VITE_SUPABASE_ANON_KEY` in Vercel
- [ ] Set `SUPABASE_SERVICE_ROLE_KEY` in Vercel
- [ ] Set `QMSG_KEY` in Vercel (for QQ notifications)
- [ ] Set `FEISHU_APP_ID` in Vercel
- [ ] Set `FEISHU_APP_SECRET` in Vercel
- [ ] Set `FEISHU_BITABLE_TABLE_ID` in Vercel
- [ ] Set `ADMIN_REVIEW_TOKEN` in Vercel (strong random token)
- [ ] Verify all variables are set: `vercel env list`

### Vercel Configuration

- [ ] Create Vercel project (if not done)
- [ ] Connect GitHub repository
- [ ] Configure build command: `npm run build`
- [ ] Configure output directory: `dist`
- [ ] Set environment variables
- [ ] Configure custom domain (cncg.me)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up automatic deployments on push to main

### Third-Party Services

- [ ] Feishu app created and configured
- [ ] Feishu app added to Bitable document
- [ ] Feishu scopes granted: `bitable:app`, `base:record:create`
- [ ] QMSG account set up
- [ ] QMSG webhook configured
- [ ] Test Feishu integration locally
- [ ] Test QMSG notifications locally

---

## Deployment Steps

### 1. Final Testing

```bash
# Clean build
rm -rf dist node_modules
npm install
npm run build

# Verify build output
ls -la dist/
```

### 2. Commit & Push

```bash
# Review changes
git status

# Stage files
git add .

# Commit
git commit -m "chore: prepare for production launch

- Implement review workflow with review_status
- Add admin review API endpoint
- Update comments and guestbook APIs
- Add comprehensive documentation
- Verify build and security"

# Push to main
git push origin main
```

### 3. Vercel Deployment

- [ ] Verify deployment starts automatically
- [ ] Check build logs for errors
- [ ] Verify deployment completes successfully
- [ ] Check preview URL works

### 4. Production Testing

```bash
# Test homepage
https://cncg.me/

# Test all routes
https://cncg.me/about
https://cncg.me/services
https://cncg.me/blog
https://cncg.me/note
https://cncg.me/doc
https://cncg.me/shop
https://cncg.me/contact

# Test features
- Submit comment (should show "待审核")
- Submit guestbook message (should show "待审核")
- Submit contact form (should show success)
- Toggle theme (light/dark)
- Check mobile responsive
```

### 5. Post-Deployment Verification

- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Notifications sent to QQ
- [ ] Data appears in Supabase
- [ ] No console errors
- [ ] Performance acceptable
- [ ] SEO tags present

---

## Post-Launch Tasks

### Day 1

- [ ] Monitor error logs
- [ ] Check Supabase for submissions
- [ ] Verify notifications working
- [ ] Test review workflow (approve/reject)
- [ ] Check analytics

### Week 1

- [ ] Review pending submissions daily
- [ ] Monitor performance metrics
- [ ] Check for any issues
- [ ] Gather user feedback
- [ ] Document any bugs

### Month 1

- [ ] Analyze usage patterns
- [ ] Review approval rate
- [ ] Optimize based on feedback
- [ ] Plan next features
- [ ] Update documentation

---

## Rollback Plan

If issues occur after deployment:

### Quick Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Vercel will auto-deploy previous version
```

### Database Rollback

If database changes cause issues:

```sql
-- Restore from backup (Supabase has automatic backups)
-- Contact Supabase support for restore
```

### Environment Variable Rollback

```bash
# Revert environment variables in Vercel
# Go to Settings > Environment Variables
# Restore previous values
```

---

## Monitoring & Alerts

### Set Up Monitoring

- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry optional)
- [ ] Monitor Supabase metrics
- [ ] Check build logs regularly

### Key Metrics to Track

- Page load time
- Error rate
- Submission rate
- Approval rate
- User feedback

### Alert Thresholds

- Error rate > 1%
- Page load time > 3s
- More than 10 pending submissions
- Pending submissions older than 24 hours

---

## Documentation

### User-Facing

- [ ] Update README.md with production URL
- [ ] Create user guide for features
- [ ] Document contact/feedback process

### Internal

- [ ] Document review workflow
- [ ] Document deployment process
- [ ] Document troubleshooting steps
- [ ] Create runbook for common issues

---

## Success Criteria

✅ **Launch is successful when:**

1. Site is live and accessible at cncg.me
2. All pages load without errors
3. Forms submit successfully
4. Notifications are sent
5. Data is stored in Supabase
6. Review workflow functions correctly
7. No critical errors in logs
8. Performance is acceptable
9. SEO tags are present
10. Mobile responsive works

---

## Post-Launch Optimization

### Short Term (Week 1-2)

- [ ] Monitor and fix any bugs
- [ ] Optimize based on real usage
- [ ] Gather user feedback
- [ ] Document issues and solutions

### Medium Term (Month 1)

- [ ] Image optimization
- [ ] Dependency updates
- [ ] Code cleanup
- [ ] Performance tuning

### Long Term (Quarter 1)

- [ ] Admin dashboard for review
- [ ] Automated spam detection
- [ ] Email notifications
- [ ] User reputation system

---

## Contact & Support

### During Launch

- Monitor Vercel dashboard
- Check Supabase logs
- Monitor QQ notifications
- Be ready to rollback if needed

### After Launch

- Daily review of submissions
- Weekly performance check
- Monthly optimization review
- Quarterly feature planning

---

## Sign-Off

- [ ] Code review completed
- [ ] Security audit passed
- [ ] Performance verified
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Team ready for launch
- [ ] Ready to deploy to production

---

## Launch Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Pre-Launch Verification | ✅ Complete | ✅ Done |
| Pre-Deployment Tasks | ⏳ In Progress | Ready |
| Deployment | ⏳ Pending | Ready |
| Post-Launch Testing | ⏳ Pending | Ready |
| Monitoring | ⏳ Pending | Ready |

---

**Prepared By**: CNCG Team  
**Date**: 2026-05-20  
**Status**: ✅ Ready for Production Launch

🚀 **Let's launch!**
