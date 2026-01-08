# ⚠️ CADPort - ARCHIVED

This project has been archived as of January 2026.

## Why was this archived?

CADPort was created as a free, client-side DWG to DXF converter using LibreDWG (GPL-3.0 license). However, we discovered that:

1. **LibreDWG only supports AutoCAD R14-2018** - Files from AutoCAD 2019-2025 (the last 6+ years) are not supported
2. **Most modern DWG files use 2019+ formats** - This made the tool unusable for the majority of users
3. **Cloud APIs are more practical** - Services like Aspose.CAD Cloud and others support all DWG versions

## What happened to the functionality?

DWG import functionality has been integrated directly into **[Archad](https://archad.pro)** using commercial cloud APIs that support all AutoCAD versions.

## Alternatives

If you need to convert DWG files:

- **For Archad users**: Use the built-in DWG import feature in Archad
- **For standalone conversion**:
  - [CloudConvert](https://cloudconvert.com/dwg-to-dxf) - Free with limitations
  - [Aspose.CAD Online Tools](https://products.aspose.app/cad/) - Free online converter
  - [AutoCAD Web](https://web.autocad.com/) - Official Autodesk tool

## Technical Details

This project successfully demonstrated:
- ✅ WebAssembly integration with LibreDWG
- ✅ Client-side DWG processing (100% private, no uploads)
- ✅ Next.js static export deployment
- ❌ But limited to AutoCAD 2018 and older

## License

This project was licensed under GPL-3.0 to comply with LibreDWG licensing requirements.

---

**Archived on:** January 8, 2026
**Last active version:** v1.0
**Successor:** [Archad](https://archad.pro) with cloud API integration
