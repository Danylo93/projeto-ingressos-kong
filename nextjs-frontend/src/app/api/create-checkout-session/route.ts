import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email } = await req.json();
  const cookieStore = cookies();
  const eventId = cookieStore.get("eventId")?.value;
  const spots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const ticketKind = cookieStore.get("ticketKind")?.value || "full";
  if (!eventId || spots.length === 0) {
    return NextResponse.json({ message: "Dados incompletos" }, { status: 400 });
  }
  const eventRes = await fetch(`${process.env.GOLANG_API_URL}/events/${eventId}`, {
    headers: {
      "apikey": process.env.GOLANG_API_TOKEN as string,
    },
    cache: "no-store",
  });
  if (!eventRes.ok) {
    return NextResponse.json({ message: "Evento não encontrado" }, { status: 400 });
  }
  const event = await eventRes.json();
  let totalPrice = spots.length * event.price;
  if (ticketKind === "half") {
    totalPrice = totalPrice / 2;
  }

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${eventId}/success`);
  params.append("cancel_url", `${process.env.NEXT_PUBLIC_APP_URL}/checkout`);
  params.append("customer_email", email);
  params.append("line_items[0][quantity]", "1");
  params.append("line_items[0][price_data][currency]", "brl");
  params.append("line_items[0][price_data][product_data][name]", event.name);
  params.append(
    "line_items[0][price_data][unit_amount]",
    String(Math.round(totalPrice * 100))
  );

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });
  if (!stripeRes.ok) {
    return NextResponse.json({ message: "Erro ao criar sessão" }, { status: 500 });
  }
  const session = await stripeRes.json();
  return NextResponse.json({ url: session.url });
}
