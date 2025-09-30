import { getDataBank } from "@/lib/functions";

export const revalidate = 60;

export async function GET() {
  try {
    const _dt = await getDataBank();
    return Response.json({
      data: _dt.data,
    });
  } catch (error) {
    throw error;
  }
}
