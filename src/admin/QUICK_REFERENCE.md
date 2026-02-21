/**
 * QUICK REFERENCE GUIDE
 * Admin Authentication System
 */

// ============================================================================
// HOW TO LOGIN
// ============================================================================

// 1. Navigate to /admin-login
// 2. Enter password: admin123
// 3. Click "Login to Admin Panel"
// 4. Token saved to localStorage['kk_admin_token']
// 5. Redirected to /admin dashboard

// ============================================================================
// HOW TO ACCESS AUTH IN COMPONENTS
// ============================================================================

import { useAdminAuth } from '@/admin/context/useAdminAuth'

function MyComponent() {
  const { isAdminAuthenticated, loginAdmin, logoutAdmin, verifyAdminToken } = useAdminAuth()
  
  // Check if logged in
  if (!isAdminAuthenticated) {
    return <p>Not logged in</p>
  }
  
  // Logout
  const handleLogout = () => {
    const result = logoutAdmin()
    if (result.success) {
      navigate('/admin-login')
    }
  }
  
  return <button onClick={handleLogout}>Logout</button>
}

// ============================================================================
// PROTECTED ROUTES
// ============================================================================

// All these routes automatically redirect to /admin-login if not authenticated:

// ✅ Protected
/admin
/admin/products
/admin/analytics
/admin/reports
/admin/upload
/admin/cms/home
/admin/cms/footer
/admin/cms/our-story
/admin/pages

// ✅ Public (not protected)
/admin-login

// ============================================================================
// TOKEN VALIDATION
// ============================================================================

// Token Format:
// "admin_<timestamp>_<randomSuffix>"
// Example: "admin_1738882743000_a1b2c3d"

// Token Storage:
// localStorage.getItem('kk_admin_token')

// Token Checked On:
1. App load (restore session)
2. Access to protected /admin routes
3. Manual verification with verifyAdminToken()

// Token Cleared When:
- User logs out
- Token expires (> 7 days old)
- Token format is invalid
- App loads and finds invalid token

// ============================================================================
// LOGOUT BEHAVIOR
// ============================================================================

// Before (old code):
// handleLogout() → navigate('/')  ❌

// After (new code):
// handleLogout() → logoutAdmin() → navigate('/admin-login')  ✅

// This ensures admin is returned to admin login, not customer home

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

// Issue: Can't login
// Solution: Check password is "admin123"
//           Check caps lock
//           Try clearing localStorage first

// Issue: Auto logged out after refresh
// Solution: Token might be expired (> 7 days)
//           Try logging in again
//           Check console for validation errors

// Issue: Unauthorized redirect
// Solution: Token missing or invalid
//           Login again at /admin-login
//           Check localStorage for token

// Issue: Can't access /admin routes
// Solution: Must login first
//           Visit /admin-login with password "admin123"
//           Check if AdminRoute is protecting the route

// ============================================================================
// WHAT NOT TO CHANGE
// ============================================================================

// ❌ Don't change password in code (move to env var in production)
// ❌ Don't store token in regular variables (use localStorage)
// ❌ Don't remove AdminRoute from protected routes
// ❌ Don't change token validation logic
// ❌ Don't manually edit token in localStorage

// ✅ DO update password for production
// ✅ DO implement backend authentication in production
// ✅ DO add environment variables
// ✅ DO implement 2FA for production
// ✅ DO use httpOnly cookies in production

// ============================================================================
// PROVIDER HIERARCHY
// ============================================================================

// App.jsx structure:
// <Router>
//   <AdminAuthProvider>                    ← Admin authentication
//     <AuthProvider>                       ← Customer authentication
//       <ProductProvider>                  ← Products
//         <CartProvider>                   ← Shopping cart
//           <Routes>...</Routes>
//         </CartProvider>
//       </ProductProvider>
//     </AuthProvider>
//   </AdminAuthProvider>
// </Router>

// Key: AdminAuthProvider must be OUTSIDE AuthProvider
// This keeps admin and customer auth completely separate

// ============================================================================
// CONTEXT VALUES
// ============================================================================

const {
  isAdminAuthenticated,  // boolean - true if logged in
  adminLoading,          // boolean - true while checking token
  loginAdmin,            // function(password) - login
  logoutAdmin,           // function() - logout
  verifyAdminToken,      // function() - verify current token
} = useAdminAuth()

// ============================================================================
// FILE LOCATIONS
// ============================================================================

// Core files:
src/admin/context/AdminAuthContext.jsx     ← Context & token logic
src/admin/context/useAdminAuth.js          ← Hook for accessing auth
src/admin/AdminRoute.jsx                   ← Protected route guard
src/admin/AdminLogin.jsx                   ← Login page

// Modified files:
src/App.jsx                                ← Provider + protected routes
src/admin/AdminOnlyLayout.jsx              ← Logout with new handler

// Documentation:
src/admin/AUTHENTICATION_DOCS.md           ← Full documentation
src/admin/IMPLEMENTATION_SUMMARY.md        ← Complete implementation details
src/admin/QUICK_REFERENCE.md               ← This file

// ============================================================================
// ADMIN PASSWORD LOCATION
// ============================================================================

// File: src/admin/context/AdminAuthContext.jsx
// Line: ~67
// Current: const ADMIN_PASSWORD = 'admin123'

// To change:
// 1. Open AdminAuthContext.jsx
// 2. Find ADMIN_PASSWORD constant
// 3. Change value
// 4. Restart dev server
// 5. Use new password to login

// Example:
// const ADMIN_PASSWORD = 'mySecurePassword123!'

// ============================================================================
// TESTING COMMANDS
// ============================================================================

// Start dev server:
$ npm run dev

// Check for errors:
$ npm run lint

// Build for production:
$ npm run build

// In browser console, you'll see:
// ✅ Admin session restored from token          (on init, if logged in)
// ✅ Admin login successful                     (on login)
// ⚠ Unauthorized admin access attempt           (tried to access without auth)
// ❌ Token validation error: ...                (token is corrupted)

// ============================================================================
// SECURITY SUMMARY
// ============================================================================

✅ IMPLEMENTED:
   • Token format validation
   • Token expiry check (7 days)
   • Token auto-cleanup on invalid
   • Route protection (AdminRoute)
   • Session persistence
   • Error handling
   • Authorization checks
   • Logout clears token

⚠ FOR PRODUCTION:
   • Move password to environment variable
   • Implement JWT tokens from backend
   • Use httpOnly cookies instead of localStorage
   • Add password hashing (bcrypt)
   • Implement 2FA
   • Add multi-admin support
   • Implement audit logging
   • Use HTTPS only

// ============================================================================
*/
