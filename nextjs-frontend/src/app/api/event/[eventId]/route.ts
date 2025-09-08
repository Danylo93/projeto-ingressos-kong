import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const res = await fetch(`${process.env.GOLANG_API_URL}/events/${params.eventId}`, {
    headers: {
      "apikey": process.env.GOLANG_API_TOKEN as string,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
