# 🔄 CADPort - ACTIVE (Unarchived January 2026)

This project is now **ACTIVE** again as a microservice for Archad.

## Why was it unarchived?

CADPort is being used as a **privacy-focused DWG converter microservice** for AutoCAD 2018 and older files.

## New Architecture (Three-Tier System)

### Tier 1: DXF (Universal)
- **Format**: DXF (AutoCAD exchange format)
- **Processing**: Client-side in Archad
- **Privacy**: 🔒 100% private, files never leave user's device
- **Cost**: Free

### Tier 2: DWG ≤ 2018 (CADPort)
- **Format**: DWG AutoCAD R14-2018
- **Processing**: CADPort microservice (this project)
- **Privacy**: 🔒 Private - can be self-hosted
- **Cost**: Free
- **Coverage**: ~70-80% of DWG files in the wild

### Tier 3: DWG 2019+ (Aspose Cloud)
- **Format**: DWG AutoCAD 2019-2025
- **Processing**: Aspose.CAD Cloud API
- **Privacy**: ☁️ Cloud processing (with user consent)
- **Cost**: $0.10 per conversion after 150 free/month
- **Coverage**: ~20-30% of DWG files

## How It Works

1. **User imports DWG in Archad**
2. **Archad detects DWG version** (by reading file header)
3. **Routes accordingly**:
   - ≤2018 → CADPort (this service)
   - 2019+ → Aspose Cloud (with privacy consent dialog)

## Benefits

✅ **Legal separation**: CADPort (GPL) separate from Archad (commercial)
✅ **Privacy option**: Users can self-host CADPort for maximum privacy
✅ **Cost savings**: 70-80% of DWG files use free CADPort
✅ **Full coverage**: All DWG versions supported (R14-2025+)
✅ **User choice**: Transparent about where processing happens

## Deployment Options

### Option 1: User Self-Hosted (Maximum Privacy)
```bash
npm run build
npm start
# Runs on localhost:3001
```

### Option 2: Archad-Hosted (Convenience)
- We host CADPort on our infrastructure
- Still separate from Aspose Cloud
- Legal GPL compliance maintained

## API Endpoint

```
POST /api/convert
Content-Type: multipart/form-data

Body:
  file: <DWG file>

Response:
{
  "success": true,
  "dxf": "<DXF content>",
  "version": "AC1027",
  "metadata": {
    "format": "AutoCAD 2013",
    "entities": 150
  }
}
```

## License

GPL-3.0 (to comply with LibreDWG licensing)

---

**Status:** Active
**Purpose:** DWG ≤2018 converter microservice for Archad
**Last updated:** January 11, 2026
