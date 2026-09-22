import { ModernDollarTracker } from "@/components/ModernDollarTracker";
import { SiteHero } from "@/components/SiteHero";
import { SEOFooter } from "@/components/SEOFooter";
import { LocalSEO } from "@/components/LocalSEO";
import ModernNavbar from "@/components/ui/modern-navbar";
import {
  getDataBank,
  getLast30DaysOfDolarValueOfficialRecords,
} from "@/lib/functions";
import { getToday } from "@/lib/utils";
import { FormattedHistoricObject, IExchange } from "@/interfaces";

export const revalidate = 60;

export default async function Home() {
  // Historic Banguat data and bank rates are fetched on the server so the
  // H1, the live price, the rates table, the chart data and the JSON-LD
  // are all present in the initial HTML instead of client-side skeletons.
  let historicData: FormattedHistoricObject[] = [];
  try {
    historicData = await getLast30DaysOfDolarValueOfficialRecords(getToday());
  } catch {
    historicData = [];
  }

  let exchangeData: IExchange[] = [];
  try {
    const bankPayload = await getDataBank();
    exchangeData = bankPayload?.data ?? [];
  } catch {
    exchangeData = [];
  }

  const prices = historicData
    .map((d) => parseFloat(d.precio ?? "0"))
    .filter((n) => !Number.isNaN(n));
  const currentPrice = prices.length > 0 ? prices[prices.length - 1] : 0;

  return (
    <div className="min-h-[100dvh] bg-background">
      <LocalSEO currentPrice={currentPrice} />
      <ModernNavbar />
      <main className="pt-16 sm:pt-20">
        <SiteHero data={historicData} />
        <ModernDollarTracker
          initialData={historicData}
          initialExchangeData={exchangeData}
        />
      </main>
      <SEOFooter />
    </div>
  );
}
