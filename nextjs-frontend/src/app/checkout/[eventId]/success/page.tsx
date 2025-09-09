import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { Title } from "../../../../components/Title";
import { EventModel } from "../../../../models";
import { clearSpotsAction } from "../../../../actions";
import { fetchJson } from "../../../../lib/api";

export const dynamic = "force-dynamic";
// queries
async function getEvent(eventId: string): Promise<EventModel | null> {
  try {
    return await fetchJson<EventModel>(
      `${process.env.GOLANG_API_URL}/events/${eventId}`,
      {
        headers: {
          "apikey": process.env.GOLANG_API_TOKEN as string,
        },
        cache: "no-store",
        next: {
          tags: [`events/${eventId}`],
        },
      }
    );
  } catch (err) {
    console.error("Failed to load event", err);
    return null;
  }
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { eventId: string };
  searchParams: { session_id?: string };
}) {
  const cookieStore = cookies();
  const selectedSpots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const ticketKind = cookieStore.get("ticketKind")?.value || "full";
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  if (searchParams.session_id && selectedSpots.length > 0 && user) {
      await fetch(`${process.env.GOLANG_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": process.env.GOLANG_API_TOKEN as string,
        },
        body: JSON.stringify({
          event_id: params.eventId,
        spots: selectedSpots.map((s: any) => s.name),
          ticket_kind: ticketKind,
          card_hash: searchParams.session_id,
          email: user.email,
        }),
      });
    revalidateTag(`events/${params.eventId}`);
    await clearSpotsAction();
  }
  const event = await getEvent(params.eventId);
  if (!event) {
    return (
      <main className="mt-10 flex flex-col flex-wrap items-center ">
        <Title>Evento não encontrado</Title>
      </main>
    );
  }
  return (
    <main className="mt-10 flex flex-col flex-wrap items-center ">
      <Title>Compra realizada com sucesso!</Title>
      <div className="mb-4 flex max-h-[250px] w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary p-4">
        <Title>Resumo da compra</Title>
        <p className="font-semibold">
          Evento {event.name}
          <br />
          Local {event.location}
          <br />
          Data{" "}
          {new Date(event.date).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="font-semibold text-white">Lugares escolhidos: {selectedSpots.map((s: any) => s.name).join(", ")}</p>
        
      </div>
    </main>
  );
}
