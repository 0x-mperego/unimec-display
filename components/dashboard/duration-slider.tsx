"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type DurationSliderProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDuration: number;
  onDurationChange: (duration: number) => void;
};

export function DurationSlider({
  open,
  onOpenChange,
  currentDuration,
  onDurationChange,
}: DurationSliderProps) {
  const [duration, setDuration] = useState([currentDuration]);

  function handleSave() {
    onDurationChange(duration[0]);
  }

  function handleCancel() {
    setDuration([currentDuration]);
    onOpenChange(false);
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Imposta Durata</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Durata: {duration[0]} secondi</Label>
            <Slider
              className="w-full"
              max={60}
              min={5}
              onValueChange={setDuration}
              step={1}
              value={duration}
            />
            <div className="flex justify-between text-muted-foreground text-xs">
              <span>5s</span>
              <span>60s</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleCancel} variant="outline">
            Annulla
          </Button>
          <Button onClick={handleSave}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
