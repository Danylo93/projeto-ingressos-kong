"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="flex max-w-full items-center justify-between rounded-2xl bg-[#1D232A] px-6 py-2 shadow-nav">
      <div className="flex grow items-center justify-start">
        <Link href="/">
          <Image
            src="/icone.svg"
            alt="Icone DevTicket"
            width={136}
            height={48}
            className="max-h-[48px]"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">Olá, {user.name}</span>
            <button
              onClick={logout}
              className="text-xs underline text-blue-400"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-sm underline">
            Entrar
          </Link>
        )}
        <Link href={"/checkout"} className="min-h-6 min-w-6 grow-0 items-center">
          <Image
            src="/cart-outline.svg"
            alt="Icone de carrinho"
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  );
}
