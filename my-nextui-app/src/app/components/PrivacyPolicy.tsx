import { Card } from '@nextui-org/react';

interface PrivacyPolicyProps {
  language?: string;
}

export function PrivacyPolicy({ language = 'he' }: PrivacyPolicyProps) {
  const isHebrew = language === 'he';
  const isArabic = language === 'ar';
  const isRTL = isHebrew || isArabic;

  const getContent = (section: string) => {
    if (isHebrew) {
      switch (section) {
        case 'title': return 'מדיניות פרטיות';
        case 'collection_title': return 'איסוף מידע';
        case 'collection_content': return 'אנו אוספים מידע אנונימי באמצעות כלי אנליטיקה לצורך שיפור השירות. איננו אוספים או שומרים מידע אישי מזהה.';
        case 'images_title': return 'תמונות ולוגו';
        case 'images_content': return 'התמונות והלוגו שאתם מעלים מעובדים בדפדפן שלכם בלבד ואינם נשמרים בשרתים שלנו.';
        case 'payments_title': return 'תשלומים';
        case 'payments_content': return 'עיבוד התשלומים מתבצע באמצעות PayPal. איננו שומרים או מעבדים מידע פיננסי.';
        case 'cookies_title': return 'Cookies ומעקב';
        case 'cookies_content': return 'אנו משתמשים בכלי אנליטיקה לניתוח תנועת משתמשים ושיפור השירות. ניתן להשבית מעקב בהגדרות הדפדפן.';
        case 'changes_title': return 'שינויים במדיניות';
        case 'changes_content': return 'אנו שומרים את הזכות לעדכן את מדיניות הפרטיות. שינויים משמעותיים יפורסמו באתר.';
        case 'contact_title': return 'יצירת קשר';
        case 'contact_content': return 'לשאלות בנושא פרטיות ניתן לפנות אלינו בכתובת: @@';
        default: return '';
      }
    } else if (isArabic) {
      switch (section) {
        case 'title': return 'سياسة الخصوصية';
        case 'collection_title': return 'جمع المعلومات';
        case 'collection_content': return 'نحن نجمع معلومات مجهولة من خلال أدوات التحليلات لتحسين خدمتنا. نحن لا نجمع أو نخزن معلومات شخصية.';
        case 'images_title': return 'الصور والشعارات';
        case 'images_content': return 'تتم معالجة الصور والشعارات التي تقوم بتحميلها في متصفحك فقط ولا يتم تخزينها على خوادمنا.';
        case 'payments_title': return 'المدفوعات';
        case 'payments_content': return 'تتم معالجة المدفوعات من خلال PayPal. نحن لا نخزن أو نعالج المعلومات المالية.';
        case 'cookies_title': return 'ملفات تعريف الارتباط والتتبع';
        case 'cookies_content': return 'نحن نستخدم أدوات التحليلات لتحليل حركة المستخدم وتحسين خدمتنا. يمكنك تعطيل التتبع في إعدادات المتصفح الخاص بك.';
        case 'changes_title': return 'تغييرات في السياسة';
        case 'changes_content': return 'نحتفظ بالحق في تحديث سياسة الخصوصية الخاصة بنا. سيتم نشر التغييرات المهمة على الموقع.';
        case 'contact_title': return 'اتصل بنا';
        case 'contact_content': return 'للأسئلة المتعلقة بالخصوصية، اتصل بنا على: @@';
        default: return '';
      }
    } else {
      switch (section) {
        case 'title': return 'Privacy Policy';
        case 'collection_title': return 'Information Collection';
        case 'collection_content': return 'We collect anonymous information through analytics tools to improve our service. We do not collect or store personally identifiable information.';
        case 'images_title': return 'Images and Logos';
        case 'images_content': return 'The images and logos you upload are processed in your browser only and are not stored on our servers.';
        case 'payments_title': return 'Payments';
        case 'payments_content': return 'Payment processing is handled by PayPal. We do not store or process financial information.';
        case 'cookies_title': return 'Cookies and Tracking';
        case 'cookies_content': return 'We use analytics tools to analyze user traffic and improve our service. You can disable tracking in your browser settings.';
        case 'changes_title': return 'Policy Changes';
        case 'changes_content': return 'We reserve the right to update our privacy policy. Significant changes will be posted on the site.';
        case 'contact_title': return 'Contact';
        case 'contact_content': return 'For privacy-related questions, contact us at: @@';
        default: return '';
      }
    }
  };

  return (
    <Card className="p-6">
      <div dir={isRTL ? 'rtl' : 'ltr'}>
        <h1 className="text-2xl font-bold mb-6">
          {getContent('title')}
        </h1>

        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('collection_title')}
            </h2>
            <p>{getContent('collection_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('images_title')}
            </h2>
            <p>{getContent('images_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('payments_title')}
            </h2>
            <p>{getContent('payments_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('cookies_title')}
            </h2>
            <p>{getContent('cookies_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('changes_title')}
            </h2>
            <p>{getContent('changes_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('contact_title')}
            </h2>
            <p>{getContent('contact_content')}</p>
          </section>
        </div>
      </div>
    </Card>
  );
} 