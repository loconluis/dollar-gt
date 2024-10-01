// import * as cheerio from "cheerio";
import { call } from "@/lib/functions";
export const revalidate = 60;

export async function GET() {
  try {
    const res = await call();
    return Response.json({ data: res });
  } catch (error) {
    throw error;
  }
}
