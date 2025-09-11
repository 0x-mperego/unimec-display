"use client";

import {
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Image as ImageIcon,
  MoreHorizontal,
  Trash2,
  Type,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Content } from "@/lib/supabase/client";
import { DurationSlider } from "./duration-slider";

type ContentCardProps = {
  content: Content;
  onUpdate: (content: Content) => void;
  onDelete: (id: string) => void;
  onAdd?: (content: Content) => void;
};

export function ContentCard({ content, onUpdate, onDelete, onAdd }: ContentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDurationSlider, setShowDurationSlider] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isImage = content.type === "image";
  const isText = content.type === "text";

  async function handleDelete() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contents/${content.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(content.id);
      } else {
        toast.error("Errore nell'eliminazione del contenuto");
      }
    } catch (_error) {
      toast.error("Failed to delete content");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  }

  async function handleDuplicate() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: content.type,
          data: content.data,
          duration: content.duration,
        }),
      });

      if (response.ok) {
        const newContent = await response.json();
        if (onAdd) {
          onAdd(newContent);
        } else {
          // Fallback: force page reload
          window.location.reload();
        }
      } else {
        toast.error("Errore nella duplicazione del contenuto");
      }
    } catch (_error) {
      toast.error("Failed to duplicate content");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReorder(direction: "up" | "down") {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contents/${content.id}/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ direction }),
      });

      if (response.ok) {
        const updatedContent = await response.json();
        onUpdate(updatedContent);
        toast.success("Contenuto riordinato");
      } else {
        toast.error("Errore nel riordinamento del contenuto");
      }
    } catch (_error) {
      toast.error("Failed to reorder content");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDurationChange(newDuration: number) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contents/${content.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ duration: newDuration }),
      });

      if (response.ok) {
        const updatedContent = await response.json();
        onUpdate(updatedContent);
        setShowDurationSlider(false);
        toast.success("Durata aggiornata");
      } else {
        toast.error("Errore nell'aggiornamento della durata");
      }
    } catch (_error) {
      toast.error("Failed to update duration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isImage && (
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              )}
              {isText && <Type className="h-4 w-4 text-muted-foreground" />}
              <Badge variant="secondary">{isImage ? "Immagine" : "Testo"}</Badge>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button disabled={isLoading} size="sm" variant="ghost">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplica
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReorder("up")}>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Sposta Su
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReorder("down")}>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Sposta Giù
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          {/* Content Preview */}
          <div className="relative mb-4 aspect-video overflow-hidden rounded-lg bg-muted">
            {isImage && content.data.url ? (
              <Image
                alt="Anteprima contenuto"
                className="object-cover"
                fill
                src={content.data.url}
              />
            ) : isText ? (
              <div
                className="flex h-full w-full items-center justify-center p-4"
                style={{
                  backgroundColor: content.data.backgroundColor || "#ffffff",
                  color: content.data.textColor || "#000000",
                  fontSize: `${Math.min((content.data.fontSize || 24) / 4, 16)}px`,
                  fontFamily: content.data.fontFamily || "inherit",
                  textAlign: content.data.textAlign || "center",
                }}
              >
                <span className="line-clamp-4 text-center">
                  {content.data.text || "Nessun testo"}
                </span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span className="text-sm">Anteprima non disponibile</span>
              </div>
            )}
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between">
            <Button
              className="gap-2"
              onClick={() => setShowDurationSlider(true)}
              size="sm"
              variant="outline"
            >
              <Clock className="h-3 w-3" />
              {content.duration}s
            </Button>

            <div className="text-muted-foreground text-xs">
              #{content.order_index + 1}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duration Slider Dialog */}
      {showDurationSlider && (
        <DurationSlider
          currentDuration={content.duration}
          onDurationChange={handleDurationChange}
          onOpenChange={setShowDurationSlider}
          open={showDurationSlider}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina Contenuto</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo contenuto? Questa azione non può
              essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
              {isLoading ? "Eliminazione..." : "Elimina"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
