# File Encryptor/Decryptor Project

## Overview
This project provides both a C++ command-line application and a modern web interface for encrypting and decrypting files. The C++ version demonstrates Operating System concepts including process management with fork(), file I/O operations, and inter-process communication. The web version provides a beautiful, user-friendly interface ready for Vercel deployment.

## Project Type
Dual implementation:
1. **C++ CLI**: Command-line application with multiprocessing
2. **Next.js Web App**: Modern web interface (deployable to Vercel)

## Build System
- **Language**: C++ (C++17 standard)
- **Compiler**: g++ (Clang)
- **Build Tool**: Make
- **Key Dependencies**: Standard C++ library, filesystem library

## Project Structure
```
ENCRYPTY/
├── src/
│   └── app/
│       ├── processes/           # Process management using fork()
│       │   ├── Task.hpp
│       │   ├── ProcessManagement.hpp
│       │   └── ProcessManagement.cpp
│       ├── fileHandling/        # File I/O operations
│       │   ├── IO.hpp
│       │   ├── IO.cpp
│       │   └── ReadEnv.cpp
│       └── encryptDecrypt/      # Encryption/decryption logic
│           ├── Cryption.hpp
│           ├── Cryption.cpp
│           └── CryptionMain.cpp
├── test/                        # Test directory
│   └── test1.txt
├── main.cpp                     # Main entry point
├── Makefile                     # Build configuration
├── .env                         # Encryption key storage
└── README.md
```

## Configuration
- **Encryption Key**: Stored in `.env` file (currently set to: 12345678910)
- The key is read at runtime and used for XOR-based encryption/decryption

## How to Build and Run
The project is set up with a workflow that automatically:
1. Cleans previous build artifacts
2. Compiles all source files
3. Links the executable
4. Runs the application

### Manual Build Commands
```bash
make clean    # Clean build artifacts
make          # Build the project
./encrypt_decrypt  # Run the main application
```

### Usage
When you run the application, it will prompt for:
1. **Directory path**: Enter the path to the directory containing files to encrypt/decrypt
2. **Action**: Type either "encrypt" or "decrypt"

The application will recursively process all files in the specified directory using multiprocessing.

## Key Features
- **Multiprocessing**: Uses fork() to create child processes for parallel file processing
- **CPU-aware**: Automatically limits concurrent processes to match CPU core count
- **Binary file support**: Handles all file types using binary mode
- **Smart memory management**: Uses C++ smart pointers (std::unique_ptr) for automatic cleanup

---

## Web Version (NEW)

### Overview
A modern Next.js web application with a beautiful UI for file encryption/decryption. Built for easy Vercel deployment.

### Features
- 🔒 **Client-side Encryption**: Files never leave your browser
- ⚡ **Fast Processing**: Instant results with browser-based encryption
- 📁 **Multiple Files**: Process multiple files at once
- 💾 **Easy Download**: Download files individually or all at once
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🚀 **Vercel Ready**: Optimized for Vercel deployment

### Quick Start
```bash
cd web
npm install
npm run dev
```
Open http://localhost:5000

### Deploy to Vercel

#### Option 1: Vercel CLI
```bash
cd web
npm i -g vercel
vercel
```

#### Option 2: GitHub Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click "Deploy" (auto-detects Next.js)

#### Option 3: Vercel Dashboard
1. Visit [vercel.com/new](https://vercel.com/new)
2. Import this project
3. Deploy with one click

### Tech Stack
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Vercel Platform

### Project Structure
```
web/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   └── FileEncryptor.tsx # Main encryption component
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

See `web/README.md` for detailed documentation.

---

## Recent Setup (November 2, 2025)
- Imported C++ CLI from GitHub repository
- Built modern Next.js web frontend
- Configured for Replit environment
- C++ toolchain (cpp-clang14) verified and ready
- Node.js 20 installed for web development
- Workflow configured for Next.js dev server (port 5000)
- Vercel deployment configured
- Both implementations use same encryption algorithm (key % 256)

## Notes
### C++ CLI Version
- Console application with interactive prompts
- Uses multiprocessing with fork()
- Process pool adapts to available CPU cores using sysconf()
- All file streams properly managed to avoid resource leaks

### Web Version
- Client-side encryption (files never uploaded)
- Same XOR-based algorithm as C++ version
- Fully compatible encryption/decryption
- No server-side processing required
- Perfect for Vercel's serverless platform
