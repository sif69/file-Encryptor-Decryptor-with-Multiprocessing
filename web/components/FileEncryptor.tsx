"use client";

import { useState, useRef } from "react";

type Mode = "text" | "file";

interface ProcessedFile {
  name: string;
  data: Uint8Array;
  originalSize: number;
}

export default function FileEncryptor() {
  const [encryptMode, setEncryptMode] = useState<Mode>("text");
  const [decryptMode, setDecryptMode] = useState<Mode>("text");
  
  const [encryptText, setEncryptText] = useState("");
  const [decryptText, setDecryptText] = useState("");
  const [encryptedTextResult, setEncryptedTextResult] = useState("");
  const [decryptedTextResult, setDecryptedTextResult] = useState("");
  
  const [encryptKey, setEncryptKey] = useState("12345");
  const [decryptKey, setDecryptKey] = useState("12345");
  
  const [encryptFiles, setEncryptFiles] = useState<FileList | null>(null);
  const [decryptFiles, setDecryptFiles] = useState<FileList | null>(null);
  
  const [processedEncryptFiles, setProcessedEncryptFiles] = useState<ProcessedFile[]>([]);
  const [processedDecryptFiles, setProcessedDecryptFiles] = useState<ProcessedFile[]>([]);
  
  const encryptFileInputRef = useRef<HTMLInputElement>(null);
  const decryptFileInputRef = useRef<HTMLInputElement>(null);

  const processTextEncryption = () => {
    if (!encryptText.trim()) {
      alert("Please enter a message to encrypt");
      return;
    }
    if (!encryptKey || isNaN(parseInt(encryptKey))) {
      alert("Please enter a valid encryption key (number)");
      return;
    }

    const key = parseInt(encryptKey) % 256;
    const encoder = new TextEncoder();
    const data = encoder.encode(encryptText);
    const encrypted = new Uint8Array(data.length);

    for (let i = 0; i < data.length; i++) {
      encrypted[i] = (data[i] + key) % 256;
    }

    const encryptedText = btoa(String.fromCharCode(...encrypted));
    setEncryptedTextResult(encryptedText);
  };

  const processTextDecryption = () => {
    if (!decryptText.trim()) {
      alert("Please paste the encrypted message");
      return;
    }
    if (!decryptKey || isNaN(parseInt(decryptKey))) {
      alert("Please enter a valid decryption key (number)");
      return;
    }

    try {
      const key = parseInt(decryptKey) % 256;
      const binaryString = atob(decryptText.trim());
      const data = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        data[i] = binaryString.charCodeAt(i);
      }

      const decrypted = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        decrypted[i] = (data[i] - key + 256) % 256;
      }

      const decoder = new TextDecoder();
      const decryptedText = decoder.decode(decrypted);
      setDecryptedTextResult(decryptedText);
    } catch (error) {
      alert("Invalid encrypted message format");
    }
  };

  const processFile = async (file: File, key: number, isEncrypt: boolean): Promise<ProcessedFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const processedData = new Uint8Array(data.length);

        if (isEncrypt) {
          for (let i = 0; i < data.length; i++) {
            processedData[i] = (data[i] + key) % 256;
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            processedData[i] = (data[i] - key + 256) % 256;
          }
        }

        resolve({
          name: isEncrypt 
            ? `encrypted_${file.name}` 
            : file.name.replace(/^encrypted_/, "decrypted_"),
          data: processedData,
          originalSize: file.size,
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleEncryptFiles = async () => {
    if (!encryptFiles || encryptFiles.length === 0) {
      alert("Please select at least one file");
      return;
    }
    if (!encryptKey || isNaN(parseInt(encryptKey))) {
      alert("Please enter a valid encryption key");
      return;
    }

    const key = parseInt(encryptKey) % 256;
    const filesArray = Array.from(encryptFiles);
    const results: ProcessedFile[] = [];

    for (const file of filesArray) {
      const result = await processFile(file, key, true);
      results.push(result);
    }

    setProcessedEncryptFiles(results);
  };

  const handleDecryptFiles = async () => {
    if (!decryptFiles || decryptFiles.length === 0) {
      alert("Please select at least one file");
      return;
    }
    if (!decryptKey || isNaN(parseInt(decryptKey))) {
      alert("Please enter a valid decryption key");
      return;
    }

    const key = parseInt(decryptKey) % 256;
    const filesArray = Array.from(decryptFiles);
    const results: ProcessedFile[] = [];

    for (const file of filesArray) {
      const result = await processFile(file, key, false);
      results.push(result);
    }

    setProcessedDecryptFiles(results);
  };

  const downloadFile = (file: ProcessedFile) => {
    const blob = new Blob([file.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-green-500">
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">🔒 Encryption</h2>
        </div>
        
        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setEncryptMode("text")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                encryptMode === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              📝 Text
            </button>
            <button
              onClick={() => setEncryptMode("file")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                encryptMode === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              📁 File
            </button>
          </div>

          {encryptMode === "text" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Enter your message:
                </label>
                <textarea
                  value={encryptText}
                  onChange={(e) => setEncryptText(e.target.value)}
                  placeholder="Type or paste your message here..."
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Encryption Key:
                </label>
                <input
                  type="text"
                  value={encryptKey}
                  onChange={(e) => setEncryptKey(e.target.value)}
                  placeholder="Enter a numeric key (e.g., 12345)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none transition"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Choose a memorable number to share with the receiver
                </p>
              </div>

              <button
                onClick={processTextEncryption}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition shadow-lg"
              >
                🔒 Encrypt Message
              </button>

              {encryptedTextResult && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-green-800 dark:text-green-300">
                      Encrypted Message:
                    </label>
                    <button
                      onClick={() => copyToClipboard(encryptedTextResult)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold transition"
                    >
                      Copy
                    </button>
                  </div>
                  <textarea
                    value={encryptedTextResult}
                    readOnly
                    className="w-full h-24 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono border border-green-500 resize-none"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Select Files:
                </label>
                <input
                  ref={encryptFileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => setEncryptFiles(e.target.files)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-600 file:text-white hover:file:bg-green-700 file:cursor-pointer cursor-pointer transition"
                />
                {encryptFiles && encryptFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {encryptFiles.length} file{encryptFiles.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Encryption Key:
                </label>
                <input
                  type="text"
                  value={encryptKey}
                  onChange={(e) => setEncryptKey(e.target.value)}
                  placeholder="Enter a numeric key (e.g., 12345)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-green-500 focus:outline-none transition"
                />
              </div>

              <button
                onClick={handleEncryptFiles}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition shadow-lg"
              >
                🔒 Encrypt Files
              </button>

              {processedEncryptFiles.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
                  <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-3">
                    ✅ Encrypted Files:
                  </h3>
                  <div className="space-y-2">
                    {processedEncryptFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.originalSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => downloadFile(file)}
                          className="ml-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-semibold transition"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-2 border-blue-500">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">🔓 Decryption</h2>
        </div>
        
        <div className="p-6">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setDecryptMode("text")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                decryptMode === "text"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              📝 Text
            </button>
            <button
              onClick={() => setDecryptMode("file")}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                decryptMode === "file"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              📁 File
            </button>
          </div>

          {decryptMode === "text" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Paste encrypted message:
                </label>
                <textarea
                  value={decryptText}
                  onChange={(e) => setDecryptText(e.target.value)}
                  placeholder="Paste the encrypted message here..."
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition resize-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Decryption Key:
                </label>
                <input
                  type="text"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  placeholder="Enter the shared key"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Use the same key that was used for encryption
                </p>
              </div>

              <button
                onClick={processTextDecryption}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition shadow-lg"
              >
                🔓 Decrypt Message
              </button>

              {decryptedTextResult && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                      Decrypted Message:
                    </label>
                    <button
                      onClick={() => copyToClipboard(decryptedTextResult)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold transition"
                    >
                      Copy
                    </button>
                  </div>
                  <textarea
                    value={decryptedTextResult}
                    readOnly
                    className="w-full h-24 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm border border-blue-500 resize-none"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Select Files:
                </label>
                <input
                  ref={decryptFileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => setDecryptFiles(e.target.files)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer transition"
                />
                {decryptFiles && decryptFiles.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {decryptFiles.length} file{decryptFiles.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
                  Decryption Key:
                </label>
                <input
                  type="text"
                  value={decryptKey}
                  onChange={(e) => setDecryptKey(e.target.value)}
                  placeholder="Enter the shared key"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <button
                onClick={handleDecryptFiles}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition shadow-lg"
              >
                🔓 Decrypt Files
              </button>

              {processedDecryptFiles.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-500">
                  <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3">
                    ✅ Decrypted Files:
                  </h3>
                  <div className="space-y-2">
                    {processedDecryptFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.originalSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          onClick={() => downloadFile(file)}
                          className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold transition"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
