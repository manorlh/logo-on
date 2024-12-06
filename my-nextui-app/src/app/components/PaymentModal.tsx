'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useLanguage } from "../LanguageContext";
import { calculatePrice, formatPrice } from "../utils/pricing";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  imageCount: number;
}

export function PaymentModal({ isOpen, onClose, onSuccess, imageCount }: PaymentModalProps) {
  const { language, currency, t } = useLanguage();
  const isRTL = language === 'he';
  const amount = calculatePrice(imageCount, currency === 'ILS');

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
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
        <ModalHeader className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}>
          {t.payment.title}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
            <p>{t.payment.description}</p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-lg font-semibold">{t.payment.summary}</p>
              <div className="flex justify-between items-center mt-2">
                <span>{t.payment.imageCount}:</span>
                <span>{imageCount}</span>
              </div>
              <div className="flex justify-between items-center mt-2 text-xl font-bold">
                <span>{t.payment.total}:</span>
                <span>{formatPrice(amount, currency === 'ILS')}</span>
              </div>
            </div>
            <PayPalScriptProvider options={{
              "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
              currency: currency,
              intent: "capture",
              locale: language === 'he' ? 'he_IL' : 'en_US'
            }}>
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          value: amount.toString(),
                          currency_code: currency
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order!.capture().then(() => {
                    onSuccess();
                  });
                }}
              />
            </PayPalScriptProvider>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 