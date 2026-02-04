# Fixing Blank Screen Issue

## Quick Checks

1. **Open Browser Console** (F12 or Cmd+Option+I)
   - Look for red error messages
   - Share any errors you see

2. **Verify URL**
   - Make sure you're at: **http://localhost:5173/inbox**
   - Not just http://localhost:5173 (that shows Dashboard)

3. **Hard Refresh**
   - Mac: Cmd + Shift + R
   - Windows: Ctrl + Shift + R

4. **Check Network Tab**
   - Open DevTools → Network tab
   - Refresh page
   - Look for failed requests (red)

## Common Causes

### JavaScript Error
If you see errors in console, they might be:
- Import path issues
- Missing component exports
- Type errors

### CSS Issue
- Component might be rendering but invisible
- Check if elements exist in DOM (Elements tab)

### Route Issue
- Make sure you're on `/inbox` route
- Try navigating from home page sidebar

## Next Steps

Please check your browser console and share:
1. Any error messages (red text)
2. What you see in the Network tab
3. Whether the page title shows "Case Analytics & Evaluation - DocSumo"

The server is confirmed running on port 5173, so the issue is likely in the browser rendering.
