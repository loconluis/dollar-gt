// // import * as cheerio from "cheerio";
export const revalidate = 60;

export async function GET() {
  try {
    return Response.json({
      data: "Someday here will you can find something here",
    });
  } catch (error) {
    throw error;
  }
}
