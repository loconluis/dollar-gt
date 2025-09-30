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

    const latestRates = exchangeData.slice(0, 3); // Take top 3 rates

    return {
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: "Dollar Price Tracker - Guatemala",
      description:
        "Real-time USD to GTQ exchange rate tracking with charts and analytics",
      url: "https://dolar.luislocon.dev",
      provider: {
        "@type": "Organization",
        name: "Dollar GT",
        url: "https://dolar.luislocon.dev",
      },
      areaServed: {
        "@type": "Country",
        name: "Guatemala",
      },
      offers: latestRates.map((rate) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "CurrencyConversion",
          fromCurrency: "USD",
          toCurrency: "GTQ",
          exchangeRate: {
            "@type": "QuantitativeValue",
            value:
              typeof rate.buy === "string" ? parseFloat(rate.buy) : rate.buy,
            unitText: "GTQ per USD",
          },
        },
        seller: {
          "@type": "BankOrCreditUnion",
          name: rate.name || "Bank",
        },
        price: typeof rate.buy === "string" ? parseFloat(rate.buy) : rate.buy,
        priceCurrency: "GTQ",
      })),
      mainEntity: {
        "@type": "ExchangeRateSpecification",
        fromCurrency: "USD",
        toCurrency: "GTQ",
        exchangeRate: {
          "@type": "QuantitativeValue",
          value:
            typeof latestRates[0]?.buy === "string"
              ? parseFloat(latestRates[0].buy)
              : latestRates[0]?.buy || 0,
          unitText: "GTQ per USD",
        },
      },
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
