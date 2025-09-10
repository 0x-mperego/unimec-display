import { NextResponse } from "next/server";
import { logout } from "@/lib/auth";

export async function POST() {
  try {
    await logout();
    return NextResponse.json({ message: "Logout effettuato con successo" });
  } catch (_error) {
    return NextResponse.json(
      { message: "Errore interno del server" },
      { status: 500 }
    );
  }
}
