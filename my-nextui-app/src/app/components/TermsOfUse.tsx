import { Card } from '@nextui-org/react';

interface TermsOfUseProps {
  language?: string;
}

export function TermsOfUse({ language = 'he' }: TermsOfUseProps) {
  const isHebrew = language === 'he';
  const isArabic = language === 'ar';
  const isRTL = isHebrew || isArabic;

  const getContent = (section: string) => {
    if (isHebrew) {
      switch (section) {
        case 'title': return 'תנאי שימוש';
        case 'general_title': return 'כללי';
        case 'general_content': return 'ברוכים הבאים ל-YourLogoHere.app. השימוש באתר ובשירותים שלנו כפוף לתנאי השימוש המפורטים להלן.';
        case 'services_title': return 'השירותים';
        case 'services_content': return 'אנו מספקים שירות להוספת לוגו לתמונות. השירות מאפשר עיבוד של עד 2 תמונות בחינם, ומעבר לכך בתשלום.';
        case 'payments_title': return 'תשלומים';
        case 'payments_content': return 'התשלומים מתבצעים באמצעות PayPal. איננו שומרים מידע על כרטיסי אשראי. לא ניתן לקבל החזר כספי לאחר קבלת התמונות המעובדות.';
        case 'data_title': return 'מידע ופרטיות';
        case 'data_content': return 'איננו שומרים את התמונות או הלוגו שלך. כל העיבוד מתבצע בדפדפן שלך. אנו משתמשים בכלי אנליטיקה לשיפור השירות.';
        case 'use_title': return 'שימוש מותר';
        case 'use_content': return 'השירות תומך בתמונות מסוג JPG, PNG ו-JPEG. אין להעלות תכנים לא חוקיים או פוגעניים.';
        case 'contact_title': return 'יצירת קשר';
        case 'contact_content': return 'לשאלות ותמיכה ניתן לפנות אלינו בכתובת: @@';
        default: return '';
      }
    } else if (isArabic) {
      switch (section) {
        case 'title': return 'شروط الاستخدام';
        case 'general_title': return 'عام';
        case 'general_content': return 'مرحبًا بك في YourLogoHere.app. استخدام موقعنا وخدماتنا يخضع لشروط الاستخدام المفصلة أدناه.';
        case 'services_title': return 'الخدمات';
        case 'services_content': return 'نحن نقدم خدمة لإضافة الشعار إلى الصور. تتيح الخدمة معالجة ما يصل إلى صورتين مجانًا، مع خيارات مدفوعة للصور الإضافية.';
        case 'payments_title': return 'المدفوعات';
        case 'payments_content': return 'تتم معالجة المدفوعات من خلال PayPal. نحن لا نخزن معلومات بطاقة الائتمان. لا توجد استردادات متاحة بعد استلام الصور المعالجة.';
        case 'data_title': return 'البيانات والخصوصية';
        case 'data_content': return 'نحن لا نخزن صورك أو شعاراتك. تتم جميع المعالجة في متصفحك فقط. نستخدم أدوات التحليلات لتحسين خدمتنا.';
        case 'use_title': return 'الاستخدام المقبول';
        case 'use_content': return 'تدعم الخدمة صور JPG و PNG و JPEG. لا تقم بتحميل محتوى غير قانوني أو مسيء.';
        case 'contact_title': return 'اتصل بنا';
        case 'contact_content': return 'للأسئلة والدعم، اتصل بنا على: @@';
        default: return '';
      }
    } else {
      switch (section) {
        case 'title': return 'Terms of Use';
        case 'general_title': return 'General';
        case 'general_content': return 'Welcome to YourLogoHere.app. By using our website and services, you agree to these terms of use.';
        case 'services_title': return 'Services';
        case 'services_content': return 'We provide a logo placement service for images. The service allows processing up to 2 images for free, with paid options for additional images.';
        case 'payments_title': return 'Payments';
        case 'payments_content': return 'Payments are processed through PayPal. We do not store credit card information. No refunds are available after receiving the processed images.';
        case 'data_title': return 'Data and Privacy';
        case 'data_content': return 'We do not store your images or logos. All processing is done in your browser. We use analytics tools to improve our service.';
        case 'use_title': return 'Acceptable Use';
        case 'use_content': return 'The service supports JPG, PNG, and JPEG images. Do not upload illegal or offensive content.';
        case 'contact_title': return 'Contact';
        case 'contact_content': return 'For questions and support, contact us at: @@';
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
              {getContent('general_title')}
            </h2>
            <p>{getContent('general_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('services_title')}
            </h2>
            <p>{getContent('services_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('payments_title')}
            </h2>
            <p>{getContent('payments_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('data_title')}
            </h2>
            <p>{getContent('data_content')}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">
              {getContent('use_title')}
            </h2>
            <p>{getContent('use_content')}</p>
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