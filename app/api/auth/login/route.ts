import { type NextRequest, NextResponse } from "next/server";
import { createAuthSession, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { message: "Password richiesta" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Password non valida" },
        { status: 401 }
      );
    }

    await createAuthSession();

    return NextResponse.json({ message: "Login effettuato con successo" });
  } catch (_error) {
    return NextResponse.json(
      { message: "Errore interno del server" },
      { status: 500 }
    );
  }
}
