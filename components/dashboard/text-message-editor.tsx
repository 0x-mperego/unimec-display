"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import type { Content } from "@/lib/supabase/client";

// Preset esatti da CONTENT-FLOW.md
const PRESETS = {
  announcement: {
    name: "Annuncio",
    font: "Bebas Neue",
    size: 64,
    textColor: "#FFFFFF",
    bgColor: "#DC2626",
  },
  welcome: {
    name: "Benvenuto",
    font: "Poppins",
    size: 48,
    textColor: "#000000",
    bgColor: "#FEF3C7",
  },
  elegant: {
    name: "Elegante",
    font: "Playfair Display",
    size: 48,
    textColor: "#000000",
    bgColor: "#FFFFFF",
  },
  modern: {
    name: "Moderno",
    font: "Inter",
    size: 48,
    textColor: "#FFFFFF",
    bgColor: "#1E293B",
  },
} as const;

const FONTS = ["Inter", "Roboto", "Open Sans", "Poppins", "Playfair Display", "Bebas Neue"];
const SIZES = [
  { value: 36, label: "S" },
  { value: 48, label: "M" },
  { value: 64, label: "L" },
  { value: 80, label: "XL" },
];

const getSizeIndex = (value: number): number => {
  if (value === 36) return 0;
  if (value === 48) return 1;
  if (value === 64) return 2;
  return 3; // 80
};

const getSizeFromIndex = (index: number): number => {
  return SIZES[index].value;
};
const TEXT_COLORS = ["#FFFFFF", "#000000", "#3B82F6", "#EAB308"];
const BG_COLORS = ["#FFFFFF", "#000000", "#DC2626", "#FEF3C7", "#1E293B", "#10B981", "#F97316", "#8B5CF6"];

type TextEditorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContentAdded: (content: Content) => void;
  nextOrderIndex: number;
  editingContent?: Content | null;
};

