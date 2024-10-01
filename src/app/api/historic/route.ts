import { getLast30DaysOfDolarValueOfficialRecords } from "@/lib/functions";
// import { substract30DaysFromDate } from "@/lib/utils";

export const revalidate = 60;

export async function GET() {
  try {
    // const past = substract30DaysFromDate("01/10/2024");
    const response = await getLast30DaysOfDolarValueOfficialRecords(
      "01/10/2024"
    );
    return Response.json({ data: response });
  } catch (error) {
    throw error;
  }
}
