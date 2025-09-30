import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dolar.luislocon.dev";
  const currentDate = new Date();

  // URLs with different priorities and update frequencies
  const urls = [
    // Main page - highest priority
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  // Add dynamic pages for different search intents
  const searchIntents = [
    { path: "/tipo-de-cambio-dolar-quetzal", priority: 0.9, changeFreq: "daily" as const },
    { path: "/dolar-hoy-guatemala", priority: 0.9, changeFreq: "daily" as const },
    { path: "/precio-dolar-gtq", priority: 0.9, changeFreq: "daily" as const },
    { path: "/banco-guatemala-tipo-cambio", priority: 0.8, changeFreq: "daily" as const },
    { path: "/conversor-dolar-quetzal", priority: 0.8, changeFreq: "daily" as const },
    { path: "/tasas-cambio-bancos-guatemala", priority: 0.8, changeFreq: "daily" as const },
    { path: "/historial-dolar-quetzal", priority: 0.7, changeFreq: "daily" as const },
    { path: "/mejor-tasa-dolar-guatemala", priority: 0.8, changeFreq: "daily" as const },
    { path: "/banguat-dolar-hoy", priority: 0.8, changeFreq: "daily" as const },
    { path: "/cambio-moneda-guatemala", priority: 0.7, changeFreq: "daily" as const },
  ];

  // Add search intent pages
  searchIntents.forEach((intent) => {
    urls.push({
      url: `${baseUrl}${intent.path}`,
      lastModified: currentDate,
      changeFrequency: intent.changeFreq,
      priority: intent.priority,
    });
  });

  // Add bank-specific pages
  const banks = [
    "banco-industrial",
    "banco-g-y-t-continental",
    "banco-agricola",
    "banco-de-occidente",
    "banco-inmobiliario",
    "banco-promerica",
    "banco-citibank",
    "banco-internacional",
    "bamy",
  ];

  banks.forEach((bank) => {
    urls.push({
      url: `${baseUrl}/tasa-cambio/${bank}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.6,
    });
  });

  // Add location-specific pages
  const locations = [
    "guatemala-city",
    "quetzaltenango",
    "mixco",
    "villa-nueva",
    "petapa",
    "coban",
    "mazatenango",
    "puerto-barrios",
    "antigua-guatemala",
    "escuintla",
  ];

  locations.forEach((location) => {
    urls.push({
      url: `${baseUrl}/tipo-cambio/${location}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.5,
    });
  });

  return urls;
}
