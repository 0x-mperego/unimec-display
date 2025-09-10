"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader2, Palette } from "lucide-react";
import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Content } from "@/lib/supabase/client";

const formSchema = z.object({
  text: z
    .string()
    .min(1, "Il testo è obbligatorio")
    .max(500, "Il testo deve essere inferiore a 500 caratteri"),
  duration: z.array(z.number()).length(1),
  preset: z.string().optional(),
  // Advanced options
  fontFamily: z.string().optional(),
  fontSize: z.array(z.number()).length(1).optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  textAlign: z.enum(["left", "center", "right"]).optional(),
});

type TextMessageFormProps = {
  onSuccess: (content: Content) => void;
  onCancel: () => void;
  orderIndex: number;
};

const presets = {
  elegant: {
    name: "Elegante",
    fontFamily: "Georgia, serif",
    fontSize: 48,
    textColor: "#1f2937",
    backgroundColor: "#f9fafb",
    textAlign: "center" as const,
  },
  vibrant: {
    name: "Vibrante",
    fontFamily: "Inter, sans-serif",
    fontSize: 52,
    textColor: "#ffffff",
    backgroundColor: "#3b82f6",
    textAlign: "center" as const,
  },
  minimal: {
    name: "Minimale",
    fontFamily: "Inter, sans-serif",
    fontSize: 40,
    textColor: "#374151",
    backgroundColor: "#ffffff",
    textAlign: "left" as const,
  },
};

const fontFamilies = [
  { label: "Inter (Sans-serif)", value: "Inter, sans-serif" },
  { label: "Georgia (Serif)", value: "Georgia, serif" },
  { label: "Roboto (Sans-serif)", value: "Roboto, sans-serif" },
  { label: "Playfair Display (Serif)", value: "Playfair Display, serif" },
  { label: "Montserrat (Sans-serif)", value: "Montserrat, sans-serif" },
];

const colorOptions = [
  { name: "Bianco", value: "#ffffff" },
  { name: "Nero", value: "#000000" },
  { name: "Grigio", value: "#6b7280" },
  { name: "Blu", value: "#3b82f6" },
  { name: "Rosso", value: "#ef4444" },
  { name: "Verde", value: "#10b981" },
  { name: "Giallo", value: "#f59e0b" },
  { name: "Viola", value: "#8b5cf6" },
];

