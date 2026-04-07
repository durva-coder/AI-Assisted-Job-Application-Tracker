# OpenAI Rate Limit Error Handling

## Overview
The application now properly detects and displays user-friendly alerts when OpenAI API rate limits (429 errors) or authentication issues occur.

## What Was Added

### Backend Changes

#### 1. Enhanced Error Detection (`backend/src/services/openai.ts`)
- Detects OpenAI 429 rate limit errors
- Detects OpenAI 401 authentication errors
- Throws structured errors with type indicators:
  ```typescript
  {
    status: 429,
    message: "You exceeded your current quota...",
    type: "rate_limit"
  }
  ```

#### 2. Route Error Handling (`backend/src/routes/ai.ts`)
- Catches rate limit errors and returns 429 status
- Catches auth errors and returns 500 status
- Returns structured error responses:
  ```json
  {
    "error": "OpenAI API rate limit exceeded",
    "message": "You exceeded your current quota...",
    "type": "rate_limit"
  }
  ```

### Frontend Changes

#### 1. API Client Helpers (`frontend/src/api/client.ts`)
Added utility functions:
- `isRateLimitError(error)` - Checks if error is a rate limit
- `getErrorMessage(error)` - Extracts user-friendly message

#### 2. KanbanPage (`frontend/src/pages/KanbanPage.tsx`)
- Added `apiError` state for displaying alerts
- Added `handleApiError` function to process errors
- Shows prominent alert banner when Parse JD fails
- Auto-dismisses after 10 seconds

#### 3. ApplicationModal (`frontend/src/components/ApplicationModal.tsx`)
- Added `apiError` state
- Enhanced `handleGenerateSuggestions` with error handling
- Shows alert banner at top of form
- Auto-dismisses after 10 seconds

## Error Alert Appearance

The alerts display with:
- 🔴 Red background (adapts to dark mode)
- ⚠️ Alert icon
- Clear, user-friendly message
- Dismiss button (×)
- Auto-dismiss after 10 seconds

### Example Alert Message
```
⚠️ OpenAI API Rate Limit: You exceeded your current quota, please check your plan 
and billing details. Please check your plan and billing details, or try again later.
```

## Error Types Handled

### 1. Rate Limit Error (429)
**Cause**: OpenAI API quota exceeded
**User Message**: Shows the specific quota message from OpenAI
**Action Required**: User needs to check their OpenAI plan/billing

### 2. Authentication Error (401)
**Cause**: Invalid or missing OpenAI API key
**User Message**: "Invalid OpenAI API key. Please check your configuration."
**Action Required**: User needs to update OPENAI_API_KEY in .env

### 3. Generic Errors
**Cause**: Network issues, OpenAI down, etc.
**User Message**: "An error occurred. Please try again."
**Action Required**: Try again later

## Testing the Error Handling

### Test Rate Limit Error
1. Set up OpenAI API key with no quota
2. Try to parse a job description
3. Should see red alert banner with quota message

### Test Auth Error  
1. Set invalid OPENAI_API_KEY in backend .env
2. Try to use AI features
3. Should see "Invalid OpenAI API key" message

### Test Generic Error
1. Stop backend server
2. Try to use AI features
3. Should see "An error occurred" message

## Files Modified

### Backend
- `backend/src/services/openai.ts` - Error detection
- `backend/src/routes/ai.ts` - Error handling in routes

### Frontend  
- `frontend/src/api/client.ts` - Helper functions
- `frontend/src/pages/KanbanPage.tsx` - Parse JD error display
- `frontend/src/components/ApplicationModal.tsx` - Resume suggestions error display

## User Experience

### Before
- Generic "Failed to parse job description" message
- No indication of quota issues
- Console-only errors
- Confusing for users

### After
- Clear, visible red alert banners
- Specific error messages explaining the issue
- Mentions quota/billing when rate limited
- Dismissible alerts
- Auto-dismiss after 10 seconds
- User-friendly language

## Developer Experience

### Error Logging
All errors are still logged to console for debugging:
```javascript
console.error('Parse JD error:', error);
```

### Structured Errors
Backend returns consistent error structure for easy client handling:
```typescript
{
  error: string;      // User-friendly title
  message: string;    // Detailed message
  type: string;       // Error type for programmatic handling
}
```

## Future Improvements

Possible enhancements:
1. Add retry button with countdown timer
2. Show quota usage dashboard
3. Cache AI results to reduce API calls
4. Add fallback mock data when rate limited
5. Email notifications for repeated rate limits
6. Link to OpenAI billing page in error message

## OpenAI Rate Limits

### GPT-4o-mini Free Tier
- **RPM** (Requests Per Minute): ~200
- **TPM** (Tokens Per Minute): ~200,000
- **RPD** (Requests Per Day): Varies

### Check Your Quota
1. Visit: https://platform.openai.com/settings/organization/billing
2. Check current usage vs limits
3. Upgrade plan if needed

### Reduce API Calls
- Cache parsed job descriptions
- Batch requests when possible
- Use lower temperature for consistency
- Keep prompts concise

## Support

If users report rate limit issues:
1. Check OpenAI billing dashboard
2. Verify API key is correct
3. Review usage statistics
4. Consider upgrading plan
5. Check for unexpected usage spikes

---

**Status**: ✅ Implemented and tested
**Build**: Both backend and frontend compile successfully
**Ready for**: Production deployment
