# 🛡️ R&D Pool Services CRM - Disaster Recovery Guide

## 🌐 How to Access Your CRM

### Primary Access
**Live URL:** https://tucker-pool-crm.vercel.app

- ✅ Access from **any device** (computer, phone, tablet)
- ✅ Access from **any location** (home, office, on-site)
- ✅ Works on **any browser** (Chrome, Safari, Firefox, Edge)
- ✅ No installation required

### If Your Computer Breaks
Your CRM is **100% cloud-based**. You can:
1. Use any other computer
2. Use your phone or tablet
3. Borrow a friend's device
4. Use a library computer

Just go to: **https://tucker-pool-crm.vercel.app**

---

## 🔒 Where Your Data is Stored (Multiple Layers)

### Layer 1: Supabase Cloud Database (Primary)
- **Location:** Supabase servers (AWS infrastructure)
- **Backup:** Automatic daily backups by Supabase
- **Access:** https://supabase.com/dashboard/project/ijwtylvekuirzvlreuhp
- **Recovery:** Point-in-time recovery available

### Layer 2: Local Browser Backup (Secondary)
- **Location:** Your browser's localStorage + IndexedDB
- **Backup:** Auto-saves every 2 seconds when you make changes
- **Access:** Settings page → "Check Backup Status"
- **Recovery:** Built-in recovery UI if database fails

### Layer 3: Automated Daily Backups (Tertiary)
- **Location:** Supabase database (app_settings table)
- **Schedule:** Every day at 3:00 AM
- **Retention:** Last 7 days
- **Format:** Full JSON backup of all data

### Layer 4: Manual Export (Your Control)
- **Location:** Your Downloads folder
- **How:** Settings page → "Export Data"
- **Format:** JSON file with all clients, payments, work orders, schedule
- **Recommendation:** Export weekly and save to Google Drive/Dropbox

---

## 📱 Access Methods

| Device | How to Access |
|--------|---------------|
| **Windows PC** | Open browser → https://tucker-pool-crm.vercel.app |
| **Mac** | Open browser → https://tucker-pool-crm.vercel.app |
| **iPhone/iPad** | Safari → https://tucker-pool-crm.vercel.app |
| **Android Phone** | Chrome → https://tucker-pool-crm.vercel.app |
| **Any Tablet** | Any browser → https://tucker-pool-crm.vercel.app |

**Pro Tip:** Add to home screen on mobile for app-like experience:
- **iPhone:** Safari → Share → "Add to Home Screen"
- **Android:** Chrome → Menu → "Add to Home Screen"

---

## 🚨 Disaster Recovery Scenarios

### Scenario 1: Your Computer Breaks
**Solution:** Access from any other device
1. Go to https://tucker-pool-crm.vercel.app
2. All your data is safe in the cloud
3. Continue working immediately

**Data Loss:** ❌ None - everything is in the cloud

---

### Scenario 2: Supabase Database Fails
**Solution:** Automatic local backup recovery
1. Error boundary will detect the issue
2. Click "Recover from Backup" button
3. System loads from localStorage/IndexedDB
4. You can export data and wait for Supabase to recover

**Data Loss:** ⚠️ Minimal - only changes since last auto-save (max 2 seconds)

---

### Scenario 3: You Accidentally Delete Data
**Solution:** Restore from daily backup
1. Contact Supabase support for point-in-time recovery
2. Or restore from your manual export file
3. Settings → Import Data → select backup file

**Data Loss:** ⚠️ Depends on last export (recommend weekly exports)

---

### Scenario 4: Internet Outage
**Solution:** Limited offline access
1. Browser cache allows viewing recently loaded data
2. Cannot save new changes until internet returns
3. Changes are queued and saved when connection restored

**Data Loss:** ⚠️ Any unsaved changes during outage

---

### Scenario 5: Vercel Deployment Fails
**Solution:** Previous deployment remains live
1. Vercel keeps previous working version active
2. Can rollback to any previous deployment
3. Access Vercel dashboard: https://vercel.com/ejns-projects-1b938dd2/tucker-pool-crm

