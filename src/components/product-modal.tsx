'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Product } from '@/types/product';

type Props = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: Props) {
  const open = product !== null;
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product?.name ?? ''}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{product?.description}</p>
      </DialogContent>
    </Dialog>
  );
}
