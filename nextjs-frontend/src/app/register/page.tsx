"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Title } from "../../components/Title";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <main className="mt-10 flex justify-center">
      <form
        className="w-full max-w-md rounded-2xl bg-secondary p-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            church: (form.elements.namedItem("church") as HTMLInputElement).value,
            pastor: (form.elements.namedItem("pastor") as HTMLInputElement).value,
            whatsapp: (form.elements.namedItem("whatsapp") as HTMLInputElement).value,
            password: (form.elements.namedItem("password") as HTMLInputElement).value,
          };
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          if (users.find((u: any) => u.email === data.email)) {
            setError("E-mail já cadastrado");
            return;
          }
          users.push(data);
          localStorage.setItem("users", JSON.stringify(users));
          document.cookie = `user=${encodeURIComponent(JSON.stringify(data))}; path=/`;
          router.push("/");
        }}
      >
        <Title>Cadastro</Title>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input name="name" placeholder="Nome" className="p-2 rounded bg-input" required />
        <input type="email" name="email" placeholder="E-mail" className="p-2 rounded bg-input" required />
        <input name="church" placeholder="Igreja" className="p-2 rounded bg-input" required />
        <input name="pastor" placeholder="Pastor" className="p-2 rounded bg-input" required />
        <input name="whatsapp" placeholder="WhatsApp" className="p-2 rounded bg-input" required />
        <input type="password" name="password" placeholder="Senha" className="p-2 rounded bg-input" required />
        <button type="submit" className="rounded-lg bg-btn-primary py-2 text-sm font-semibold text-btn-primary uppercase">Cadastrar</button>
        <p className="text-center text-sm">
          Já possui conta? <Link href="/login" className="underline">Entrar</Link>
        </p>
      </form>
    </main>
  );
}
