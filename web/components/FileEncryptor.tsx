"use client";

import { useState, useRef } from "react";

interface ProcessedFile {
  name: string;
  data: Uint8Array;
  originalSize: number;
}

export default function FileEncryptor() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [encryptionKey, setEncryptionKey] = useState("12345678910");
  const [action, setAction] = useState<"encrypt" | "decrypt">("encrypt");
  const [processing, setProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File, key: number): Promise<ProcessedFile> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const processedData = new Uint8Array(data.length);

        if (action === "encrypt") {
          for (let i = 0; i < data.length; i++) {
            processedData[i] = (data[i] + key) % 256;
          }
        } else {
          for (let i = 0; i < data.length; i++) {
            processedData[i] = (data[i] - key + 256) % 256;
          }
        }

        resolve({
          name: action === "encrypt" 
            ? `encrypted_${file.name}` 
            : file.name.replace(/^encrypted_/, "decrypted_"),
          data: processedData,
          originalSize: file.size,
        });
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleProcess = async () => {
    if (!files || files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    if (!encryptionKey || isNaN(parseInt(encryptionKey))) {
      alert("Please enter a valid encryption key (number)");
      return;
    }

    setProcessing(true);
    setProgress(0);
    setProcessedFiles([]);

    const key = parseInt(encryptionKey) % 256;
    const filesArray = Array.from(files);
    const results: ProcessedFile[] = [];

    for (let i = 0; i < filesArray.length; i++) {
      const result = await processFile(filesArray[i], key);
      results.push(result);
      setProgress(((i + 1) / filesArray.length) * 100);
    }

    setProcessedFiles(results);
    setProcessing(false);
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

  const downloadAll = () => {
    processedFiles.forEach((file) => {
      setTimeout(() => downloadFile(file), 100 * processedFiles.indexOf(file));
    });
  };

  const reset = () => {
    setFiles(null);
    setProcessedFiles([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Encryption Key
          </label>
          <input
            type="text"
            value={encryptionKey}
            onChange={(e) => setEncryptionKey(e.target.value)}
            placeholder="Enter encryption key (number)"
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Default: 12345678910 (will be converted to {parseInt(encryptionKey || "0") % 256})
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Action
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setAction("encrypt")}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                action === "encrypt"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              🔒 Encrypt
            </button>
            <button
              onClick={() => setAction("decrypt")}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                action === "decrypt"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              🔓 Decrypt
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Select Files
          </label>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer transition"
          />
          {files && files.length > 0 && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {files.length} file{files.length > 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleProcess}
            disabled={processing || !files || files.length === 0}
            className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition ${
              processing || !files || files.length === 0
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : action === "encrypt"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {processing
              ? `Processing... ${Math.round(progress)}%`
              : action === "encrypt"
              ? "🔒 Encrypt Files"
              : "🔓 Decrypt Files"}
          </button>
          
          {processedFiles.length > 0 && (
            <button
              onClick={reset}
              className="px-6 py-4 rounded-lg font-bold bg-gray-500 hover:bg-gray-600 text-white transition"
            >
              Reset
            </button>
          )}
        </div>

        {processing && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                action === "encrypt" ? "bg-blue-600" : "bg-purple-600"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {processedFiles.length > 0 && (
          <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-300">
                ✅ Processing Complete!
              </h3>
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                Download All
              </button>
            </div>
            <div className="space-y-2">
              {processedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Size: {(file.originalSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={() => downloadFile(file)}
                    className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
