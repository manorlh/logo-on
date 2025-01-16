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
          "url": "https://yourlogohere.app",
          "description": "Free online tool to add your logo to multiple images at once. Perfect for real estate agents, photographers, and businesses.",
          "applicationCategory": "Image Processing Tool",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "description": "Free for basic usage"
          },
          "featureList": [
            "Batch logo processing",
            "Multiple image watermarking",
            "Customizable logo placement",
            "High-quality output",
            "Drag and drop interface",
            "Real-time preview"
          ],
          "screenshot": {
            "@type": "ImageObject",
            "url": "https://yourlogohere.app/screenshot.png"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "156"
          },
          "author": {
            "@type": "Organization",
            "name": "YourLogoHere.app",
            "url": "https://yourlogohere.app"
          },
          "inLanguage": ["en", "he", "ar"],
          "potentialAction": {
            "@type": "UseAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://yourlogohere.app/en",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            }
          }
        })
      }}
    />
  );
} 