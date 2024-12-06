'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  processedImages: Array<{ name: string; url: string; blob: Blob }>;
  zipBlob: Blob | null;
}

export function ResultsModal({ isOpen, onClose, processedImages, zipBlob }: ResultsModalProps) {
  const { language, t } = useLanguage();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const isRTL = language === 'he';
  const needsPayment = processedImages.length > 2 && !paymentComplete;

  const handleDownload = (url: string, filename: string) => {
    if (needsPayment) {
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
    if (needsPayment) {
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
    setPaymentComplete(true);
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
          <ModalHeader className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
            {t.results.title}
          </ModalHeader>
          <ModalBody className="gap-4">
            <div dir={isRTL ? 'rtl' : 'ltr'} className={`space-y-4 `}>
              <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-100 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                {t.results.warning}
              </div>

              {paymentComplete && (
                <div className="p-4 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100 rounded-lg border border-green-200 dark:border-green-800">
                  {t.results.paymentSuccess}
                </div>
              )}
              
              {needsPayment && (
                <div className={`p-4 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-100 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-center ${isRTL ? "flex-row-reverse" : "flex-row"} justify-between`}>
                  <span>{t.results.paymentRequired}</span>
                  <Button
                    color="warning"
                    variant="flat"
                    size="sm"
                    onClick={() => setShowPayment(true)}
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
                    <img
                      src={image.url}
                      alt={`Processed ${index + 1}`}
                      className="w-full h-auto mb-2"
                    />
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
      />
    </>
  );
} 