import { Monitor, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  onAddContent: () => void;
};

export function EmptyState({ onAddContent }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Monitor className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="mb-2 font-medium text-lg">Nessun contenuto presente</h3>
        <p className="mb-6 max-w-sm text-muted-foreground text-sm">
          Inizia aggiungendo il tuo primo contenuto. Puoi caricare immagini o
          creare messaggi di testo da visualizzare sui tuoi monitor.
        </p>

        <Button className="gap-2" onClick={onAddContent} size="lg">
          <Plus className="h-4 w-4" />
          Aggiungi il Primo Contenuto
        </Button>
      </CardContent>
    </Card>
  );
}
