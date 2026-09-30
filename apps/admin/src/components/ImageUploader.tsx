'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, ZoomIn, ZoomOut, RotateCw, Check, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string | null;
  onImageSelect: (base64: string) => void;
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:4';
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  currentImage,
  onImageSelect,
  aspectRatio = 'square',
  label = 'Загрузить фото',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const getAspectRatioValue = () => {
    switch (aspectRatio) {
      case '16:9':
        return 16 / 9;
      case '4:3':
        return 4 / 3;
      case '3:4':
        return 3 / 4;
      default:
        return 1;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка размера
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Файл слишком большой! Максимум ${maxSizeMB}MB`);
      return;
    }

    // Проверка типа
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setShowEditor(true);
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  const handleCrop = async () => {
    if (!preview || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Определяем размер выходного изображения
    const outputWidth = aspectRatio === 'square' ? 800 : aspectRatio === '3:4' ? 900 : 1920;
    const outputHeight = aspectRatio === 'square' ? 800 : aspectRatio === '3:4' ? 1200 : aspectRatio === '16:9' ? 1080 : 1440;

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Очищаем canvas
    ctx.clearRect(0, 0, outputWidth, outputHeight);

    // Применяем трансформации
    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-outputWidth / 2, -outputHeight / 2);

    // Рисуем изображение
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = outputWidth / outputHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imgAspect > canvasAspect) {
      drawHeight = outputHeight;
      drawWidth = drawHeight * imgAspect;
      drawX = (outputWidth - drawWidth) / 2 + position.x;
      drawY = position.y;
    } else {
      drawWidth = outputWidth;
      drawHeight = drawWidth / imgAspect;
      drawX = position.x;
      drawY = (outputHeight - drawHeight) / 2 + position.y;
    }

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();

    // Конвертируем в base64 с оптимизацией
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    
    setPreview(croppedImage);
    onImageSelect(croppedImage);
    setShowEditor(false);
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setShowEditor(false);
    onImageSelect('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {/* Preview / Upload Area */}
      <div className="relative">
        {preview && !showEditor ? (
          <div className="relative group">
            <div
              className={`relative overflow-hidden rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 ${
                aspectRatio === 'square' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '3:4' ? 'aspect-[3/4]' : 'aspect-[4/3]'
              }`}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Изменить
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Удалить
              </button>
            </div>
          </div>
        ) : !showEditor ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-orange-500 dark:hover:border-orange-500 transition-colors bg-gray-50 dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/10 ${
              aspectRatio === 'square' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '3:4' ? 'aspect-[3/4]' : 'aspect-[4/3]'
            } flex flex-col items-center justify-center gap-3`}
          >
            <ImageIcon className="w-12 h-12 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Нажмите для выбора изображения
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {aspectRatio === 'square' ? 'Квадрат 1:1' : aspectRatio === '16:9' ? 'Широкий 16:9' : aspectRatio === '3:4' ? 'Портрет 3:4' : 'Стандарт 4:3'} • Макс. {maxSizeMB}MB
              </p>
            </div>
          </button>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Editor Modal */}
      {showEditor && preview && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Редактировать изображение
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Перетащите, масштабируйте и поверните изображение
              </p>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-6 overflow-hidden">
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  💡 <strong>Зажми и тяни</strong> изображение чтобы переместить
                </p>
              </div>
              <div
                className={`relative mx-auto bg-gray-900 rounded-xl overflow-hidden ${
                  aspectRatio === 'square' ? 'aspect-square' : aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '3:4' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                } max-h-[50vh] cursor-grab active:cursor-grabbing select-none ${isDragging ? 'ring-4 ring-orange-500' : ''}`}
                onMouseDown={handleMouseDown}
              >
                <img
                  ref={imageRef}
                  src={preview}
                  alt="Edit"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center',
                    objectFit: 'contain',
                  }}
                  draggable={false}
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                {/* Zoom Control */}
                <div className="flex items-center gap-4">
                  <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Rotation Control */}
                <div className="flex items-center gap-4">
                  <RotateCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                    {rotation}°
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRotation((rotation + 90) % 360)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Повернуть 90°
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setRotation(0);
                      setPosition({ x: 0, y: 0 });
                    }}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={handleCrop}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
