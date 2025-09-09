import Link from "next/link";
import { Title } from "../../../../components/Title";
import { EventModel, SpotModel } from "../../../../models";
import { SpotSeat } from "../../../../components/SpotSeat";
import { TicketKindSelect } from "./TicketKindSelect";
import { cookies } from "next/headers";
import { EventImage } from "../../../../components/EventImage";
import { fetchJson } from "../../../../lib/api";
import { Fragment } from "react";

export const dynamic = "force-dynamic";

async function getSpots(eventId: string): Promise<{
  event: EventModel;
  spots: SpotModel[];
}> {
  try {
    return await fetchJson<{ event: EventModel; spots: SpotModel[] }>(
      `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/event/${eventId}/spots`,
      { cache: "no-store" }
    );
  } catch (err) {
    console.error("Failed to load spots", err);
    return { event: {} as EventModel, spots: [] };
  }
}

export default async function SpotsLayoutPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { event, spots } = await getSpots(params.eventId);

  // Ordena os lugares numericamente (S1, S2, ... S3000)
  const sortedSpots = spots.sort(
    (a, b) => parseInt(a.name.slice(1)) - parseInt(b.name.slice(1))
  );

  // Distribui os assentos em linhas, inserindo um corredor central
  const seatsPerRow = 50; // 25 assentos de cada lado
  const spotRows: SpotModel[][] = [];
  for (let i = 0; i < sortedSpots.length; i += seatsPerRow) {
    spotRows.push(sortedSpots.slice(i, i + seatsPerRow));
  }

  const cookieStore = cookies();
  const selectedSpots = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const selectedSpotNames = selectedSpots.map((s: any) => s.name);
  let totalPrice = selectedSpots.reduce(
    (sum: number, s: any) => sum + s.price,
    0
  );
  const ticketKind = cookieStore.get("ticketKind")?.value || "full";
  const isLogged = !!cookieStore.get("user")?.value;

  if (ticketKind === "half") {
    totalPrice = totalPrice / 2;
  }
  const formattedTotalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalPrice);

  return (
    <main className="mt-10">
      <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-normal">
        <EventImage src={event.image_url} alt={event.name} />
        <div className="flex max-w-full flex-col gap-y-6">
          <div className="flex flex-col gap-y-2 ">
            <p className="text-sm font-semibold uppercase text-subtitle">
              {new Date(event.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-2xl font-semibold">{event.name}</p>
            <p className="font-normal">{event.location}</p>
          </div>
          <div className="flex h-[128px] flex-wrap justify-between gap-y-5 gap-x-3">
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">Organizador</p>
              <p className="text-sm font-normal">{event.organization}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">Classificação</p>
              <p className="text-sm font-normal">{event.rating}</p>
            </div>
          </div>
        </div>
      </div>
      <Title className="mt-10">Escolha seu lugar</Title>
      <div className="mt-6 flex flex-wrap justify-between">
        <div className=" mb-4 flex w-full max-w-[650px] flex-col gap-y-8 rounded-2xl bg-secondary p-6">
          <div className="rounded-2xl bg-bar py-4 text-center text-[20px] font-bold uppercase text-white">
            Palco
          </div>
          <div className="overflow-auto md:w-full md:justify-normal">
            {spotRows.length > 0 ? (
              spotRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-row items-center gap-3 mb-2"
                >
                  <div className="w-6 text-center">{rowIndex + 1}</div>
                  <div className="ml-2 flex flex-row">
                    {row.map((spot, idx) => (
                      <Fragment key={spot.name}>
                        {idx === seatsPerRow / 2 && (
                          <div className="mx-1 h-6 w-6 rounded-sm bg-bar" />
                        )}
                        <SpotSeat
                          spotId={spot.name}
                          spotLabel={spot.name.slice(1)}
                          eventId={event.id}
                          selected={selectedSpotNames.includes(spot.name)}
                          disabled={spot.status === "sold" || !isLogged}
                          spotType={spot.type}
                          price={spot.price}
                        />
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4">Nenhum assento disponível.</p>
            )}
          </div>
          <div className="flex w-full flex-row justify-around">
            <div className=" flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#00A96E]" />
              Disponível
            </div>
            <div className=" flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#A6ADBB]" />
              Ocupado
            </div>
            <div className=" flex flex-row items-center">
              <span className="mr-1 block h-4 w-4  rounded-full bg-[#7480FF]" />
              Selecionado
            </div>
          </div>
          {!isLogged && (
            <p className="text-center text-sm">Faça login para selecionar assentos.</p>
          )}
        </div>
        <div className="flex w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary px-4 py-6">
          <h1 className="text-[20px] font-semibold">Confira os valores do evento</h1>
          {Array.from(
            new Map(spots.map((s) => [s.type, s.price])).entries()
          ).map(([type, price]) => (
            <p key={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}: {" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(price)}
            </p>
          ))}
          <div className="flex flex-col">
            <TicketKindSelect defaultValue={ticketKind as any} price={event.price} />
          </div>
          <div>Total: {formattedTotalPrice}</div>
          {isLogged ? (
            <Link
              href="/checkout"
              className={`rounded-lg bg-btn-primary py-4 text-sm font-semibold uppercase text-btn-primary text-center hover:bg-[#fff] ${selectedSpots.length === 0 ? "pointer-events-none opacity-50" : ""}`}
            >
              Ir para pagamento
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-btn-primary py-4 text-sm font-semibold uppercase text-btn-primary text-center hover:bg-[#fff]"
            >
              Faça login para comprar
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
