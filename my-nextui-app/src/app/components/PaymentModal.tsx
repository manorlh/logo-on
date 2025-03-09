'use client';

import {Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {useLanguage} from "../LanguageContext";
import {calculatePrice, formatPrice} from "../utils/pricing";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    imageCount: number;
    hasUsedFreeProcessing?: boolean;
}

export function PaymentModal({isOpen, onClose, onSuccess, imageCount, hasUsedFreeProcessing = false}: PaymentModalProps) {
    const {language, currency, t} = useLanguage();
    const isRTL = language === 'he' || language === 'ar';
    
    // If user has already used free processing and is processing 1-2 images, charge $1
    const amount = hasUsedFreeProcessing && imageCount <= 2 
        ? (currency === 'ILS' ? 3.5 : 1) // $1 or ₪3.5 for subsequent uses of 1-2 images
        : calculatePrice(imageCount, currency === 'ILS'); // Regular pricing for more than 2 images

    // Get description text based on whether user has used free processing
    const getDescription = () => {
        if (hasUsedFreeProcessing) {
            return t.payment.freeUsed;
        }
        return t.payment.description;
    };

    const getPayPalLocale = (language: string) => {
        switch (language) {
            case 'he':
                return 'he_IL';
            case 'ar':
                return 'ar_EG';  // Using Egyptian Arabic as it's widely understood
            default:
                return 'en_US';
        }
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
                        <p>{getDescription()}</p>
                        <p className="text-sm text-gray-600">{t.payment.firstUseFree}</p>
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
                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
                            currency: currency,
                            intent: "capture",
                            locale: getPayPalLocale(language)
                        }}>
                            <PayPalButtons
                                style={{layout: "vertical"}}
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
                                        application_context: {
                                            shipping_preference: "NO_SHIPPING" // No shipping required
                                        }
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