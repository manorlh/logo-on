'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Card, Input, Slider, Select, SelectItem, Switch, useDisclosure } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { useLanguage } from './LanguageContext';
import { useTheme } from './ThemeContext';
import { MoonIcon, SunIcon } from './icons';
import { PaymentModal } from './components/PaymentModal';
import { calculatePrice } from './utils/pricing';
import { ResultsModal } from './components/ResultsModal';
import { toast } from 'sonner';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ProcessedImage {
  name: string;
  url: string;
  blob: Blob;
}

interface PreparedImages {
  processedImages: ProcessedImage[];
  zipBlob: Blob | null;
}

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [images, setImages] = useState<File[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPosition, setLogoPosition] = useState<Position>({ x: 0, y: 0 });
  const [logoSize, setLogoSize] = useState<Size>({ width: 100, height: 100 });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [originalLogoSize, setOriginalLogoSize] = useState<Size>({ width: 100, height: 100 });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [preparedImages, setPreparedImages] = useState<PreparedImages | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load preview image when first image is selected
  useEffect(() => {
    if (images[0]) {
      const url = URL.createObjectURL(images[0]);
      setPreviewUrl(url);

      // Get image dimensions to set default logo size
      const img = new Image();
      img.onload = () => {
        const defaultHeight = Math.round(img.height / 4); // 1/4 of image height
        const aspectRatio = originalLogoSize.width / originalLogoSize.height;
        const defaultWidth = Math.round(defaultHeight * aspectRatio);

        setLogoSize({
          width: defaultWidth,
          height: defaultHeight
        });

        // Set default position (20px from top and left)
        setLogoPosition({ x: 20, y: 20 });
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [images[0], originalLogoSize.width, originalLogoSize.height]);

  // Load logo preview and set original size
  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);
      setLogoPreviewUrl(url);

      // Get original logo dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalLogoSize({ width: img.width, height: img.height });
        
        // If we have a preview image, calculate the default size
        if (previewUrl) {
          const previewImg = new Image();
          previewImg.onload = () => {
            const defaultHeight = Math.round(previewImg.height / 4);
            const aspectRatio = img.width / img.height;
            const defaultWidth = Math.round(defaultHeight * aspectRatio);

            setLogoSize({
              width: defaultWidth,
              height: defaultHeight
            });

            // Set default position (20px from top and left)
            setLogoPosition({ x: 20, y: 20 });
          };
          previewImg.src = previewUrl;
        }
      };
      img.src = url;

      return () => URL.revokeObjectURL(url);
    }
  }, [logo, previewUrl]);

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: (acceptedFiles) => {
      setImages([...images, ...acceptedFiles]);
    }
  });

  const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps } = useDropzone({
    accept: {
      'image/*': ['.png']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setLogo(acceptedFiles[0]);
    }
  });

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setLogoPosition({ x, y });
    setIsDraggingLogo(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingLogo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const maxX = canvas.width - logoSize.width;
    const maxY = canvas.height - logoSize.height;
    
    setLogoPosition({
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    });
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingLogo(false);
  };

  const handleSizeChange = (value: number, dimension: 'width' | 'height') => {
    if (maintainAspectRatio) {
      const aspectRatio = originalLogoSize.width / originalLogoSize.height;
      if (dimension === 'width') {
        setLogoSize({
          width: value,
          height: Math.round(value / aspectRatio)
        });
      } else {
        setLogoSize({
          width: Math.round(value * aspectRatio),
          height: value
        });
      }
    } else {
      setLogoSize(prev => ({
        ...prev,
        [dimension]: value
      }));
    }
  };

  // Update canvas preview
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !previewUrl || !logoPreviewUrl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mainImage = new Image();
    const logoImage = new Image();

    mainImage.onload = () => {
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;
      ctx.drawImage(mainImage, 0, 0);

      logoImage.onload = () => {
        ctx.drawImage(
          logoImage,
          logoPosition.x,
          logoPosition.y,
          logoSize.width,
          logoSize.height
        );
      };
      logoImage.src = logoPreviewUrl;
    };
    mainImage.src = previewUrl;
  }, [previewUrl, logoPreviewUrl, logoPosition, logoSize]);

  const prepareImages = async () => {
    const processedImgs: ProcessedImage[] = [];
    const zip = new JSZip();
    const logoImg = await createImageBitmap(logo!);

    for (const image of images) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = await createImageBitmap(image);

      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.drawImage(
          logoImg,
          logoPosition.x,
          logoPosition.y,
          logoSize.width,
          logoSize.height
        );

        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, 'image/png');
        });

        const url = URL.createObjectURL(blob);
        const processedImage = {
          name: `${image.name}-with-logo.png`,
          url,
          blob
        };
        
        processedImgs.push(processedImage);
        zip.file(processedImage.name, blob);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    setPreparedImages({ processedImages: processedImgs, zipBlob });
  };

  const processImages = async () => {
    if (!logo) {
      toast.error(t.errors.noLogo);
      return;
    }
    
    if (images.length === 0) {
      toast.error(t.errors.noImages);
      return;
    }

    setIsProcessing(true);
    try {
      // Prepare images first
      await prepareImages();

      // Check if payment is needed
      if (images.length > 2 && !paymentComplete) {
        setShowPayment(true);
        return;
      }

      // If no payment needed, show results directly
      setShowResults(true);
    } catch (error) {
      toast.error(t.errors.processingFailed);
    } finally {
      setIsProcessing(false);
    }
  };

  const clearImages = () => {
    setImages([]);
    setPreviewUrl('');
  };

  const clearLogo = () => {
    setLogo(null);
    setLogoPreviewUrl('');
    setLogoSize({ width: 100, height: 100 });
  };

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    setShowPayment(false);
    setShowResults(true);
  };

  // Add a function to reset all states
  const resetAllStates = () => {
    // Reset file states
    setImages([]);
    setLogo(null);
    setPreviewUrl('');
    setLogoPreviewUrl('');

    // Reset logo position and size
    setLogoPosition({ x: 0, y: 0 });
    setLogoSize({ width: 100, height: 100 });
    setOriginalLogoSize({ width: 100, height: 100 });

    // Reset UI states
    setIsDraggingLogo(false);
    setMaintainAspectRatio(true);
    
    // Reset processing states
    setPaymentComplete(false);
    setShowPayment(false);
    setShowResults(false);
    
    // Clean up processed images
    if (preparedImages) {
      preparedImages.processedImages.forEach(image => URL.revokeObjectURL(image.url));
      setPreparedImages(null);
    }
  };

  // Update handleResultsClose
  const handleResultsClose = () => {
    setShowResults(false);
    if (preparedImages) {
      preparedImages.processedImages.forEach(image => URL.revokeObjectURL(image.url));
      setPreparedImages(null);
    }
    resetAllStates();
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (preparedImages) {
        preparedImages.processedImages.forEach(image => URL.revokeObjectURL(image.url));
      }
    };
  }, [preparedImages]);

  return (
    <div className="min-h-screen flex flex-col" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <div className="flex-grow container mx-auto p-4">
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">{t.about.title}</h2>
          <p className="mb-4">{t.about.description}</p>
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>{t.about.note}</strong>
            </p>
          </div>
        </Card>

        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">{t.payment.priceTable.title}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p>1-2 {t.payment.priceTable.images}</p>
              <p>3-10 {t.payment.priceTable.images}</p>
              <p>11-20 {t.payment.priceTable.images}</p>
              <p>21-30 {t.payment.priceTable.images}</p>
              <p>30+ {t.payment.priceTable.images}</p>
            </div>
            <div>
              <p>{t.payment.free}</p>
              <p>10 ILS</p>
              <p>15 ILS</p>
              <p>20 ILS</p>
              <p>40 ILS</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">{t.uploadImages.title}</h2>
              {images.length > 0 && (
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onClick={clearImages}
                >
                  {t.uploadImages.clear}
                </Button>
              )}
            </div>
            <div className="mb-3 text-sm text-gray-600">
              <p>{t.uploadImages.formats}</p>
              <p>{t.uploadImages.multiple}</p>
            </div>
            <div
              {...getImagesRootProps()}
              className="border-2 border-dashed p-4 text-center cursor-pointer"
            >
              <input {...getImagesInputProps()} />
              <p>{t.uploadImages.dropzone}</p>
            </div>
            <div className="mt-4">
              {images.map((file, index) => (
                <div key={index} className="text-sm">
                  {file.name}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">{t.uploadLogo.title}</h2>
              {logo && (
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  onClick={clearLogo}
                >
                  {t.uploadLogo.clear}
                </Button>
              )}
            </div>
            <div className="mb-3 text-sm text-gray-600">
              <p>{t.uploadLogo.formats}</p>
              <p>{t.uploadLogo.single}</p>
            </div>
            <div
              {...getLogoRootProps()}
              className="border-2 border-dashed p-4 text-center cursor-pointer"
            >
              <input {...getLogoInputProps()} />
              <p>{t.uploadLogo.dropzone}</p>
            </div>
            {logo && <p className="mt-2 text-sm">{logo.name}</p>}
          </Card>
        </div>

        {previewUrl && logoPreviewUrl && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="p-4">
              <h2 className="text-xl mb-2">{t.logoPlacement.title}</h2>
              <div className="mb-3 text-sm text-gray-600">
                <p>{t.logoPlacement.drag}</p>
                <p>{t.logoPlacement.preview}</p>
              </div>
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  className="border border-gray-300 w-full h-auto cursor-move max-h-[400px] object-contain"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-xl mb-2">{t.logoSize.title}</h2>
              <div className="mb-3 text-sm text-gray-600">
                <p>{t.logoSize.sliders}</p>
                <p>{t.logoSize.ratio}</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-20">{t.logoSize.width}</label>
                  <Slider
                    size="sm"
                    step={1}
                    maxValue={1000}
                    minValue={10}
                    value={logoSize.width}
                    onChange={(value) => handleSizeChange(Number(value), 'width')}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    value={logoSize.width.toString()}
                    onChange={(e) => handleSizeChange(Number(e.target.value), 'width')}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20">{t.logoSize.height}</label>
                  <Slider
                    size="sm"
                    step={1}
                    maxValue={1000}
                    minValue={10}
                    value={logoSize.height}
                    onChange={(value) => handleSizeChange(Number(value), 'height')}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    value={logoSize.height.toString()}
                    onChange={(e) => handleSizeChange(Number(e.target.value), 'height')}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    id="aspectRatio"
                  />
                  <label htmlFor="aspectRatio">{t.logoSize.maintainRatio}</label>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Button
          color="primary"
          className="mt-4"
          onClick={processImages}
          isLoading={isProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? t.processing : t.generate}
        </Button>
      </div>
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        imageCount={images.length}
      />
      
      <ResultsModal
        isOpen={showResults}
        onClose={handleResultsClose}
        processedImages={preparedImages?.processedImages || []}
        zipBlob={preparedImages?.zipBlob || null}
      />
    </div>
  );
} 