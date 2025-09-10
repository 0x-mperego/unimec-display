import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { isAuthenticated } from "@/lib/auth";

export default async function LoginPage() {
  if (await isAuthenticated()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Theme toggle in top-right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              alt="Unimec"
              className="h-auto"
              height={60}
              priority
              src="/logo-unimec.png"
              width={200}
            />
          </div>
          <h1 className="font-semibold text-2xl tracking-tight">
            Display Manager
          </h1>
          <p className="mt-2 text-muted-foreground text-sm">
            Inserisci la password per accedere al pannello admin
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
