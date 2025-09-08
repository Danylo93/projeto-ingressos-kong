"use client";
import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

export function Footer() {
  const [spots, setSpots] = useState<string[]>([]);
  const [total, setTotal] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const spotsCookie = getCookie("spots");
      const eventId = getCookie("eventId");
      if (!spotsCookie || !eventId) {
        setSpots([]);
        setTotal("");
        return;
      }
      const parsedSpots: string[] = JSON.parse(spotsCookie);
      setSpots(parsedSpots);
      fetch(`/api/event/${eventId}`)
        .then((res) => res.json())
        .then((event) => {
          const ticketKind = getCookie("ticketKind") || "full";
          let price = parsedSpots.length * event.price;
          if (ticketKind === "half") price = price / 2;
          setTotal(
            price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
          );
        })
        .catch(() => {});
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (spots.length === 0 || !total) return null;

  return (
    <footer className="mt-auto w-full bg-[#1D232A] text-white p-4 flex flex-wrap justify-between gap-y-2">
      <div>Assentos: {spots.join(", ")}</div>
      <div>Total: {total}</div>
    </footer>
  );
}
