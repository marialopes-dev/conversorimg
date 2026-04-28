import React, { useState, useRef } from "react";
import {
  Upload,
  Download,
  ImageIcon,
  RefreshCw,
  X,
  ChevronDown,
} from "lucide-react";

export default function App() {
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState("webp");
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    if (!preview) return;
    setIsConverting(true);

    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const mimeType = `image/${format}`;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `converted-${Date.now()}.${format}`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
          setIsConverting(false);
        },
        mimeType,
        0.9,
      );
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-lg bg-brand-card border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xl ring-1 ring-white/5">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-2xl mb-4 border border-white/10">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Convert Studio
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Processamento 100% local e privado.
          </p>
        </header>

        <div className="space-y-5">
          <div className="relative">
            {preview && (
              <button
                onClick={resetImage}
                className="absolute -top-2 -right-2 z-20 bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 rounded-full border border-brand-border transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            <label
              className={`relative group flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden ${preview ? "border-brand-border bg-brand-bg" : "border-zinc-800 hover:border-zinc-600 hover:bg-white/[0.02]"}`}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain p-4 animate-in fade-in zoom-in-95"
                />
              ) : (
                <div className="text-center p-6">
                  <Upload className="w-8 h-8 text-zinc-600 mx-auto mb-3 group-hover:text-zinc-400 transition-colors" />
                  <p className="text-sm font-medium text-zinc-400">
                    Arraste ou clique para enviar
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFile}
                accept="image/*"
              />
            </label>
          </div>

          {preview && (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between bg-brand-bg border border-brand-border px-4 py-3 rounded-xl relative">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Formato
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="bg-transparent font-bold text-white text-sm focus:outline-none cursor-pointer pr-6 appearance-none"
                  >
                    <option value="webp">WEBP</option>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-4 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={isConverting}
                className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isConverting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Baixar Imagem
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <footer className="mt-8 text-center">
          <span className="text-[10px] text-zinc-700 font-bold tracking-[0.2em] uppercase">
            marialopes.dev
          </span>
        </footer>
      </main>
    </div>
  );
}
