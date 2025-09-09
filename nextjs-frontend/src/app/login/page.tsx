"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Title } from "../../components/Title";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  return (
    <main className="mt-10 flex justify-center">
      <form
        className="w-full max-w-md rounded-2xl bg-secondary p-6 flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const email = (form.elements.namedItem("email") as HTMLInputElement).value;
          const password = (form.elements.namedItem("password") as HTMLInputElement).value;
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find(
            (u: any) => u.email === email && u.password === password
          );
          if (!user) {
            setError("Credenciais inválidas");
            return;
          }
          document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/`;
          router.push("/");
        }}
      >
        <Title>Login</Title>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input type="email" name="email" placeholder="E-mail" className="p-2 rounded bg-input" required />
        <input type="password" name="password" placeholder="Senha" className="p-2 rounded bg-input" required />
        <button type="submit" className="rounded-lg bg-btn-primary py-2 text-sm font-semibold text-btn-primary uppercase">Entrar</button>
        <p className="text-center text-sm">
          Não possui conta? <Link href="/register" className="underline">Cadastre-se</Link>
        </p>
      </form>
    </main>
  );
}
