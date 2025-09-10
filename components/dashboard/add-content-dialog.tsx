"use client";

import { ImageIcon, Type } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Content } from "@/lib/supabase/client";
import { ImageUploadForm } from "./image-upload-form";
import { TextMessageForm } from "./text-message-form";

type AddContentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentAdded: (content: Content) => void;
  nextOrderIndex: number;
};

export function AddContentDialog({
  open,
  onOpenChange,
  onContentAdded,
  nextOrderIndex,
}: AddContentDialogProps) {
  const [activeTab, setActiveTab] = useState<"image" | "text">("image");

  function handleClose() {
    onOpenChange(false);
    // Reset to default tab when closing
    setTimeout(() => setActiveTab("image"), 200);
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuovo Contenuto</DialogTitle>
        </DialogHeader>

        <Tabs
          onValueChange={(value) => setActiveTab(value as "image" | "text")}
          value={activeTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger className="gap-2" value="image">
              <ImageIcon className="h-4 w-4" />
              Immagine
            </TabsTrigger>
            <TabsTrigger className="gap-2" value="text">
              <Type className="h-4 w-4" />
              Messaggio di Testo
            </TabsTrigger>
          </TabsList>

          <TabsContent className="mt-6" value="image">
            <ImageUploadForm
              onCancel={handleClose}
              onSuccess={onContentAdded}
              orderIndex={nextOrderIndex}
            />
          </TabsContent>

          <TabsContent className="mt-6" value="text">
            <TextMessageForm
              onCancel={handleClose}
              onSuccess={onContentAdded}
              orderIndex={nextOrderIndex}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
