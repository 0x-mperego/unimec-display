"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import type { Content } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const formSchema = z.object({
  duration: z.array(z.number()).length(1),
});

type ImageUploadFormProps = {
  onSuccess: (content: Content) => void;
  onCancel: () => void;
  orderIndex: number;
};

export function ImageUploadForm({
  onSuccess,
  onCancel,
  orderIndex,
}: ImageUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: [10], // Default 10 seconds
    },
  });

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Seleziona un'immagine JPG o PNG");
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("La dimensione del file deve essere inferiore a 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      toast.error("Seleziona un'immagine");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("duration", data.duration[0].toString());
      formData.append("orderIndex", orderIndex.toString());

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch("/api/contents/upload-image", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const newContent = await response.json();
        onSuccess(newContent);
      } else {
        const error = await response.json();
        toast.error(error.message || "Caricamento immagine fallito");
      }
    } catch (_error) {
      toast.error("Caricamento immagine fallito");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div>
        <Label className="font-medium text-sm" htmlFor="file-upload">
          Seleziona Immagine
        </Label>
        <div className="mt-2">
          {selectedFile ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted">
                    {previewUrl && (
                      <Image
                        alt="Anteprima"
                        className="object-cover"
                        fill
                        src={previewUrl}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm">
                      {selectedFile.name}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    disabled={isUploading}
                    onClick={clearSelection}
                    size="sm"
                    type="button"
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div
              className="cursor-pointer rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 text-center transition-colors hover:border-muted-foreground/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="mb-1 text-muted-foreground text-sm">
                Clicca per caricare o trascina e rilascia
              </p>
              <p className="text-muted-foreground text-xs">
                JPG, PNG fino a 10MB
              </p>
            </div>
          )}

          <input
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            disabled={isUploading}
            onChange={handleFileSelect}
            ref={fileInputRef}
            type="file"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Caricamento...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Duration Slider */}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durata: {field.value[0]} secondi</FormLabel>
                <FormControl>
                  <Slider
                    disabled={isUploading}
                    max={60}
                    min={5}
                    onValueChange={field.onChange}
                    step={1}
                    value={field.value}
                  />
                </FormControl>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>5s</span>
                  <span>60s</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              disabled={isUploading}
              onClick={onCancel}
              type="button"
              variant="outline"
            >
              Annulla
            </Button>
            <Button
              className="flex-1"
              disabled={!selectedFile || isUploading}
              type="submit"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Caricamento...
                </>
              ) : (
                "Aggiungi Immagine"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
