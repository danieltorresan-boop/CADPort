# DWG Version Support Options for CADPort & Archad

## Current Situation

**LibreDWG (Current Implementation):**
- ✅ Free and open-source (GPL-3.0)
- ✅ Works in browser via WebAssembly
- ❌ **Only supports AutoCAD R14-2018** (up to ~2015)
- ❌ **Does NOT support AutoCAD 2019-2025** (last 6-10 years)

## The Problem

Most modern DWG files are created with AutoCAD 2019+ and **cannot be converted** with the current free solution.

---

## Solution Options

### Option 1: Keep Free Solution with Limitations ⭐ (Current)

**Pros:**
- $0 cost
- 100% client-side (privacy)
- Legally separate from Archad
- Works for older files

**Cons:**
- Only supports files up to 2018
- Excludes most modern DWG files
- Poor user experience for users with newer files

**Recommendation:** Accept this as v1.0 limitation, add clear warning to users

---

### Option 2: ODA/Teigha SDK (Commercial License) 💰

**Cost:** $1,000 - $5,000/year

**Pros:**
- ✅ Supports **ALL AutoCAD versions** including 2024/2025
- ✅ Official Autodesk-endorsed solution
- ✅ Can integrate directly into Archad (proprietary license)
- ✅ Reliable, well-maintained
- ✅ Supports DWG read/write

**Cons:**
- Expensive for early-stage product
- Requires server-side processing (can't run in browser)
- Ongoing annual cost

**When to use:** When Archad revenue > $50K/year

**Implementation:**
- Set up Node.js backend server
- Upload DWG → Server converts → Return DXF
- User never knows it's happening on server

---

### Option 3: Cloud Conversion API (Pay-per-use) 💳

**Examples:**
- CloudConvert API
- Aspose.CAD Cloud API
- AutoDWG API

**Cost:** $0.01 - $0.10 per conversion

**Pros:**
- ✅ Supports modern AutoCAD versions
- ✅ No upfront cost (pay as you go)
- ✅ Easy to implement
- ✅ Scalable

**Cons:**
- Privacy concerns (files uploaded to third-party)
- Ongoing per-conversion cost
- Requires internet connection
- Depends on external service

**When to use:** Testing market demand before committing to ODA

---

### Option 4: Hybrid Approach (Smart!) ⭐⭐

**Strategy:**
1. **Try LibreDWG first** (free, client-side)
2. **If fails**, offer user choice:
   - "This file requires a newer AutoCAD version"
   - Button: "Convert using cloud service ($0.10)"
   - Or: "Download and save as AutoCAD 2018 format"

**Pros:**
- ✅ Free for most users (older files work)
- ✅ Paid option for modern files
- ✅ User choice and transparency
- ✅ Revenue opportunity

**Implementation:**
```javascript
// Pseudo-code
try {
  // Try free LibreDWG conversion
  const result = await convertWithLibreDWG(file);
  return result;
} catch (error) {
  if (error.code === 'UNSUPPORTED_VERSION') {
    // Show dialog: "Use cloud conversion for $0.10?"
    if (userAccepts) {
      return await convertWithCloudAPI(file);
    }
  }
}
```

---

### Option 5: Server-Side LibreDWG (Free but Limited) 🔧

**Strategy:**
- Use latest LibreDWG on backend (might support newer versions)
- Still GPL-3.0 (free)
- Server-side conversion

**Pros:**
- Free
- Might support slightly newer versions
- Faster than browser WASM

**Cons:**
- Still won't support 2024/2025
- Requires server infrastructure
- Files uploaded to your server

---

## Recommended Path Forward

### Phase 1 (Now): Free Solution with Clear Limitations
- ✅ Keep current CADPort implementation
- ✅ Add prominent warning: "Supports AutoCAD R14-2018 only"
- ✅ Fix the "stuck at 10%" bug
- ✅ Test with confirmed older files

### Phase 2 (When Revenue > $10K/year): Hybrid Approach
- Add cloud conversion API option
- Charge $0.25-$0.50 per conversion
- Revenue offsets API costs + margin

### Phase 3 (When Revenue > $50K/year): ODA/Teigha SDK
- Purchase ODA license ($1,000-5,000/year)
- Implement server-side conversion
- Support ALL AutoCAD versions
- Premium feature or included in subscription

---

## User Communication Strategy

### On CADPort Homepage:
```
⚠️ Important: Supports AutoCAD R14-2018 DWG files only

Newer files (AutoCAD 2019+)?
• Option 1: Save as "AutoCAD 2018 DWG" in your CAD software
• Option 2: Use cloud conversion (coming soon)
```

### Error Message:
```
❌ This DWG file is from AutoCAD 2019 or newer

CADPort currently supports files up to AutoCAD 2018.

Solutions:
1. Re-save your file as "AutoCAD 2018 DWG" format
2. Use a commercial converter (CloudConvert, etc.)
3. Contact us about premium conversion options
```

---

## Technical Investigation: "Stuck at 10%" Bug

This needs debugging. Potential causes:
1. **File corruption**
2. **Specific DWG features** not supported
3. **Memory issues** with large files
4. **WASM module hanging** on certain operations

**Action Items:**
- Test with multiple known-good AutoCAD 2013-2018 files
- Add timeout mechanism (already implemented)
- Log exactly where it hangs
- Test file size limits (1MB, 10MB, 100MB files)

---

## Bottom Line

**For now:**
1. Fix the hanging issue
2. Test with confirmed AutoCAD 2013-2018 files
3. Add clear version warnings
4. Accept limitation as v1.0

**For later:**
- Plan budget for ODA/Teigha when revenue justifies it
- Consider hybrid approach for monetization

**Sources:**
- [LibreDWG Documentation](https://www.gnu.org/software/libredwg/)
- [CloudConvert DWG API](https://cloudconvert.com/dwg-converter)
- [ODA Platform](https://www.opendesign.com/)
