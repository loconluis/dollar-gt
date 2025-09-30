"use client";

interface LocalSEOProps {
  currentPrice?: number;
}

export function LocalSEO({ currentPrice }: LocalSEOProps) {
  const currentDateTime = new Date().toISOString();
  const priceText = currentPrice ? `Q${currentPrice.toFixed(5)}` : "Precio actual";

  return (
    <>
      <link
        rel="alternate"
        hrefLang="es-GT"
        href="https://dolar.luislocon.dev"
      />
      <link
        rel="alternate"
        hrefLang="es"
        href="https://dolar.luislocon.dev"
      />
      <link
        rel="alternate"
        hrefLang="x-default"
        href="https://dolar.luislocon.dev"
      />

      {/* Local business structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://dolar.luislocon.dev/#localbusiness",
            name: "DólarGT - Tipo de Cambio Guatemala",
            description: "Servicio de consulta de tipo de cambio dólar a quetzal guatemalteco en tiempo real",
            url: "https://dolar.luislocon.dev",
            telephone: "+502-XXXX-XXXX",
            address: {
              "@type": "PostalAddress",
              addressCountry: "GT",
              addressRegion: "Guatemala"
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 14.6349,
              longitude: -90.5069
            },
            areaServed: {
              "@type": "Country",
              name: "Guatemala"
            },
            openingHours: "Mo-Su 00:00-23:59",
            priceRange: "$$",
            currenciesAccepted: "GTQ, USD",
            paymentAccepted: "Cash, Credit Card",
            serviceType: "Currency Exchange Information",
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Servicios de Tipo de Cambio",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Consulta de tipo de cambio USD a GTQ",
                    description: "Consulta en tiempo real del tipo de cambio del dólar a quetzal guatemalteco"
                  },
                  price: "0",
                  priceCurrency: "GTQ",
                  availability: "https://schema.org/InStock"
                }
              ]
            }
          }),
        }}
      />

      {/* Organization structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://dolar.luislocon.dev/#organization",
            name: "DólarGT",
            url: "https://dolar.luislocon.dev",
            logo: {
              "@type": "ImageObject",
              url: "https://dolar.luislocon.dev/icon.png",
              width: 100,
              height: 100
            },
            description: "Plataforma líder para consultar el tipo de cambio del dólar a quetzal guatemalteco en Guatemala",
            foundingDate: "2024",
            areaServed: {
              "@type": "Country",
              name: "Guatemala"
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              areaServed: "GT",
              availableLanguage: ["Spanish"]
            },
            sameAs: [
              "https://twitter.com/dollargt",
              "https://facebook.com/dollargt"
            ]
          }),
        }}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Cuál es el tipo de cambio del dólar a quetzal hoy en Guatemala?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `El tipo de cambio actual del dólar a quetzal guatemalteco es ${priceText}. Este precio se actualiza en tiempo real basado en las tasas de los bancos de Guatemala.`
                }
              },
              {
                "@type": "Question",
                name: "¿Dónde puedo consultar el tipo de cambio USD a GTQ?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Puedes consultar el tipo de cambio USD a GTQ en nuestra plataforma DólarGT, donde mostramos las tasas actualizadas de todos los bancos de Guatemala."
                }
              },
              {
                "@type": "Question",
                name: "¿Cuál es el mejor banco para comprar dólares en Guatemala?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "El mejor banco para comprar dólares varía según las tasas del día. En nuestra plataforma mostramos en tiempo real cuál banco ofrece la mejor tasa de compra."
                }
              },
              {
                "@type": "Question",
                name: "¿Cómo se calcula el tipo de cambio del dólar a quetzal?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "El tipo de cambio del dólar a quetzal se determina por el Banco de Guatemala y varía según las condiciones del mercado. Cada banco puede tener su propio margen."
                }
              }
            ]
          }),
        }}
      />

      {/* Geo targeting meta tags */}
      <meta name="geo.region" content="GT" />
      <meta name="geo.position" content="14.6349;-90.5069" />
      <meta name="ICBM" content="14.6349, -90.5069" />
      <meta name="distribution" content="Guatemala" />
      <meta name="country" content="Guatemala" />
      <meta name="target_country" content="Guatemala" />
      <meta name="language" content="Spanish" />
      <meta name="geo.placename" content="Guatemala City, Guatemala" />

      {/* Additional meta for local search */}
      <meta name="category" content="finance,currency,exchange,guatemala" />
      <meta name="coverage" content="Worldwide" />
      <meta name="rating" content="General" />
      <meta name="revisit-after" content="1 hour" />

      {/* Schema for real-time data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "@id": "https://dolar.luislocon.dev/#realtime-data",
            name: "Datos en Tiempo Real",
            description: "Información actualizada en tiempo real sobre el tipo de cambio USD a GTQ",
            provider: {
              "@type": "Organization",
              name: "DólarGT"
            },
            serviceType: "Real-time Financial Data",
            areaServed: "Guatemala",
            availableLanguage: "Spanish",
            potentialAction: {
              "@type": "ViewAction",
              target: "https://dolar.luislocon.dev",
              object: {
                "@type": "Thing",
                name: "Tipo de Cambio USD a GTQ",
                description: "Consultar tipo de cambio actual del dólar a quetzal guatemalteco"
              }
            },
            dateModified: currentDateTime,
            additionalProperty: [
              {
                "@type": "PropertyValue",
                name: "Última Actualización",
                value: currentDateTime
              },
              {
                "@type": "PropertyValue",
                name: "Precio Actual",
                value: priceText
              },
              {
                "@type": "PropertyValue",
                name: "Moneda",
                value: "GTQ"
              }
            ]
          }),
        }}
      />
    </>
  );
}