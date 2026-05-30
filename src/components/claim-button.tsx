'use client';

import confetti from 'canvas-confetti';
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
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
            disableForReducedMotion: true,
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
