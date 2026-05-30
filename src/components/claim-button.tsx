'use client';

import confetti, { type Shape } from 'canvas-confetti';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useClaimsContext } from './claims-provider';

type Props = {
  productId: string;
  className?: string;
};

export function ClaimButton({ productId, className }: Props) {
  const { claims, claim, unclaim } = useClaimsContext();
  const isClaimed = Boolean(claims[productId]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!isClaimed) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          claim(productId);
          const defaults = {
            ticks: 250,
            gravity: 0.7,
            scalar: 1.3,
            shapes: ['circle', 'square', 'star'] as Shape[],
            colors: [
              '#f472b6',
              '#22d3ee',
              '#fde047',
              '#86efac',
              '#c084fc',
              '#fb923c',
            ],
            disableForReducedMotion: true,
          };
          confetti({
            ...defaults,
            particleCount: 120,
            spread: 90,
            startVelocity: 50,
            origin: { y: 0.7 },
          });
          // Two side bursts for that party-popper feeling
          confetti({
            ...defaults,
            particleCount: 50,
            angle: 60,
            spread: 60,
            startVelocity: 45,
            origin: { x: 0, y: 0.7 },
          });
          confetti({
            ...defaults,
            particleCount: 50,
            angle: 120,
            spread: 60,
            startVelocity: 45,
            origin: { x: 1, y: 0.7 },
          });
        }}
      >
        ☐ Zamluvit pro Dominika
      </Button>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
      >
        ↩ Uvolnit rezervaci
      </Button>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Opravdu uvolnit?</AlertDialogTitle>
            <AlertDialogDescription>
              Pokud tu věc nekupuješ ty, někdo jiný ji možná už shání.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Zrušit
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation();
                unclaim(productId);
              }}
            >
              Ano, uvolnit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
