'use client';

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "YourLogoHere.app",
          "applicationCategory": "DesignApplication",
          "operatingSystem": "Any",
          "description": "כלי חינמי להוספת לוגו למספר תמונות בו זמנית",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "ILS"
          },
          "inLanguage": ["he", "en"],
          "featureList": [
            "הוספת לוגו למספר תמונות בו זמנית",
            "שמירה על איכות התמונה המקורית",
            "ממשק משתמש ידידותי",
            "תמיכה בעברית ואנגלית"
          ]
        })
      }}
    />
  );
} 