export function TextMessageEditor({
  open,
  onOpenChange,
  onContentAdded,
  nextOrderIndex,
  editingContent,
}: TextEditorProps) {
  const [text, setText] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESETS | null>(null);
  const [font, setFont] = useState("Inter");
  const [size, setSize] = useState(48);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#000000");
  const [position, setPosition] = useState("middle-center");
  const [duration, setDuration] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load Google Fonts when dialog opens
  useEffect(() => {
    if (open && !fontsLoaded) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;600;700&family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;700&family=Bebas+Neue&display=swap';
      link.rel = 'stylesheet';
      link.onload = () => setFontsLoaded(true);
      document.head.appendChild(link);
    }
  }, [open, fontsLoaded]);

  const isEditing = !!editingContent;

  // Responsive behavior
  const [windowWidth, setWindowWidth] = useState(0);
  const isMobile = windowWidth > 0 && windowWidth < 1024;

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Initialize editing content
  React.useEffect(() => {
    if (editingContent && editingContent.type === "text" && open) {
      const data = editingContent.data;
      setText(data.text || "");
      setFont(data.fontFamily || "Inter");
      setSize(data.fontSize || 48);
      setTextColor(data.textColor || "#FFFFFF");
      setBgColor(data.backgroundColor || "#000000");
      setPosition(data.position || "middle-center");
      setDuration(editingContent.duration || 15);
      setSelectedPreset(null);
    } else if (open && !isEditing) {
      // Reset for new content
      setText("");
      setFont("Inter");
      setSize(48);
      setTextColor("#FFFFFF");
      setBgColor("#000000");
      setPosition("middle-center");
      setDuration(15);
      setSelectedPreset(null);
    }
  }, [editingContent, open, isEditing]);

  const getCurrentStyle = () => ({
    fontFamily: font,
    fontSize: size,
    textColor,
    backgroundColor: bgColor,
  });

  const applyPreset = (presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    setSelectedPreset(presetKey);
    setFont(preset.font);
    setSize(preset.size);
    setTextColor(preset.textColor);
    setBgColor(preset.bgColor);
  };

  const customizeStyle = () => {
    setSelectedPreset(null);
  };

  const renderPositionGrid = () => {
    const positions = [
      ["top-left", "top-center", "top-right"],
      ["middle-left", "middle-center", "middle-right"],
      ["bottom-left", "bottom-center", "bottom-right"],
    ];

    return (
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-1 w-28">
          {positions.flat().map((pos) => (
            <Button
              key={pos}
              type="button"
              variant={position === pos ? "default" : "outline"}
              size="sm"
              className="aspect-square p-0 h-8 w-8"
              onClick={() => setPosition(pos)}
            >
              <div className="w-2 h-2 bg-current rounded-full" />
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const renderColorButton = (color: string, isSelected: boolean, onClick: () => void) => (
    <Button
      key={color}
      type="button"
      variant="outline"
      size="sm"
      className={`aspect-square p-0 h-8 w-8 rounded-md border-2 transition-all hover:scale-105 ${
        isSelected ? "border-primary ring-2 ring-primary/20 shadow-md" : "border-muted-foreground/20 hover:border-muted-foreground/40"
      }`}
      style={{ backgroundColor: color }}
      onClick={onClick}
    >
      {isSelected && (
        <div className={`w-2 h-2 rounded-full ${color === '#FFFFFF' || color === '#FEF3C7' ? 'bg-black' : 'bg-white'}`} />
      )}
    </Button>
  );

  const handleSave = async () => {
    if (!text.trim()) {
      toast.error("Inserisci un messaggio");
      return;
    }

    if (text.length > 100) {
      toast.error("Il messaggio non può superare i 100 caratteri");
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        type: "text",
        data: {
          text,
          fontFamily: font,
          fontSize: size,
          textColor,
          backgroundColor: bgColor,
          position,
          textAlign: "center",
          fontWeight: "normal",
          italic: false,
        },
        duration,
        ...(isEditing ? {} : { orderIndex: nextOrderIndex }),
      };

      const response = await fetch(
        isEditing ? `/api/contents/${editingContent.id}` : "/api/contents",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("Errore nel salvataggio");

      const newContent = await response.json();
      toast.success(isEditing ? "Messaggio aggiornato!" : "Messaggio creato!");
      onContentAdded(newContent);
      onOpenChange(false);
    } catch (error) {
      toast.error(isEditing ? "Errore aggiornamento" : "Errore creazione");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Desktop Layout (CONTENT-FLOW.md spec)
  const DesktopContent = () => {
    const style = getCurrentStyle();

    return (
      <div className="flex gap-6 min-h-[600px]">
        {/* COLONNA SINISTRA - 400px FISSA */}
        <div className="w-[400px] flex-shrink-0 space-y-4">
          {/* PREVIEW LIVE - 16:9 aspect ratio */}
          <Card className="overflow-hidden p-0">
            <div className="aspect-video w-full">
              <div
                className="w-full h-full relative"
                style={{
                  backgroundColor: style.backgroundColor,
                }}
              >
                <div
                  className={`absolute text-center break-words leading-tight ${
                    position.includes('top') ? 'top-4' : 
                    position.includes('bottom') ? 'bottom-4' : 'top-1/2 -translate-y-1/2'
                  } ${
                    position.includes('left') ? 'left-4 text-left' : 
                    position.includes('right') ? 'right-4 text-right' : 'left-1/2 -translate-x-1/2'
                  }`}
                  style={{
                    color: style.textColor,
                    fontFamily: fontsLoaded ? style.fontFamily : 'sans-serif',
                    fontSize: `${Math.min(style.fontSize / 4, 18)}px`,
                    fontWeight: style.fontFamily === 'Bebas Neue' ? 'normal' : 'bold',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    maxWidth: position.includes('center') ? '80%' : '60%',
                  }}
                >
                  {text || "Il tuo messaggio..."}
                </div>
              </div>
            </div>
          </Card>

          {/* CONTROLLI POSIZIONE E DURATA SOTTO PREVIEW */}
          <Card className="p-4 space-y-6">
            {/* Posizione Testo */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Posizione Testo</Label>
              {renderPositionGrid()}
            </div>

            {/* Durata con marks visibili */}
            <div>
              <Label className="text-sm font-medium">Durata: {duration} secondi</Label>
              <Slider
                defaultValue={[duration]}
                onValueChange={(value) => setDuration(value[0])}
                min={5}
                max={60}
                step={5}
                className="w-full"
              />
              <div className="mt-2 -mx-1.5 flex items-center justify-between text-muted-foreground text-xs">
                <span>5s</span>
                <span>15s</span>
                <span>30s</span>
                <span>45s</span>
                <span>60s</span>
              </div>
            </div>
          </Card>
        </div>

        {/* COLONNA DESTRA - TUTTE LE PERSONALIZZAZIONI SEMPRE VISIBILI */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* CARD CONTENUTO */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Contenuto</h3>

            {/* Input messaggio */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium mb-2 block">Messaggio</Label>
                <Input
                  placeholder="Scrivi una frase breve..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  maxLength={100}
                  className="text-base"
                />
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {text.length}/100 caratteri
                </div>
              </div>
            </div>

            {/* Stile Rapido - single row */}
            <div className="mt-6">
              <Label className="text-sm font-medium mb-3 block">Stile Rapido</Label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(PRESETS).map(([key, preset]) => (
                  <Card
                    key={key}
                    className={`h-12 cursor-pointer overflow-hidden transition-all hover:shadow-lg border-2 ${
                      selectedPreset === key ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground/20"
                    }`}
                    onClick={() => applyPreset(key as keyof typeof PRESETS)}
                  >
                    <div
                      className="w-full h-full flex items-center justify-center text-xs font-medium transition-all"
                      style={{
                        backgroundColor: preset.bgColor,
                        color: preset.textColor,
                        fontFamily: fontsLoaded ? preset.font : 'sans-serif',
                        fontWeight: preset.font === 'Bebas Neue' ? 'normal' : '500',
                      }}
                    >
                      {preset.name}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* CARD PERSONALIZZA STILE */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Personalizza Stile</h3>

            <div className="space-y-6">
              {/* Font e Dimensione */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Font</Label>
                  <Select
                    value={font}
                    onValueChange={(value) => {
                      setFont(value);
                      customizeStyle();
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONTS.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Dimensione: {SIZES[getSizeIndex(size)].label}</Label>
                  <Slider
                    defaultValue={[getSizeIndex(size)]}
                    onValueChange={(value) => {
                      setSize(getSizeFromIndex(value[0]));
                      customizeStyle();
                    }}
                    min={0}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="mt-2 -mx-1.5 flex items-center justify-between text-muted-foreground text-xs">
                    <span>S</span>
                    <span>M</span>
                    <span>L</span>
                    <span>XL</span>
                  </div>
                </div>
              </div>

              {/* Colori */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium mb-3 block">Colore Testo</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {TEXT_COLORS.map((color) =>
                      renderColorButton(color, textColor === color, () => {
                        setTextColor(color);
                        customizeStyle();
                      })
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">Colore Sfondo</Label>
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-2">
                      {BG_COLORS.slice(0, 4).map((color) =>
                        renderColorButton(color, bgColor === color, () => {
                          setBgColor(color);
                          customizeStyle();
                        })
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {BG_COLORS.slice(4).map((color) =>
                        renderColorButton(color, bgColor === color, () => {
                          setBgColor(color);
                          customizeStyle();
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  // Mobile Layout
  const MobileContent = () => {
    const style = getCurrentStyle();

    return (
      <div className="space-y-6">
        {/* Preview small */}
        <div>
          <Label className="text-sm font-medium">Anteprima</Label>
          <Card className="aspect-video mt-2 overflow-hidden">
            <div
              className="w-full h-full flex items-center justify-center p-4"
              style={{
                backgroundColor: style.backgroundColor,
                color: style.textColor,
                fontFamily: style.fontFamily,
                fontSize: "14px",
              }}
            >
              <span className="text-center break-words">
                {text || "Il tuo messaggio..."}
              </span>
            </div>
          </Card>
        </div>

        {/* Messaggio */}
        <div>
          <Label className="text-sm font-medium">Messaggio</Label>
          <Input
            placeholder="Scrivi una frase breve..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-2"
            maxLength={100}
          />
          <div className="text-right text-xs text-muted-foreground mt-1">
            {text.length}/100 caratteri
          </div>
        </div>

        {/* Preset */}
        <div>
          <Label className="text-sm font-medium">Preset</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <Card
                key={key}
                className={`h-12 cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                  selectedPreset === key ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => applyPreset(key as keyof typeof PRESETS)}
              >
                <div
                  className="w-full h-full flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: preset.bgColor,
                    color: preset.textColor,
                    fontFamily: preset.font,
                  }}
                >
                  {preset.name}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Posizione */}
        <div>
          <Label className="text-sm font-medium">Posizione</Label>
          <div className="mt-2">{renderPositionGrid()}</div>
        </div>

        {/* Durata */}
        <div>
          <Label className="text-sm font-medium">Durata: {duration}s</Label>
          <Slider
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            min={5}
            max={60}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Personalizza (Collapsible SOLO mobile) */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              Personalizza
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div>
              <Label className="text-sm">Font</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm">Dimensione</Label>
              <ToggleGroup
                type="single"
                value={size.toString()}
                onValueChange={(value) => value && setSize(parseInt(value))}
                className="grid grid-cols-4 gap-1 mt-1"
              >
                {SIZES.map((s) => (
                  <ToggleGroupItem key={s.value} value={s.value.toString()}>
                    {s.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm">Colore Testo</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {TEXT_COLORS.map((color) =>
                    renderColorButton(color, textColor === color, () => setTextColor(color))
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm">Colore Sfondo</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {BG_COLORS.slice(0, 4).map((color) =>
                    renderColorButton(color, bgColor === color, () => setBgColor(color))
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {BG_COLORS.slice(4).map((color) =>
                    renderColorButton(color, bgColor === color, () => setBgColor(color))
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="rounded-t-lg max-h-[95vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{isEditing ? "Modifica Messaggio" : "Nuovo Messaggio"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <MobileContent />
            </div>
            <div className="flex gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Annulla
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? isEditing ? "Aggiornamento..." : "Creazione..."
                  : isEditing ? "Aggiorna" : "Aggiungi"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent 
            className="max-h-[90vh] overflow-hidden"
            style={{ width: '1200px', maxWidth: '90vw' }}
          >
            <DialogHeader>
              <DialogTitle>{isEditing ? "Modifica Messaggio" : "Nuovo Messaggio"}</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <DesktopContent />
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing ? "Aggiornamento..." : "Creazione..."
                  : isEditing ? "Aggiorna" : "Aggiungi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}