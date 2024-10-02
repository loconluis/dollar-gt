import { getLast30DaysOfDolarValueOfficialRecords } from "@/lib/functions";
import { type NextRequest } from "next/server";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date") || "";
    const response = await getLast30DaysOfDolarValueOfficialRecords(date);
    return Response.json({
      data: response,
      count: response.length,
    });
  } catch (error) {
    throw error;
  }
}
