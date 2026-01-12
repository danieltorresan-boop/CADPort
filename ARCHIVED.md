# ⚠️ CADPort - ARCHIVED

**Archived Date:** January 13, 2026

## Why This Project Was Archived

CADPort was built using **LibreDWG**, which is licensed under **GPL-3.0-or-later** (strong copyleft license). While this is perfect for open-source tools, it creates legal complications for commercial integrations:

### GPL-3 Strong Copyleft Problem

1. **Licensing Conflict:** Any software that integrates GPL-3 code must also be GPL-3
2. **Commercial Risk:** Using CADPort in commercial applications (like Archad) would require:
   - Open-sourcing the entire commercial codebase
   - Releasing all source code under GPL-3
   - Giving users rights to modify and redistribute
3. **Network Service Gray Area:** While GPL-3 has an "ASP loophole" for network services, it's legally risky and unclear

### Business Decision

After careful consideration, we decided:

- **Archad** (commercial CAD app) will use **Aspose.CAD Cloud API** exclusively
  - Commercial license, no copyleft restrictions
  - Can charge for conversions
  - Full legal clarity

- **CADPort** is being archived because:
  - Cannot safely integrate with commercial software
  - Maintaining two separate systems adds complexity
  - Aspose.CAD Cloud covers all DWG versions (R14-2024+)
  - LibreDWG only supports up to AutoCAD 2018 (~70-80% coverage)

## What This Means

- ✅ **Open Source Community:** CADPort code remains available for reference
- ✅ **GPL-3 Compliance:** Code stays GPL-3 compliant and free
- ❌ **Active Development:** No further updates or maintenance
- ❌ **Production Use:** Not recommended for production deployments
- ❌ **Commercial Integration:** Cannot be used in proprietary software

## Alternative Solutions

If you need DWG/DXF conversion:

1. **For Commercial Apps:** Use [Aspose.CAD Cloud](https://products.aspose.cloud/cad) (paid API)
2. **For Enterprise:** Use [ODA/Teigha SDK](https://www.opendesign.com/) ($1,000-5,000/year)
3. **For Open Source:** Fork this repo and continue under GPL-3
4. **For Personal Use:** Use [Archad](https://archad.pro) (includes DWG import/export)

## Technical Details

**What CADPort Did:**
- Client-side DWG to DXF conversion (R14-2018) using LibreDWG WASM
- Server-side DXF to DWG conversion using LibreDWG CLI tools
- Privacy-focused, no cloud uploads
- 100% free and open source

**Limitations:**
- GPL-3 license incompatible with commercial use
- Only supports AutoCAD R14-2018 (~70-80% of files)
- AutoCAD 2019+ files not supported
- LibreDWG is slower than commercial alternatives

## License

This project remains licensed under **GPL-3.0-or-later** as required by LibreDWG.

## Contact

For questions about this decision or DWG conversion needs:
- Email: support@archad.pro
- Website: https://archad.pro

---

**Thank you to everyone who contributed to and used CADPort!** 🙏

The code remains available for educational purposes and as a reference implementation of LibreDWG in web applications.