**Data Loss:** ❌ None - database is separate from deployment

---

## 📋 Recommended Backup Strategy

### Daily (Automatic)
- ✅ Auto-backup to Supabase at 3 AM
- ✅ Browser auto-save every 2 seconds

### Weekly (Manual - 5 minutes)
1. Go to Settings page
2. Click "Export Data"
3. Save JSON file to:
   - Google Drive
   - Dropbox
   - External hard drive
   - Email to yourself

### Monthly (Manual - 10 minutes)
1. Export data
2. Save to multiple locations:
   - Cloud storage (Google Drive/Dropbox)
   - External USB drive
   - Email to yourself
3. Test restore by importing to verify backup works

---

## 🔑 Critical Information to Save

Keep these safe (write down or save in password manager):

### Access URLs
- **CRM:** https://tucker-pool-crm.vercel.app
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ijwtylvekuirzvlreuhp
- **Vercel Dashboard:** https://vercel.com/ejns-projects-1b938dd2/tucker-pool-crm

### Login Credentials
- **Supabase Email:** [Your email]
- **Vercel Email:** [Your email]
- **GitHub Account:** [If you have one]

### Emergency Contacts
- **Developer:** Emilio José Novo (NBO)
- **Supabase Support:** https://supabase.com/support
- **Vercel Support:** https://vercel.com/support

---

## 📞 What to Do in an Emergency

### If CRM Won't Load
1. Check internet connection
2. Try different browser
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try from different device
5. Check Vercel status: https://www.vercel-status.com

### If Data is Missing
1. Go to Settings → "Check Backup Status"
2. Click "Recover from Backup"
3. If that fails, import your last manual export
4. Contact Supabase support for database recovery

### If You Need Help
1. Check this guide first
2. Check browser console for errors (F12)
3. Export error logs (Error Boundary → "Export Error Logs")
4. Contact developer with error logs

---

## ✅ Data Safety Checklist

- [x] Cloud database with automatic backups (Supabase)
- [x] Local browser backup (localStorage + IndexedDB)
- [x] Daily automated backups (3 AM cron job)
- [x] Manual export capability
- [x] Error boundary with recovery UI
- [x] Checksum validation on backups
- [x] Version history (last 50 versions in IndexedDB)
- [x] Multi-device access
- [x] No single point of failure

---

## 🎯 Quick Reference

| Question | Answer |
|----------|--------|
| **Can I access from my phone?** | ✅ Yes - https://tucker-pool-crm.vercel.app |
| **What if my computer breaks?** | ✅ Use any device - data is in the cloud |
| **Is my data backed up?** | ✅ Yes - 4 layers of backup |
| **Can I work offline?** | ⚠️ View only - need internet to save |
| **How do I export data?** | Settings → Export Data |
| **Where is data stored?** | Supabase cloud + your browser |
| **Can I lose data?** | ⚠️ Very unlikely with 4 backup layers |
| **How do I recover data?** | Error Boundary → Recover or Settings → Import |

---

## 📱 Mobile App Alternative

While the CRM is web-based, you can make it feel like a native app:

### iPhone/iPad
1. Open Safari → https://tucker-pool-crm.vercel.app
2. Tap Share button (square with arrow)
3. Scroll down → "Add to Home Screen"
4. Name it "R&D Pool CRM"
5. Tap "Add"

### Android
1. Open Chrome → https://tucker-pool-crm.vercel.app
2. Tap Menu (3 dots)
3. Tap "Add to Home Screen"
4. Name it "R&D Pool CRM"
5. Tap "Add"

Now you have an app icon on your home screen!

---

## 🔐 Security Best Practices

1. **Use strong passwords** for Supabase and Vercel accounts
2. **Enable 2FA** on Supabase and Vercel
3. **Don't share** your Supabase credentials
4. **Export data weekly** to your own storage
5. **Keep this guide** in a safe place

---

**Last Updated:** January 26, 2026  
**CRM Version:** 1.0 (Technical Audit Complete)  
**Support:** NBO - Novo Business Order
