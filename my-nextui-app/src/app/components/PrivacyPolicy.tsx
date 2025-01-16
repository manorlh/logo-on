'use client';

import { useLanguage } from '../LanguageContext';
import { Card } from '@nextui-org/react';

export function PrivacyPolicy() {
  const { language } = useLanguage();
  const isRTL = language === 'he' || language === 'ar';

  return (
    <Card className="p-6">
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="text-2xl font-bold mb-6">
          {isRTL ? 'מדיניות פרטיות' : 'Privacy Policy'}
        </h1>

        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'איסוף מידע' : 'Information Collection'}
            </h2>
            <p>
              {isRTL
                ? 'אנו אוספים מידע אנונימי באמצעות כלי אנליטיקה לצורך שיפור השירות. איננו אוספים או שומרים מידע אישי מזהה.'
                : 'We collect anonymous information through analytics tools to improve our service. We do not collect or store personally identifiable information.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'תמונות ולוגו' : 'Images and Logos'}
            </h2>
            <p>
              {isRTL
                ? 'התמונות והלוגו שאתם מעלים מעובדים בדפדפן שלכם בלבד ואינם נשמרים בשרתים שלנו.'
                : 'The images and logos you upload are processed in your browser only and are not stored on our servers.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'תשלומים' : 'Payments'}
            </h2>
            <p>
              {isRTL
                ? 'עיבוד התשלומים מתבצע באמצעות PayPal. איננו שומרים או מעבדים מידע פיננסי.'
                : 'Payment processing is handled by PayPal. We do not store or process financial information.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'Cookies ומעקב' : 'Cookies and Tracking'}
            </h2>
            <p>
              {isRTL
                ? 'אנו משתמשים בכלי אנליטיקה לניתוח תנועת משתמשים ושיפור השירות. ניתן להשבית מעקב בהגדרות הדפדפן.'
                : 'We use analytics tools to analyze user traffic and improve our service. You can disable tracking in your browser settings.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'שינויים במדיניות' : 'Policy Changes'}
            </h2>
            <p>
              {isRTL
                ? 'אנו שומרים את הזכות לעדכן את מדיניות הפרטיות. שינויים משמעותיים יפורסמו באתר.'
                : 'We reserve the right to update our privacy policy. Significant changes will be posted on the site.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {isRTL ? 'יצירת קשר' : 'Contact'}
            </h2>
            <p>
              {isRTL
                ? 'לשאלות בנושא פרטיות ניתן לפנות אלינו בכתובת: @@'
                : 'For privacy-related questions, contact us at: @@'
              }
            </p>
          </section>
        </div>
      </div>
    </Card>
  );
} 