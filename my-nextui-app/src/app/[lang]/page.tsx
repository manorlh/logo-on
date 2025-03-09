'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Card, Input, Slider, Select, SelectItem, Switch, useDisclosure } from '@nextui-org/react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { useLanguage } from '../LanguageContext';
import { useTheme } from '../ThemeContext';
import { MoonIcon, SunIcon } from '../icons';
import { PaymentModal } from '../components/PaymentModal';
import { calculatePrice, formatPrice } from '../utils/pricing';
import { ResultsModal } from '../components/ResultsModal';
import { toast } from 'sonner';
import { LogoControls } from '../components/LogoControls';
import { Logo } from '../components/Logo';
import { LanguageSelect } from '../components/LanguageSelect';
import { CurrencySelect } from '../components/CurrencySelect';
import { ThemeToggle } from '../components/ThemeToggle';

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
  previewUrl: string;
}

interface PreparedImages {
  processedImages: ProcessedImage[];
  zipBlob: Blob | null;
}

export default function Page({ params }: { params: { lang: string } }) {
  const { language, currency, t } = useLanguage();
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
  const [canvasDimensions, setCanvasDimensions] = useState<Size>({ width: 0, height: 0 });
  const [outputFormat, setOutputFormat] = useState<string>('original');
  const isRTL = language === 'he' || language === 'ar';

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
      // Set canvas dimensions
      canvas.width = mainImage.width;
      canvas.height = mainImage.height;
      
      // Update maxWidth and maxHeight state based on actual image dimensions
      setCanvasDimensions({
        width: mainImage.width,
        height: mainImage.height
      });

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

    for (const img of images) {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        const bitmap = await createImageBitmap(img);
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        // Draw the original image
        ctx.drawImage(bitmap, 0, 0);

        // Calculate logo position and size relative to this image
        const scaleX = bitmap.width / canvasDimensions.width;
        const scaleY = bitmap.height / canvasDimensions.height;

        const scaledLogoWidth = logoSize.width * scaleX;
        const scaledLogoHeight = logoSize.height * scaleY;
        const scaledLogoX = logoPosition.x * scaleX;
        const scaledLogoY = logoPosition.y * scaleY;

        // Draw the logo
        ctx.drawImage(
          logoImg,
          scaledLogoX,
          scaledLogoY,
          scaledLogoWidth,
          scaledLogoHeight
        );

        // Determine output format
        let mimeType = img.type; // Default to original format
        let fileExtension = img.name.split('.').pop()?.toLowerCase() || 'jpg';
        
        if (outputFormat !== 'original') {
          switch (outputFormat) {
            case 'jpg':
              mimeType = 'image/jpeg';
              fileExtension = 'jpg';
              break;
            case 'png':
              mimeType = 'image/png';
              fileExtension = 'png';
              break;
            case 'webp':
              mimeType = 'image/webp';
              fileExtension = 'webp';
              break;
            case 'avif':
              mimeType = 'image/avif';
              fileExtension = 'avif';
              break;
          }
        }

        // Convert to blob with the selected format
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else resolve(new Blob()); // Fallback empty blob
          }, mimeType);
        });

        // Generate a preview URL
        const previewUrl = URL.createObjectURL(blob);

        // Create a filename with the new extension if format changed
        const originalName = img.name;
        const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
        const newFileName = outputFormat === 'original' 
          ? originalName 
          : `${baseName}.${fileExtension}`;

        // Add to processed images
        processedImgs.push({
          name: newFileName,
          url: previewUrl,
          blob,
          previewUrl
        });

        // Add to zip
        zip.file(newFileName, blob);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return {
      processedImages: processedImgs,
      zipBlob
    };
  };

  const processImages = async () => {
    if (!logo || images.length === 0) {
      toast.error(t.errors.noLogo);
      return;
    }

    setIsProcessing(true);
    try {
      const prepared = await prepareImages();
      setPreparedImages(prepared);
      setProcessedImages(prepared.processedImages);
      setShowResults(true);  // Show results directly
    } catch (error) {
      console.error('Error processing images:', error);
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
    <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="border-b dark:border-gray-800">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LanguageSelect />
                <CurrencySelect />
              </div>
              <ThemeToggle />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mt-4">
            {t.title}
          </h1>
        </div>
      </header>

      <div className="flex-grow container mx-auto p-4">
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-3">{t.about.title}</h2>
          <p className="mb-4">{t.about.description}</p>
          <p className="mb-4">{t.about.formats}</p>
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
              <p>{formatPrice(currency === 'ILS' ? 10 : 3, currency === 'ILS')}</p>
              <p>{formatPrice(currency === 'ILS' ? 15 : 4, currency === 'ILS')}</p>
              <p>{formatPrice(currency === 'ILS' ? 20 : 5, currency === 'ILS')}</p>
              <p>{formatPrice(currency === 'ILS' ? 40 : 10, currency === 'ILS')}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            {logo && (
              <div className="mt-4 text-sm">
                {logo.name}
              </div>
            )}
          </Card>
        </div>

        {logo && images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <h2 className="text-xl mb-4">{t.logoPlacement.title}</h2>
              <p className="mb-2 text-sm text-gray-600">{t.logoPlacement.drag}</p>
              <div className="relative border rounded overflow-hidden">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto cursor-move"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">{t.logoPlacement.preview}</p>
            </Card>

            <Card className="p-4">
              <h2 className="text-xl mb-4">{t.logoSize.title}</h2>
              <p className="mb-2 text-sm text-gray-600">{t.logoSize.sliders}</p>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>{t.logoSize.width}</span>
                  <Input
                    type="number"
                    value={logoSize.width.toString()}
                    onChange={(e) => handleSizeChange(parseInt(e.target.value) || 1, 'width')}
                    className="w-24"
                    min="1"
                  />
                </div>
                <Slider
                  value={logoSize.width}
                  onChange={(value) => handleSizeChange(value as number, 'width')}
                  minValue={10}
                  maxValue={canvasDimensions.width}
                  step={1}
                  className="mb-4"
                />
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>{t.logoSize.height}</span>
                  <Input
                    type="number"
                    value={logoSize.height.toString()}
                    onChange={(e) => handleSizeChange(parseInt(e.target.value) || 1, 'height')}
                    className="w-24"
                    min="1"
                  />
                </div>
                <Slider
                  value={logoSize.height}
                  onChange={(value) => handleSizeChange(value as number, 'height')}
                  minValue={10}
                  maxValue={canvasDimensions.height}
                  step={1}
                  className="mb-4"
                />
              </div>
              
              <div className="flex items-center">
                <Switch
                  checked={maintainAspectRatio}
                  onChange={() => setMaintainAspectRatio(!maintainAspectRatio)}
                />
                <span className="ml-2">{t.logoSize.maintainRatio}</span>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-3">{t.outputFormat.title}</h2>
            <p className="mb-4 text-sm text-gray-600">{t.outputFormat.description}</p>
            <Select
              label={t.outputFormat.title}
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="mb-4"
            >
              <SelectItem key="original" value="original">
                {t.outputFormat.original}
              </SelectItem>
              <SelectItem key="jpg" value="jpg">
                {t.outputFormat.jpg}
              </SelectItem>
              <SelectItem key="png" value="png">
                {t.outputFormat.png}
              </SelectItem>
              <SelectItem key="webp" value="webp">
                {t.outputFormat.webp}
              </SelectItem>
              <SelectItem key="avif" value="avif">
                {t.outputFormat.avif}
              </SelectItem>
            </Select>
          </Card>
        </div>

        <Button
          color="primary"
          size="lg"
          className="w-full"
          onClick={processImages}
          isLoading={isProcessing}
          isDisabled={!logo || images.length === 0 || isProcessing}
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
        processedImages={processedImages}
        zipBlob={preparedImages?.zipBlob || null}
        paymentRequired={images.length > 2 && !paymentComplete}
        onPaymentClick={() => {
          setShowResults(false);
          setShowPayment(true);
        }}
        paymentComplete={paymentComplete}
      />
    </div>
  );
}
