# 🔄 CADPort - Privacy-Focused DWG Converter Microservice

> **🎯 Active Project - Unarchived January 2026**
>
> **Purpose:** DWG to DXF converter microservice for [Archad](https://archad.pro)
>
> **Coverage:** AutoCAD R14-2018 files (~70-80% of DWG files in the wild)
>
> See [ACTIVE-STATUS.md](ACTIVE-STATUS.md) for architecture details.

---

![CADPort](https://img.shields.io/badge/License-GPL--3.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Status](https://img.shields.io/badge/Status-Active-green.svg)

Privacy-focused DWG to DXF converter. Works as both a standalone tool and microservice for Archad.

**Coverage:** AutoCAD R14-2018 files. For 2019+ files, Archad uses cloud APIs with user consent.

## ✨ Features

- **🔒 100% Private** - All processing happens in your browser. Files never leave your device
- **⚡ Lightning Fast** - Instant conversion with WebAssembly technology
- **💰 Always Free** - No limits, no subscriptions, no hidden costs
- **🎯 Simple** - Drag & drop or click to convert
- **🌐 Works Offline** - After initial load, works without internet
- **🔓 Open Source** - GPL-3.0 licensed, free forever

## 🚀 Live Demo

Visit [cadport.vercel.app](https://cadport.vercel.app) to try it now!

## 🛠️ Technology Stack

- **Next.js 15** - React framework for production
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **LibreDWG** - Open-source DWG/DXF library (via WebAssembly)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/danieltorresan-boop/CADPort.git

# Navigate to the project directory
cd CADPort

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔨 Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

## 🌍 Deploy to Vercel

The easiest way to deploy CADPort is to use the [Vercel Platform](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/danieltorresan-boop/CADPort)

Or manually:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔧 How It Works

CADPort uses LibreDWG compiled to WebAssembly to convert DWG files to DXF format entirely in your browser. This approach ensures:

1. **Privacy**: Your files never leave your device
2. **Speed**: No upload/download delays
3. **Cost**: Zero server costs, free forever
4. **Security**: No data stored or transmitted

## 📋 Roadmap

- [ ] Integrate LibreDWG WebAssembly module
- [ ] Support DXF to DWG conversion
- [ ] Add batch conversion
- [ ] Support AutoCAD 2019+ formats
- [ ] Add conversion options/settings
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! This project is open source under GPL-3.0.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [Archad](https://archad.pro) - AI-powered CAD application that powers CADPort
- [LibreDWG](https://www.gnu.org/software/libredwg/) - Free DWG library

## 💬 Support

- 🐛 [Report a bug](https://github.com/danieltorresan-boop/CADPort/issues)
- 💡 [Request a feature](https://github.com/danieltorresan-boop/CADPort/issues)
- 📧 Contact: [Your email or support link]

## 🙏 Acknowledgments

- Built with [LibreDWG](https://www.gnu.org/software/libredwg/)
- Powered by [Archad](https://archad.pro)
- Hosted on [Vercel](https://vercel.com)

---

Made with ❤️ for the CAD community
