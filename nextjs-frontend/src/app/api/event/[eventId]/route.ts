import { NextResponse } from "next/server";
import { fetchJson } from "../../../../lib/api";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const data = await fetchJson(
      `${process.env.GOLANG_API_URL}/events/${params.eventId}`,
      {
        headers: {
          "apikey": process.env.GOLANG_API_TOKEN as string,
        },
        cache: "no-store",
      }
    );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch event", details: String(err) },
      { status: 500 }
    );
  }
}
