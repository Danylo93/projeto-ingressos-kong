import { NextResponse } from "next/server";
import { fetchApiJson } from "../../../../../lib/api";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const data = await fetchApiJson(
      `/events/${params.eventId}/spots`,
      {
        cache: "no-store",
      }
    );
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch spots", details: String(err) },
      { status: 500 }
    );
  }
}
