# Error Alert Visual Guide

## What Users Will See

### 🔴 Rate Limit Error Alert

When OpenAI returns a 429 error (quota exceeded):

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  ⚠️ OpenAI API Rate Limit: You exceeded your current quota,    │
│     please check your plan and billing details. Please check    │
│     your plan and billing details, or try again later.     [×]  │
└─────────────────────────────────────────────────────────────────┘
```

**Appearance:**
- Red background (light red in light mode, dark red in dark mode)
- Warning icon on the left
- Clear error message
- Dismiss button (×) on the right
- Automatically disappears after 10 seconds

**Where it appears:**
1. **KanbanPage** - When parsing job descriptions
2. **ApplicationModal** - When generating resume suggestions

---

### 🔴 API Key Error Alert

When OpenAI API key is invalid (401 error):

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  OpenAI API configuration error: Invalid OpenAI API key.    │
│     Please check your configuration.                      [×]  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 🔴 Generic Error Alert

For other errors (network issues, etc.):

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  An error occurred. Please try again.                 [×]  │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Journey Examples

### Example 1: Parsing Job Description with Rate Limit

**User Action:**
1. User clicks "Parse JD" button
2. Pastes job description
3. Clicks "Parse & Create Card"

**If Rate Limited:**
```
1. Loading spinner appears briefly
2. Modal closes
3. Red alert banner appears at top of page
4. Message: "⚠️ OpenAI API Rate Limit: You exceeded your current quota..."
5. Alert auto-dismisses after 10 seconds
6. User can manually dismiss by clicking ×
```

### Example 2: Generating Resume Suggestions

**User Action:**
1. User opens/clicks an application
2. Scrolls to Resume Suggestions section
3. Clicks "Generate" or "Regenerate" button

**If Rate Limited:**
```
1. Loading spinner shows on button
2. Red alert banner appears at top of modal
3. Message: "⚠️ OpenAI API Rate Limit: You exceeded your current quota..."
4. Button returns to normal state
5. Alert auto-dismisses after 10 seconds
6. User can manually dismiss by clicking ×
```

---

## Dark Mode Appearance

### Light Mode
```
┌──────────────────────────────────────────────────────────────┐
│ 📍 Red-50 background (#FEF2F2)                               │
│ 🔴 Red-600 icon & borders (#DC2626)                          │
│ ⚫ Red-800 text (#991B1B)                                    │
└──────────────────────────────────────────────────────────────┘
```

### Dark Mode
```
┌──────────────────────────────────────────────────────────────┐
│ 📍 Red-900/20 background (20% opacity)                       │
│ 🔴 Red-400 icon & borders (#F87171)                          │
│ ⚪ Red-300 text (#FCA5A5)                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Technical Flow

### Backend Error Detection
```
OpenAI API
    ↓ (429 error)
openai.ts catches error
    ↓
Checks error.status === 429
    ↓
Throws structured error:
{
  status: 429,
  message: "You exceeded your current quota...",
  type: "rate_limit"
}
    ↓
ai.ts route handler
    ↓
Returns HTTP 429 with:
{
  error: "OpenAI API rate limit exceeded",
  message: "You exceeded your current quota...",
  type: "rate_limit"
}
```

### Frontend Error Display
```
API call fails
    ↓
Catch block in component
    ↓
isRateLimitError(error) → true
    ↓
getErrorMessage(error) → extracts message
    ↓
setApiError("⚠️ OpenAI API Rate Limit: ...")
    ↓
React renders alert banner
    ↓
setTimeout removes alert after 10s
```

---

## Color Specifications

### Alert Banner Styles
```css
/* Light Mode */
background: bg-red-50        (#FEF2F2)
border: border-red-200       (#FECACA)
icon: text-red-600           (#DC2626)
text: text-red-800           (#991B1B)

/* Dark Mode */
background: bg-red-900/20    (rgba(127, 29, 29, 0.2))
border: border-red-800       (#991B1B)
icon: text-red-400           (#F87171)
text: text-red-300           (#FCA5A5)
```

### Responsive Behavior
- **Mobile**: Full width with padding
- **Desktop**: Max width constraint
- **Icon**: Always visible, never shrinks
- **Dismiss button**: Always accessible

---

## Accessibility Features

✅ **Keyboard Accessible**
- Dismiss button focusable with Tab
- Activatable with Enter/Space

✅ **Screen Reader Friendly**
- Clear, descriptive text
- Icon supplemented with text

✅ **Color Contrast**
- Meets WCAG AA standards
- Works in both light and dark modes

✅ **Timing**
- Auto-dismiss gives enough time to read
- Manual dismiss always available
- No flashing or rapid animations

---

## Error Message Examples

### Actual OpenAI 429 Messages
```
"You exceeded your current quota, please check your plan and billing details."
```

```
"Rate limit reached. Please try again later."
```

### What Users See
```
"⚠️ OpenAI API Rate Limit: You exceeded your current quota, please check your 
plan and billing details. Please check your plan and billing details, or try 
again later."
```

---

## Comparison: Before vs After

### ❌ Before
- Generic error in console
- No user feedback
- Confusing failures
- Silent errors

### ✅ After
- Prominent red alert banner
- Clear error message
- Specific guidance (check billing)
- Dismissible + auto-dismiss
- Works in dark mode
- Accessible to screen readers

---

## Quick Test Checklist

To verify error handling works:

- [ ] Parse JD with invalid API key → See auth error
- [ ] Parse JD with no quota → See rate limit error  
- [ ] Generate suggestions with no quota → See rate limit error
- [ ] Click × on alert → Alert dismisses
- [ ] Wait 10 seconds → Alert auto-dismisses
- [ ] Toggle dark mode → Alert colors adapt
- [ ] Test on mobile → Alert responsive
- [ ] Check console → Errors still logged

---

**All error states are now handled gracefully! 🎉**
