'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOwner } from './owner-provider';

export function OwnerPopup() {
  const { hasDecided, setIsOwner } = useOwner();

  // Hidden until we've read localStorage — avoids flash for returning visitors.
  if (hasDecided) return null;

  return (
    <Dialog open>
      <DialogContent
        showCloseButton={false}
        className="max-w-md"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Jsi Dominik? 🤔</DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2">
            Pokud ano, schováme ti aktuální stav rezervací, ať tě dárky
            překvapí. Rodina mezitím normálně uvidí, co už si někdo zarezervoval.
            <br />
            <br />
            <span className="text-xs text-muted-foreground">
              Rozhodnutí si můžeš kdykoliv změnit v patičce stránky.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-2">
          <Button variant="outline" onClick={() => setIsOwner(false)}>
            Ne, nejsem Dominik
          </Button>
          <Button onClick={() => setIsOwner(true)}>
            Ano, jsem Dominik 🙈
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
