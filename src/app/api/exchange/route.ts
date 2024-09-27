// import * as cheerio from "cheerio";
import { handler } from "@/app/api/exchange/handler";

export async function GET() {
  try {
    const res = await handler();
    return Response.json({ data: res });
  } catch (error) {
    throw error;
  }
}
