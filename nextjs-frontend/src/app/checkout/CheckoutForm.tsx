"use client";

import { useState, PropsWithChildren } from "react";
import { ErrorMessage } from "../../components/ErrorMessage";
import { fetchJson } from "../../lib/api";

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
        try {
          const data = await fetchJson<{ url: string }>(
            "/api/create-checkout-session",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );
          window.location.href = data.url;
        } catch {
          setError("Erro ao iniciar pagamento");
        } finally {
          setLoading(false);
        }
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