export function TextMessageForm({
  onSuccess,
  onCancel,
  orderIndex,
}: TextMessageFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("elegant");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      duration: [15], // Default 15 seconds for text
      preset: "elegant",
      fontFamily: presets.elegant.fontFamily,
      fontSize: [presets.elegant.fontSize],
      textColor: presets.elegant.textColor,
      backgroundColor: presets.elegant.backgroundColor,
      textAlign: presets.elegant.textAlign,
    },
  });

  const watchedValues = form.watch();

  function applyPreset(presetKey: string) {
    const preset = presets[presetKey as keyof typeof presets];
    if (!preset) {
      return;
    }

    setSelectedPreset(presetKey);
    form.setValue("preset", presetKey);
    form.setValue("fontFamily", preset.fontFamily);
    form.setValue("fontSize", [preset.fontSize]);
    form.setValue("textColor", preset.textColor);
    form.setValue("backgroundColor", preset.backgroundColor);
    form.setValue("textAlign", preset.textAlign);
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const contentData = {
        text: data.text,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize?.[0],
        textColor: data.textColor,
        backgroundColor: data.backgroundColor,
        textAlign: data.textAlign,
        preset: data.preset,
      };

      const response = await fetch("/api/contents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "text",
          data: contentData,
          duration: data.duration[0],
          orderIndex,
        }),
      });

      if (response.ok) {
        const newContent = await response.json();
        onSuccess(newContent);
      } else {
        const error = await response.json();
        toast.error(error.message || "Creazione messaggio di testo fallita");
      }
    } catch (_error) {
      toast.error("Creazione messaggio di testo fallita");
    } finally {
      setIsSubmitting(false);
    }
  }

  const previewStyle = {
    fontFamily: watchedValues.fontFamily || presets.elegant.fontFamily,
    fontSize: `${Math.min((watchedValues.fontSize?.[0] || presets.elegant.fontSize) / 2, 32)}px`,
    color: watchedValues.textColor || presets.elegant.textColor,
    backgroundColor:
      watchedValues.backgroundColor || presets.elegant.backgroundColor,
    textAlign: (watchedValues.textAlign || presets.elegant.textAlign) as any,
  };

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div>
        <label className="font-medium text-sm">Anteprima</label>
        <Card className="mt-2">
          <CardContent className="p-6">
            <div
              className="flex min-h-[120px] items-center justify-center rounded-lg"
              style={previewStyle}
            >
              <span className="px-4 text-center">
                {watchedValues.text || "Scrivi il tuo messaggio..."}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Text Content */}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Testo del Messaggio</FormLabel>
                <FormControl>
                  <Textarea
                    className="min-h-[80px]"
                    disabled={isSubmitting}
                    placeholder="Inserisci il tuo messaggio..."
                    {...field}
                  />
                </FormControl>
                <div className="text-right text-muted-foreground text-xs">
                  {field.value?.length || 0}/500
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Style Presets */}
          <div className="space-y-3">
            <label className="font-medium text-sm">Preset di Stile</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(presets).map(([key, preset]) => (
                <Button
                  className="flex h-auto flex-col items-center gap-1 p-3"
                  disabled={isSubmitting}
                  key={key}
                  onClick={() => applyPreset(key)}
                  type="button"
                  variant={selectedPreset === key ? "default" : "outline"}
                >
                  <div
                    className="flex h-8 w-full items-center justify-center rounded text-xs"
                    style={{
                      fontSize: "10px",
                      color: preset.textColor,
                      backgroundColor: preset.backgroundColor,
                    }}
                  >
                    Aa
                  </div>
                  <span className="text-xs">{preset.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durata: {field.value[0]} secondi</FormLabel>
                <FormControl>
                  <Slider
                    disabled={isSubmitting}
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

          {/* Advanced Options */}
          <div className="space-y-4">
            <Button
              className="w-full justify-between p-0"
              onClick={() => setShowAdvanced(!showAdvanced)}
              type="button"
              variant="ghost"
            >
              <span className="flex items-center gap-2 font-medium text-sm">
                <Palette className="h-4 w-4" />
                Personalizzazione Avanzata
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showAdvanced && (
              <div className="space-y-4 border-t pt-2">
                {/* Font Family */}
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Famiglia Font</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {fontFamilies.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Font Size */}
                <FormField
                  control={form.control}
                  name="fontSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Dimensione Font: {field.value?.[0] || 48}px
                      </FormLabel>
                      <FormControl>
                        <Slider
                          disabled={isSubmitting}
                          max={120}
                          min={24}
                          onValueChange={field.onChange}
                          step={4}
                          value={field.value || [48]}
                        />
                      </FormControl>
                      <div className="flex justify-between text-muted-foreground text-xs">
                        <span>24px</span>
                        <span>120px</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Text Color */}
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colore del Testo</FormLabel>
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <Button
                            className={`h-12 p-2 ${field.value === color.value ? "ring-2 ring-primary" : ""}`}
                            disabled={isSubmitting}
                            key={color.value}
                            onClick={() => field.onChange(color.value)}
                            type="button"
                            variant="outline"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: color.value }}
                              />
                              <span className="text-xs">{color.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Background Color */}
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colore di Sfondo</FormLabel>
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((color) => (
                          <Button
                            className={`h-12 p-2 ${field.value === color.value ? "ring-2 ring-primary" : ""}`}
                            disabled={isSubmitting}
                            key={color.value}
                            onClick={() => field.onChange(color.value)}
                            type="button"
                            variant="outline"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-4 w-4 rounded border"
                                style={{ backgroundColor: color.value }}
                              />
                              <span className="text-xs">{color.name}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Text Alignment */}
                <FormField
                  control={form.control}
                  name="textAlign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allineamento del Testo</FormLabel>
                      <FormControl>
                        <ToggleGroup
                          disabled={isSubmitting}
                          onValueChange={field.onChange}
                          type="single"
                          value={field.value}
                        >
                          <ToggleGroupItem value="left">
                            Sinistra
                          </ToggleGroupItem>
                          <ToggleGroupItem value="center">
                            Centro
                          </ToggleGroupItem>
                          <ToggleGroupItem value="right">
                            Destra
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              disabled={isSubmitting}
              onClick={onCancel}
              type="button"
              variant="outline"
            >
              Annulla
            </Button>
            <Button className="flex-1" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creazione...
                </>
              ) : (
                "Crea Messaggio"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
