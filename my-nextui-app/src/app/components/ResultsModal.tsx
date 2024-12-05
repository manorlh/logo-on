'use client';

import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Card } from "@nextui-org/react";
import { useLanguage } from "../LanguageContext";
import JSZip from 'jszip';

interface ProcessedImage {
  name: string;
  url: string;
  blob: Blob;
}

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  processedImages: ProcessedImage[];
  zipBlob: Blob | null;
}

export function ResultsModal({ isOpen, onClose, processedImages, zipBlob }: ResultsModalProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'he';
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDownloadAll = async () => {
    if (!zipBlob) return;
    
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'processed-images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingle = (image: ProcessedImage) => {
    const url = URL.createObjectURL(image.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = image.name;
    a.click();
    URL.revokeObjectURL(url);
  };
  const closing = () => {
    setShowConfirmation(false);
    onClose();
  };
  return (
    <>
      <Modal 
        isOpen={isOpen}
        onClose={() => setShowConfirmation(true)}
        size="4xl"
        scrollBehavior="inside"
        classNames={{
          base: isRTL ? "rtl" : "ltr",
          header: `gap-2 ${isRTL ? "text-right" : "text-left"}`,
          body: "gap-4 custom-modal-body",
          backdrop: "bg-black/50 backdrop-blur-sm",
          wrapper: "overflow-hidden"
        }}
      >
        <ModalContent className="custom-modal">
          <ModalHeader className={`flex flex-col ${isRTL ? "items-end" : "items-start"} w-full`}>
            {t.results.title}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg text-yellow-700 dark:text-yellow-200">
                {t.results.warning}
              </div>
              <Button
                color="primary"
                className="w-full"
                onClick={handleDownloadAll}
              >
                {t.results.downloadAll}
              </Button>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedImages.map((image, index) => (
                  <Card key={index} className="p-4">
                    <img 
                      src={image.url} 
                      alt={image.name}
                      className="w-full h-48 object-contain mb-2"
                    />
                    <p className="text-sm truncate mb-2">{image.name}</p>
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={() => handleDownloadSingle(image)}
                    >
                      {t.results.downloadImage}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)}
        classNames={{
          base: isRTL ? "rtl" : "ltr",
          header: `gap-2 ${isRTL ? "text-right" : "text-left"}`,
        }}
      >
        <ModalContent>
          <ModalHeader className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
            {t.results.confirmClose.title}
          </ModalHeader>
          <ModalBody>
            <div dir={isRTL ? 'rtl' : 'ltr'}>
              <p>{t.results.confirmClose.message}</p>
              <div className={`flex gap-2 mt-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <Button color="danger" onClick={closing}>
                  {t.results.confirmClose.confirm}
                </Button>
                <Button color="default" onClick={() => setShowConfirmation(false)}>
                  {t.results.confirmClose.cancel}
                </Button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
} 