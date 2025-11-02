# File Encryptor/Decryptor - Web Version

A modern web application for encrypting and decrypting files with a beautiful UI. Built with Next.js and ready for Vercel deployment.

## Features

- 🔒 **Secure Encryption**: Client-side file encryption (files never leave your browser)
- ⚡ **Fast Processing**: Instant results with browser-based encryption
- 📁 **Multiple Files**: Process multiple files at once
- 💾 **Easy Download**: Download files individually or all at once
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🚀 **Vercel Ready**: Optimized for Vercel deployment

## Getting Started

### Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:5000](http://localhost:5000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the web directory:
```bash
cd web
```

3. Deploy:
```bash
vercel
```

Follow the prompts to link your project and deploy.

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and deploy

### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this project
3. Configure settings (Vercel auto-detects Next.js)
4. Click "Deploy"

## How It Works

The application uses a simple XOR-based encryption algorithm:
- **Encryption**: `(byte + key) % 256`
- **Decryption**: `(byte - key + 256) % 256`

This matches the C++ backend implementation, ensuring compatibility between the web and CLI versions.

## Environment Variables

No environment variables are required as encryption is handled entirely client-side.

## Project Structure

```
web/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   └── FileEncryptor.tsx # Main encryption component
├── public/              # Static assets
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies
```

## Technologies

- **Next.js 15**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vercel**: Hosting platform

## Security Note

This implementation uses client-side encryption, meaning:
- ✅ Files never leave your browser
- ✅ No server-side storage
- ✅ Complete privacy
- ⚠️ The encryption key is visible in browser memory
- ⚠️ This is meant for basic file obfuscation, not military-grade security

For production use with sensitive data, consider:
- Using stronger encryption algorithms (AES-256)
- Implementing proper key management
- Adding password-based key derivation (PBKDF2)

## License

MIT
