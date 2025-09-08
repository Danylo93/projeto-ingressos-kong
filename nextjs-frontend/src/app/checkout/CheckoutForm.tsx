"use client";

import { useState, PropsWithChildren } from "react";
import { ErrorMessage } from "../../components/ErrorMessage";

export type CheckoutFormProps = {
  className?: string;
};

export function CheckoutForm(props: PropsWithChildren<CheckoutFormProps>) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        const form = event.currentTarget as HTMLFormElement;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          setError("Erro ao iniciar pagamento");
          setLoading(false);
          return;
        }
        const data = await response.json();
        window.location.href = data.url;
      }}
      className={props.className}
    >
      {error && <ErrorMessage error={error} />}
      {props.children}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-btn-primary py-4 px-4 text-sm font-semibold uppercase text-btn-primary"
      >
        {loading ? "Processando..." : "Finalizar pagamento"}
      </button>
    </form>
  );
}
