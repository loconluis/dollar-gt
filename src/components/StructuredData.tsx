"use client";

interface StructuredDataProps {
  exchangeData: {
    name: string;
    buy: string | number;
    sell?: string | number;
    is_online?: boolean;
  }[];
}

export function StructuredData({ exchangeData }: StructuredDataProps) {
  const generateStructuredData = () => {
    if (!exchangeData || exchangeData.length === 0) return null;

    const latestRates = exchangeData.slice(0, 5); // Take top 5 rates for better coverage
    const bestBuyRate = Math.max(
      ...exchangeData.map(item =>
        typeof item.buy === "string" ? parseFloat(item.buy) : item.buy || 0
      )
    );
    const bestSellRate = Math.min(
      ...exchangeData.map(item =>
        typeof item.sell === "string" ? parseFloat(item.sell) : item.sell || 0
      )
    );

    const currentDate = new Date().toISOString().split('T')[0];

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://dolar.luislocon.dev/#website",
          url: "https://dolar.luislocon.dev",
          name: "DólarGT - Tipo de Cambio Dólar a Quetzal Guatemalteco",
          description: "Consulta el tipo de cambio dólar a quetzal guatemalteco en tiempo real. Precios actualizados de bancos, gráficos históricos y conversor de moneda.",
          inLanguage: "es-GT",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://dolar.luislocon.dev/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "FinancialService",
          "@id": "https://dolar.luislocon.dev/#financialservice",
          name: "DólarGT - Servicio de Tipo de Cambio Guatemala",
          description: "Servicio de seguimiento de tipo de cambio USD a GTQ en tiempo real con análisis de tendencias e históricos",
          url: "https://dolar.luislocon.dev",
          provider: {
            "@type": "Organization",
            "@id": "https://dolar.luislocon.dev/#organization",
            name: "DólarGT",
            url: "https://dolar.luislocon.dev",
            areaServed: {
              "@type": "Country",
              name: "Guatemala",
              sameAs: "https://en.wikipedia.org/wiki/Guatemala"
            }
          },
          serviceType: "Exchange Rate Service",
          audience: {
            "@type": "Audience",
            audienceType: "General Public",
            geographicArea: {
              "@type": "Country",
              name: "Guatemala"
            }
          },
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: "https://dolar.luislocon.dev",
            availableLanguage: {
              "@type": "Language",
              name: "Spanish",
              alternateName: "es"
            }
          }
        },
        {
          "@type": "ExchangeRateSpecification",
          "@id": "https://dolar.luislocon.dev/#exchangerate",
          name: "Tipo de Cambio USD a GTQ",
          description: "Tipo de cambio actual del dólar estadounidense a quetzal guatemalteco",
          fromCurrency: {
            "@type": "Currency",
            name: "US Dollar",
            alternateName: "USD",
            currencyCode: "USD"
          },
          toCurrency: {
            "@type": "Currency",
            name: "Guatemalan Quetzal",
            alternateName: "GTQ",
            currencyCode: "GTQ"
          },
          exchangeRate: {
            "@type": "QuantitativeValue",
            value: bestBuyRate,
            unitText: "GTQ per USD",
            minValue: bestSellRate,
            maxValue: bestBuyRate
          },
          validFrom: currentDate,
          provider: {
            "@type": "Organization",
            name: "Banco de Guatemala",
            url: "https://www.banguat.gob.gt"
          }
        },
        ...latestRates.map((rate, index) => ({
          "@type": "Offer",
          "@id": `https://dolar.luislocon.dev/#offer-${index}`,
          name: `Tipo de Cambio USD a GTQ - ${rate.name}`,
          description: `Tasa de cambio de dólar a quetzal en ${rate.name}`,
          itemOffered: {
            "@type": "CurrencyConversion",
            name: "USD to GTQ Exchange",
            fromCurrency: {
              "@type": "Currency",
              name: "US Dollar",
              alternateName: "USD"
            },
            toCurrency: {
              "@type": "Currency",
              name: "Guatemalan Quetzal",
              alternateName: "GTQ"
            },
            exchangeRate: {
              "@type": "QuantitativeValue",
              value: typeof rate.buy === "string" ? parseFloat(rate.buy) : rate.buy,
              unitText: "GTQ per USD"
            }
          },
          seller: {
            "@type": "BankOrCreditUnion",
            name: rate.name,
            areaServed: {
              "@type": "Country",
              name: "Guatemala"
            }
          },
          price: typeof rate.buy === "string" ? parseFloat(rate.buy) : rate.buy,
          priceCurrency: "GTQ",
          availability: "https://schema.org/InStock",
          validFrom: currentDate,
          category: rate.is_online ? "Online Banking" : "Traditional Banking"
        })),
        {
          "@type": "Dataset",
          "@id": "https://dolar.luislocon.dev/#dataset",
          name: "Historial de Tipo de Cambio USD/GTQ - Guatemala",
          description: "Dataset histórico del tipo de cambio del dólar a quetzal guatemalteco",
          publisher: {
            "@type": "Organization",
            name: "DólarGT"
          },
          temporalCoverage: "2024-01-01/2025-12-31",
          spatialCoverage: {
            "@type": "Country",
            name: "Guatemala"
          },
          keywords: "tipo de cambio, dólar, quetzal, Guatemala, USD, GTQ, banco",
          distribution: {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: "https://dolar.luislocon.dev/api/exchange-rates"
          }
        }
      ]
    };
  };

  const structuredData = generateStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
