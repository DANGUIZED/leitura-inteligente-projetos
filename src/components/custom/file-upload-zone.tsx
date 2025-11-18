'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, X, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export function FileUploadZone({ 
  onFileSelect, 
  acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.webp'],
  maxSizeMB = 2000000 
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File): boolean => {
    setError('');
    
    // Valida tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return false;
    }

    // Valida formato
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Formato não suportado. Use: ${acceptedFormats.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
  };

  const isPDF = selectedFile?.type === 'application/pdf';

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
          isDragging 
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
            : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
          selectedFile && "border-green-500 bg-green-50 dark:bg-green-950/20"
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInput}
        />

        {!selectedFile ? (
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arraste e solte seu projeto aqui
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              ou clique para selecionar
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {acceptedFormats.map(format => (
                <span
                  key={format}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400"
                >
                  {format.toUpperCase().replace('.', '')}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Tamanho máximo: {maxSizeMB}MB
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                💡 <strong>Suporte completo a PDF!</strong> Envie plantas em PDF ou imagens (PNG, JPG, WEBP)
              </p>
            </div>
          </label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isPDF ? (
                <FileText className="w-10 h-10 text-red-600" />
              ) : (
                <FileImage className="w-10 h-10 text-green-600" />
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  {isPDF && <span className="ml-2 text-red-600 font-medium">• PDF</span>}
                </p>
              </div>
            </div>
            <button
              onClick={clearFile}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
