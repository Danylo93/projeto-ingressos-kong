"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL, API_TOKEN } from "./lib/config";

export async function selectSpotAction(
  eventId: string,
  spotName: string,
  type: string,
  price: number
) {
  const cookieStore = cookies();

  const spots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  spots.push({ name: spotName, type, price });
  const uniqueSpots = spots.filter(
    (spot: any, index: number) =>
      spots.findIndex((s: any) => s.name === spot.name) === index
  );
  cookieStore.set("spots", JSON.stringify(uniqueSpots));
  cookieStore.set("eventId", eventId);
}

export async function unselectSpotAction(spotName: string) {
  const cookieStore = cookies();

  const spots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const newSpots = spots.filter((spot: any) => spot.name !== spotName);
  cookieStore.set("spots", JSON.stringify(newSpots));
}

export async function clearSpotsAction() {
  const cookieStore = cookies();
  cookieStore.set("spots", "[]");
  cookieStore.set("eventId", "");
}

export async function selectTicketTypeAction(ticketKind: "full" | "half") {
  const cookieStore = cookies();
  cookieStore.set("ticketKind", ticketKind);
}

export async function checkoutAction(prevState: any, {
  cardHash,
  email,
}: {
  cardHash: string;
  email: string;
}) {
  const cookieStore = cookies();
  const eventId = cookieStore.get("eventId")?.value;
  const spots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const ticketKind = cookieStore.get("ticketKind")?.value || "full";

  const response = await fetch(`${API_BASE_URL}/checkout`, {
    method: "POST",
    body: JSON.stringify({
      event_id: eventId,
      card_hash: cardHash,
      ticket_kind: ticketKind,
      spots: spots.map((s: any) => s.name),
      email,
    }),
    headers: {
      "Content-Type": "application/json",
      apikey: API_TOKEN,
    },
  });

  if (!response.ok) {
    return { error: "Erro ao realizar a compra" };
  }
  
  revalidateTag(`events/${eventId}`);
  redirect(`/checkout/${eventId}/success`);
}
