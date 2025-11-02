# File Encryptor/Decryptor Project

## Overview
This is a C++ command-line application that encrypts and decrypts files in a directory using multiprocessing. The project demonstrates Operating System concepts including process management with fork(), file I/O operations, and inter-process communication.

## Project Type
Command-line application (CLI) - No web interface

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

## Recent Setup (November 2, 2025)
- Imported from GitHub repository
- Configured for Replit environment
- C++ toolchain (cpp-clang14) verified and ready
- Build workflow configured
- .gitignore set up for C++ build artifacts

## Notes
- This is a console application with interactive prompts
- The encryption uses a simple XOR-based algorithm (key % 256)
- Process pool adapts to available CPU cores using sysconf()
- All file streams are properly managed to avoid resource leaks across process boundaries
