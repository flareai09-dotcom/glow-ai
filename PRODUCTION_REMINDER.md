# 🚀 Glow AI - Production Checklist & Security Improvements

This is a reminder for the final "Production/Professional" phase of development. 

### 🔐 Admin Security Refactoring
Currently, admin access is partially managed through hardcoded credentials in `src/context/AuthContext.tsx` via the `ADMIN_CREDS` object. 

**Action Items for Production:**
1. **Remove Hardcoded List**: Remove the `ADMIN_CREDS` object from `AuthContext.tsx`.
2. **Database-Driven Authorization**: Update the `checkAdmin` logic to exclusively check the `is_admin` column in the `profiles` table in Supabase.
3. **Secure Redirection**: Replace the hardcoded email/phone check with a backend database check during the splash screen/login flow.
4. **Master Password Disposal**: Disable the "Smart Auto-Signup" logic that uses the `admin@123` master password. Require admins to set their own strong passwords.

### 📦 Other Production Considerations:
- [ ] Move any remaining API keys to a secure environment variables manager.
- [ ] Enable Rate Limiting on Supabase Auth.
- [ ] Set up a proper logging system for tracking sensitive inventory changes (already partially implemented with `admin_logs`).

---
*Created by Antigravity AI on 2026-02-03*
