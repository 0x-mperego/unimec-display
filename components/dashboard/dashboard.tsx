"use client";

import { ExternalLink, LogOut, Monitor, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Content } from "@/lib/supabase/client";
import { AddContentDialog } from "./add-content-dialog";
import { ContentCard } from "./content-card";
import { EmptyState } from "./empty-state";

const MAX_CONTENT_LIMIT = 50;

export function Dashboard() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayUrl, setDisplayUrl] = useState("");
  const router = useRouter();

  const loadContents = useCallback(async () => {
    try {
      const response = await fetch("/api/contents");
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      } else {
        toast.error("Errore nel caricamento dei contenuti");
      }
    } catch (_error) {
      toast.error("Failed to load contents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load contents on mount
  useEffect(() => {
    loadContents();
  }, [loadContents]);

  // Set display URL on client side only
  useEffect(() => {
    setDisplayUrl(`${window.location.origin}/display`);
  }, []);

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Disconnessione effettuata con successo");
        router.push("/login");
        router.refresh();
      } else {
        toast.error("Errore durante la disconnessione");
      }
    } catch (_error) {
      toast.error("Failed to logout");
    }
  }

  function handleContentAdded(newContent: Content) {
    setContents((prev) =>
      [...prev, newContent].sort((a, b) => a.order_index - b.order_index)
    );
    setIsAddDialogOpen(false);
    // Only show toast if dialog is open (new content), not for duplicates
    if (isAddDialogOpen) {
      toast.success("Contenuto aggiunto con successo");
    } else {
      toast.success("Contenuto duplicato con successo");
    }
  }

  function handleContentUpdated(updatedContent: Content) {
    setContents((prev) =>
      prev
        .map((content) =>
          content.id === updatedContent.id ? updatedContent : content
        )
        .sort((a, b) => a.order_index - b.order_index)
    );
    // Don't show toast here, the specific action will show its own toast
  }

  function handleContentDeleted(deletedId: string) {
    setContents((prev) => prev.filter((content) => content.id !== deletedId));
    toast.success("Contenuto eliminato con successo");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                alt="Unimec"
                className="h-auto"
                height={36}
                src="/logo-unimec.png"
                width={120}
              />
              <div>
                <h1 className="font-semibold text-2xl tracking-tight">
                  Display Manager
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                asChild
                className="hidden sm:flex"
                size="sm"
                variant="outline"
              >
                <a href={displayUrl} rel="noopener noreferrer" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apri Display
                </a>
              </Button>

              <ThemeToggle />
              <Button onClick={handleLogout} size="sm" variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Disconnetti
              </Button>
            </div>
          </div>

          {/* Mobile display button */}
          <div className="mt-4 sm:hidden">
            <Button asChild className="w-full" size="sm" variant="outline">
              <a href={displayUrl} rel="noopener noreferrer" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Apri Display
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-medium text-lg">Libreria Contenuti</h2>
            <p className="text-muted-foreground text-sm">
              {contents.length} di 50 elementi
            </p>
          </div>

          <Button
            className="gap-2"
            disabled={contents.length >= MAX_CONTENT_LIMIT}
            onClick={() => setIsAddDialogOpen(true)}
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Aggiungi Contenuto
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card className="animate-pulse" key={`skeleton-${i}`}>
                <CardHeader>
                  <div className="h-4 w-3/4 rounded bg-muted" />
                </CardHeader>
                <CardContent>
                  <div className="mb-4 h-32 rounded bg-muted" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 rounded bg-muted" />
                    <div className="h-6 w-20 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {contents.length === 0 ? (
              <EmptyState onAddContent={() => setIsAddDialogOpen(true)} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {contents.map((content) => (
                  <ContentCard
                    content={content}
                    key={content.id}
                    onAdd={handleContentAdded}
                    onDelete={handleContentDeleted}
                    onUpdate={handleContentUpdated}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <AddContentDialog
        nextOrderIndex={contents.length}
        onContentAdded={handleContentAdded}
        onOpenChange={setIsAddDialogOpen}
        open={isAddDialogOpen}
      />
    </div>
  );
}
