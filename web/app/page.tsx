"use client";

import { useState, useRef } from "react";
import FileEncryptor from "@/components/FileEncryptor";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              🔐 File Encryptor/Decryptor
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Secure file encryption and decryption with multiprocessing support
            </p>
          </div>

          <FileEncryptor />

          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              🧩 Features
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    Fast Processing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Client-side encryption for instant results
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    Secure
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Files never leave your browser
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📁</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    Multiple Files
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Process multiple files at once
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💾</span>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                    Easy Download
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Download processed files individually or as ZIP
                  </p>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>Built with Next.js | Deploy on Vercel</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
