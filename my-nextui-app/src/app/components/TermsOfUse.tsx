'use client';

import { useLanguage } from '../LanguageContext';
import { Card } from '@nextui-org/react';

export function TermsOfUse() {
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';

  return (
    <Card className="p-6">
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="text-2xl font-bold mb-6">
          {isRTL ? 'תנאי שימוש' : 'Terms of Use'}
        </h1>

        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'כללי' : 'General'}
            </h2>
            <p>
              {isRTL 
                ? 'ברוכים הבאים ל-YourLogoHere.app. השימוש באתר ובשירותים שלנו כפוף לתנאי השימוש המפורטים להלן.'
                : 'Welcome to YourLogoHere.app. By using our website and services, you agree to these terms of use.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'השירותים' : 'Services'}
            </h2>
            <p>
              {isRTL
                ? 'אנו מספקים שירות להוספת לוגו לתמונות. השירות מאפשר עיבוד של עד 2 תמונות בחינם, ומעבר לכך בתשלום.'
                : 'We provide a logo placement service for images. The service allows processing up to 2 images for free, with paid options for additional images.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'תשלומים' : 'Payments'}
            </h2>
            <p>
              {isRTL
                ? 'התשלומים מתבצעים באמצעות PayPal. איננו שומרים מידע על כרטיסי אשראי. לא ניתן לקבל החזר כספי לאחר קבלת התמונות המעובדות.'
                : 'Payments are processed through PayPal. We do not store credit card information. No refunds are available after receiving the processed images.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'מידע ופרטיות' : 'Data and Privacy'}
            </h2>
            <p>
              {isRTL
                ? 'איננו שומרים את התמונות או הלוגו שלך. כל העיבוד מתבצע בדפדפן שלך. אנו משתמשים בכלי אנליטיקה לשיפור השירות.'
                : 'We do not store your images or logos. All processing is done in your browser. We use analytics tools to improve our service.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'שימוש מותר' : 'Acceptable Use'}
            </h2>
            <p>
              {isRTL
                ? 'השירות תומך בתמונות מסוג JPG, PNG ו-JPEG. אין להעלות תכנים לא חוקיים או פוגעניים.'
                : 'The service supports JPG, PNG, and JPEG images. Do not upload illegal or offensive content.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'יצירת קשר' : 'Contact'}
            </h2>
            <p>
              {isRTL
                ? 'לשאלות ותמיכה ניתן לפנות אלינו בכתובת: @@'
                : 'For questions and support, contact us at: @@'
              }
            </p>
          </section>
        </div>
      </div>
    </Card>
  );
} 