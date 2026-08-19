import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, AlertCircle, RefreshCw, X, Link as LinkIcon } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface ImageUploadWidgetProps {
  currentUrl: string;
  onImageChange: (newUrl: string) => void;
  label?: string;
  description?: string;
  defaultUrl?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  currentUrl,
  onImageChange,
  label = 'Profile / Avatar Image',
  description = 'Upload an official portrait or enter an image URL.',
  defaultUrl = '/profile.jpg',
  aspectRatio = 'square',
}) => {
  const { adminToken } = usePortfolio();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, etc.).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('File size must be under 8MB.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          setError('Failed to read image file.');
          setIsUploading(false);
          return;
        }

        try {
          // Send to server upload endpoint
          const res = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
              filename: file.name.split('.')[0] || 'portrait',
              dataUrl,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const savedUrl = data.url || dataUrl;
            onImageChange(savedUrl);
            setUrlInput(savedUrl);
            setSuccessMsg('Image uploaded and applied successfully!');
            setTimeout(() => setSuccessMsg(null), 3000);
          } else {
            // Fallback to direct dataUrl
            onImageChange(dataUrl);
            setUrlInput(dataUrl);
            setSuccessMsg('Image loaded successfully!');
            setTimeout(() => setSuccessMsg(null), 3000);
          }
        } catch (serverErr) {
          // Fallback to dataUrl
          onImageChange(dataUrl);
          setUrlInput(dataUrl);
          setSuccessMsg('Image loaded successfully!');
          setTimeout(() => setSuccessMsg(null), 3000);
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'Error processing upload.');
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim());
      setSuccessMsg('Image URL updated!');
      setShowUrlInput(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const handleResetToDefault = () => {
    onImageChange(defaultUrl);
    setUrlInput(defaultUrl);
    setSuccessMsg('Reset to official portrait!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const aspectClass = aspectRatio === 'square' ? 'w-32 h-32' : aspectRatio === 'video' ? 'w-48 h-28' : 'w-full h-32';

  return (
    <div className="bg-[#0B1221] rounded-xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#10B981]" />
            {label}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>

        {defaultUrl && (
          <button
            type="button"
            onClick={handleResetToDefault}
            className="text-xs text-[#D4AF37] hover:text-[#e5c04b] flex items-center gap-1 transition-colors font-medium"
            title="Reset to official studio portrait"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Official</span>
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Preview Container */}
        <div className={`relative ${aspectClass} rounded-lg bg-[#020617] border-2 border-slate-700 overflow-hidden shrink-0 shadow-md group`}>
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
              onError={() => setError('Unable to load image from current path')}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs p-2 text-center">
              <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
              <span>No image</span>
            </div>
          )}

          {currentUrl && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-full bg-[#10B981] text-[#020617] hover:bg-[#0D9488] transition-colors"
                title="Change image"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Upload Zone & Action Buttons */}
        <div className="flex-1 w-full space-y-3">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#10B981] bg-[#10B981]/10'
                : 'border-slate-700 hover:border-slate-600 bg-[#020617]/50 hover:bg-[#020617]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <Upload className="w-5 h-5 text-[#10B981] mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-200">
              {isUploading ? 'Uploading Image...' : 'Click to upload or drag & drop portrait'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Supports JPG, PNG, WebP up to 8MB
            </p>
          </div>

          {/* Alternative: URL Input Toggle */}
          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-slate-400 hover:text-[#10B981] flex items-center gap-1 transition-colors"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Hide URL link' : 'Enter direct Image URL'}</span>
            </button>

            {currentUrl && (
              <span className="text-[11px] text-slate-500 truncate max-w-[200px]" title={currentUrl}>
                {currentUrl.startsWith('data:') ? 'Custom Base64 Image' : currentUrl}
              </span>
            )}
          </div>

          {showUrlInput && (
            <div className="flex gap-2 items-center animate-in fade-in duration-150">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/portrait.jpg or /profile.jpg"
                className="flex-1 px-3 py-1.5 rounded-md text-xs bg-[#020617] border border-slate-700 text-white focus:outline-none focus:border-[#10B981]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-1.5 rounded-md text-xs font-bold bg-[#10B981] text-[#020617] hover:bg-[#0D9488] transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {successMsg && (
        <div className="p-2.5 rounded-md bg-[#10B981]/15 border border-[#10B981]/30 text-xs text-[#10B981] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-2.5 rounded-md bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
