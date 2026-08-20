import React, { useState, useEffect, useRef, useCallback } from 'react';
import { extractFromScreenshot } from '../../lib/ocr';
import type { ExtractedTradeData, TradeDirection } from '../../lib/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ScreenshotUploadProps {
  onExtracted: (data: ExtractedTradeData) => void;
  onClose: () => void;
}

type UploadState = 'upload' | 'processing' | 'results' | 'error';

export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({ onExtracted, onClose }) => {
  const [state, setState] = useState<UploadState>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Editable form state for results
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [slPrice, setSlPrice] = useState<string>('');
  const [tpPrice, setTpPrice] = useState<string>('');
  const [direction, setDirection] = useState<TradeDirection | null>(null);
  const [confidence, setConfidence] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Escape key and Paste event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (state !== 'upload') return;
      
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
  }, [onClose, state]);

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    setState('processing');
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const data = await extractFromScreenshot(file);
      setEntryPrice(data.entryPrice !== null ? data.entryPrice.toString() : '');
      setSlPrice(data.slPrice !== null ? data.slPrice.toString() : '');
      setTpPrice(data.tpPrice !== null ? data.tpPrice.toString() : '');
      setDirection(data.direction);
      setConfidence(data.confidence);
      setState('results');
    } catch (err) {
      setState('error');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleApply = () => {
    onExtracted({
      entryPrice: entryPrice ? parseFloat(entryPrice) : null,
      slPrice: slPrice ? parseFloat(slPrice) : null,
      tpPrice: tpPrice ? parseFloat(tpPrice) : null,
      direction: direction,
      confidence: confidence
    });
    onClose();
  };

  const resetState = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setState('upload');
    setEntryPrice('');
    setSlPrice('');
    setTpPrice('');
    setDirection(null);
    setConfidence(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm">
      <div className="bg-canvas rounded-xl shadow-modal w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-ink tracking-tight">Extract from Screenshot</h3>
          <button onClick={onClose} className="text-mute hover:text-ink transition-colors p-1" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {state === 'upload' && (
          <div className="flex flex-col gap-4">
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragging ? 'border-link bg-link/5' : 'border-hairline hover:border-mute hover:bg-canvas-soft'}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mute">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <div>
                  <p className="text-ink font-medium">Drop or paste a TradingView screenshot here</p>
                  <p className="text-mute text-sm mt-1">or click to browse files</p>
                </div>
              </div>
            </div>
            <p className="font-mono text-xs text-mute text-center">
              Tip: Use TradingView's Long/Short Position Tool for best results
            </p>
          </div>
        )}

        {state === 'processing' && (
          <div className="flex flex-col items-center gap-6 py-4">
            {previewUrl && (
              <div className="w-full rounded-md overflow-hidden max-h-48 flex justify-center bg-canvas-soft-2">
                <img src={previewUrl} alt="Screenshot preview" className="object-contain w-full h-full" />
              </div>
            )}
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-hairline border-t-link rounded-full animate-spin"></div>
              <p className="text-ink font-medium">Extracting trade data...</p>
            </div>
            <p className="font-mono text-xs text-mute text-center">
              Processing happens in your browser. No data is uploaded.
            </p>
          </div>
        )}

        {state === 'results' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              {direction && (
                <div className={`px-2.5 py-1 text-xs font-semibold rounded-full ${direction === 'long' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {direction.toUpperCase()} POSITION
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-mute">Confidence:</span>
                <span className={`font-semibold ${confidence > 0.75 ? 'text-success' : confidence >= 0.5 ? 'text-yellow-500' : 'text-error'}`}>
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input 
                label="Entry Price" 
                type="number" 
                step="any"
                value={entryPrice} 
                onChange={(e) => setEntryPrice(e.target.value)} 
              />
              <Input 
                label="Stop Loss Price" 
                type="number" 
                step="any"
                value={slPrice} 
                onChange={(e) => setSlPrice(e.target.value)} 
              />
              <Input 
                label="Take Profit Price" 
                type="number" 
                step="any"
                value={tpPrice} 
                onChange={(e) => setTpPrice(e.target.value)} 
              />
            </div>
            
            <p className="text-sm text-mute text-center">
              Verify and correct values before applying
            </p>

            <div className="flex gap-3 justify-end mt-2">
              <Button variant="ghost" onClick={resetState}>Try Again</Button>
              <Button variant="primary" onClick={handleApply}>Apply to Calculator</Button>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center text-center gap-5 py-6">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div>
              <h4 className="text-ink font-medium mb-1">Extraction Failed</h4>
              <p className="text-mute text-sm">
                Could not extract data from this image. Please try a clearer screenshot.
              </p>
            </div>
            <Button variant="secondary" onClick={resetState}>Try Again</Button>
          </div>
        )}
      </div>
    </div>
  );
};
