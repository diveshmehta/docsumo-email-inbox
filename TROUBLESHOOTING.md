# Troubleshooting Blank Screen

If you're seeing a blank screen, try these steps:

## 1. Check Browser Console

Open your browser's developer console (F12 or Cmd+Option+I on Mac) and look for:
- **Red error messages** - These indicate JavaScript errors
- **Network errors** - Check if files are loading correctly

## 2. Verify URL

Make sure you're accessing:
- **http://localhost:5173/inbox** (direct link to Email Inbox)
- Or **http://localhost:5173** then click "Email Inbox" in sidebar

## 3. Clear Browser Cache

Try hard refresh:
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + R

## 4. Check Server Status

The dev server should be running. Check terminal for:
- ✅ "Local: http://localhost:5173"
- ✅ No error messages
- ✅ "ready in X ms"

## 5. Common Issues

### Issue: Blank white screen
**Solution**: Check browser console for errors. Common causes:
- Missing dependencies (run `npm install`)
- TypeScript errors (check terminal)
- Import path issues

### Issue: "Cannot find module" errors
**Solution**: 
```bash
npm install
npm run dev
```

### Issue: Port already in use
**Solution**: Vite will automatically use next available port. Check terminal for actual port number.

## 6. Verify Files Exist

Check that these files exist:
- ✅ `src/pages/EmailInbox.tsx`
- ✅ `src/hooks/useEmailData.ts`
- ✅ `src/components/ui/*` (all UI components)

## 7. Restart Dev Server

If nothing works:
1. Stop server (Ctrl+C)
2. Run: `npm run dev`
3. Wait for "ready" message
4. Refresh browser

## 8. Check Network Tab

In browser DevTools → Network tab:
- Look for failed requests (red)
- Check if JavaScript files are loading
- Verify status codes are 200

## Still Having Issues?

Share:
1. Browser console errors (if any)
2. Terminal output from `npm run dev`
3. What you see (blank screen, error message, etc.)
