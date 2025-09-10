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
};

export function ContentCard({ content, onUpdate, onDelete }: ContentCardProps) {
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
        toast.error("Failed to delete content");
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
        onUpdate(newContent); // This will trigger a reload
        toast.success("Content duplicated");
      } else {
        toast.error("Failed to duplicate content");
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
        toast.success("Content reordered");
      } else {
        toast.error("Failed to reorder content");
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
        toast.success("Duration updated");
      } else {
        toast.error("Failed to update duration");
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
              <Badge variant="secondary">{isImage ? "Image" : "Text"}</Badge>
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
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReorder("up")}>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Move Up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleReorder("down")}>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Move Down
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
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
                alt="Content preview"
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
                  {content.data.text || "No text"}
                </span>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <span className="text-sm">No preview available</span>
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
            <AlertDialogTitle>Delete Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={handleDelete}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
