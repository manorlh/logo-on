'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";
import { useState, useEffect } from "react";
import { PaymentModal } from "./PaymentModal";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  processedImages: Array<{
    name: string;
    url: string;
    previewUrl: string;
    blob: Blob;
  }>;
  zipBlob: Blob | null;
  paymentRequired?: boolean;
  onPaymentClick?: () => void;
  paymentComplete?: boolean;
}

interface ProcessedImage {
  name: string;
  url: string;  // Low res preview URL
  blob: Blob;   // Original quality blob
  previewUrl: string;  // Add this for low res preview
}

export function ResultsModal({ 
  isOpen, 
  onClose, 
  processedImages, 
  zipBlob,
  paymentRequired = false,
  onPaymentClick,
  paymentComplete = false
}: ResultsModalProps) {
  const { language, t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [localPaymentComplete, setLocalPaymentComplete] = useState(false);
  const [hasUsedFreeDownload, setHasUsedFreeDownload] = useState(false);
  
  // Use either the prop or local state for payment completion
  const isPaymentComplete = paymentComplete || localPaymentComplete;
  const isRTL = language === 'he' || language === 'ar';
  const needsPayment = (paymentRequired || hasUsedFreeDownload) && !isPaymentComplete;

  // Check if user has already used free download
  useEffect(() => {
    if (isOpen) {
      const hasUsed = localStorage.getItem('hasUsedFreeProcessing') === 'true';
      setHasUsedFreeDownload(hasUsed);
    }
  }, [isOpen]);

  const handleDownload = (url: string, filename: string) => {
    // Allow downloading up to 2 images for free if they haven't used their free processing yet
    if (!isPaymentComplete && !hasUsedFreeDownload && processedImages.length <= 2) {
      // Mark that they've used their free processing after downloading
      localStorage.setItem('hasUsedFreeProcessing', 'true');
      setHasUsedFreeDownload(true);
    } else if (needsPayment) {
      setShowPayment(true);
      return;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAll = () => {
    // Allow downloading up to 2 images for free if they haven't used their free processing yet
    if (!isPaymentComplete && !hasUsedFreeDownload && processedImages.length <= 2) {
      // Mark that they've used their free processing after downloading
      localStorage.setItem('hasUsedFreeProcessing', 'true');
      setHasUsedFreeDownload(true);
    } else if (needsPayment) {
      setShowPayment(true);
      return;
    }

    if (zipBlob) {
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images-with-logo.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePaymentSuccess = () => {
    setLocalPaymentComplete(true);
    setShowPayment(false);
  };

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        scrollBehavior="inside"
        size="2xl"
        classNames={{
          base: isRTL ? "rtl" : "ltr",
          header: `gap-2 ${isRTL ? "text-right" : "text-left"}`,
          body: "gap-4",
          backdrop: "bg-black/50 backdrop-blur-sm",
        }}
      >
        <ModalContent>
          <ModalHeader className={`flex flex-col items-start`}>
            {t.results.title}
          </ModalHeader>
          <ModalBody className="gap-4">
            <div dir={isRTL ? 'rtl' : 'ltr'} className={`space-y-4 `}>
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                {t.results.warning}
              </div>

              {isPaymentComplete && (
                <div className="p-4 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100 rounded-lg border border-green-200 dark:border-green-800">
                  {t.results.paymentSuccess}
                </div>
              )}
              
              {needsPayment && (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-4">
                  <p className="mb-2">{hasUsedFreeDownload ? t.payment.freeUsed : t.results.paymentRequired}</p>
                  <p className="mb-2 text-sm">{t.payment.firstUseFree}</p>
                  <Button 
                    color="primary" 
                    onClick={onPaymentClick || (() => setShowPayment(true))}
                  >
                    {t.results.payNow}
                  </Button>
                </div>
              )}

              <div>
                <Button
                  color="primary"
                  onClick={handleDownloadAll}
                  className="w-full"
                >
                  {t.results.downloadAll}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {processedImages.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="relative">
                      <img
                        src={image.previewUrl}
                        alt={`Processed ${index + 1}`}
                        className="w-full h-auto mb-2"
                      />
                      {needsPayment && (
                        <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/30 text-white text-center text-xs">
                          yourlogohere.app
                        </div>
                      )}
                    </div>
                    <Button
                      color="secondary"
                      onClick={() => handleDownload(image.url, image.name)}
                      className="w-full"
                    >
                      {t.results.downloadImage}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
        imageCount={processedImages.length}
        hasUsedFreeProcessing={hasUsedFreeDownload}
      />
    </>
  );
} 