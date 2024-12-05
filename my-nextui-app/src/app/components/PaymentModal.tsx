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

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';

const initialPayPalOptions = {
  clientId: PAYPAL_CLIENT_ID,
  currency: "ILS",
  intent: "capture",
  components: "buttons",
};

export function PaymentModal({ isOpen, onClose, onSuccess, imageCount }: PaymentModalProps) {
  const { t, language } = useLanguage();
  const isRTL = language === 'he';
  const amount = calculatePrice(imageCount);

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: "ILS"
          },
          description: `Logo Processing for ${imageCount} images`
        }
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING"
      }
    });
  };

  const onApprove = (data: any, actions: any) => {
    return actions.order.capture().then(() => {
      onSuccess();
      onClose();
    });
  };

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
                <span>{formatPrice(amount)}</span>
              </div>
            </div>
            <div className={isRTL ? 'flip-paypal' : ''}>
              <PayPalScriptProvider options={initialPayPalOptions}>
                <PayPalButtons 
                  createOrder={createOrder}
                  onApprove={onApprove}
                  style={{ layout: "vertical" }}
                  forceReRender={[amount, language]}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
} 