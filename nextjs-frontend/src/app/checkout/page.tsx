import { cookies } from "next/headers";
import { Title } from "../../components/Title";
import { redirect } from "next/navigation";
import { EventModel } from "../../models";
import { CheckoutForm } from "./CheckoutForm";
import { fetchApiJson } from "../../lib/api";

export const dynamic = "force-dynamic";

async function getEvent(eventId: string): Promise<EventModel | null> {
  try {
    return await fetchApiJson<EventModel>(
      `/events/${eventId}`,
      {
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

export default async function CheckoutPage() {
  const cookiesStore = cookies();
  const eventId = cookiesStore.get("eventId")?.value;
  const userCookie = cookiesStore.get("user")?.value;
  if (!eventId || !userCookie) {
    return redirect(userCookie ? "/" : "/login");
  }
  const user = JSON.parse(userCookie);
  const event = await getEvent(eventId);
  if (!event) {
    return redirect("/");
  }
  const selectedSpots = JSON.parse(cookiesStore.get("spots")?.value || "[]");
  let totalPrice = selectedSpots.reduce(
    (sum: number, s: any) => sum + s.price,
    0
  );
  const ticketKind = cookiesStore.get("ticketKind")?.value;
  if (ticketKind === "half") {
    totalPrice = totalPrice / 2;
  }
  const formattedTotalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalPrice);
  return (
    <main className="mt-10 flex flex-wrap justify-center md:justify-between">
      <div className="mb-4 flex max-h-[250px] w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary p-4">
        <Title>Resumo da compra</Title>
        <p className="font-semibold">
          {event.name}
          <br />
          {event.location}
          <br />
          {new Date(event.date).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <p className="font-semibold text-white">{formattedTotalPrice}</p>
      </div>
      <div className="w-full max-w-[650px] rounded-2xl bg-secondary p-4">
        <Title>Informações de pagamento</Title>
        <CheckoutForm className="mt-6 flex flex-col gap-y-3">
          <input type="hidden" name="email" value={user.email} />
        </CheckoutForm>
      </div>
    </main>
  );
}
