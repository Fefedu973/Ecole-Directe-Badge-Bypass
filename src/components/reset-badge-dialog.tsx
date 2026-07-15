import * as React from "react";
import { RotateCcwIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

type ResetBadgeDialogProps = {
  onReset: () => void;
};

export function ResetBadgeDialog({ onReset }: ResetBadgeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleReset = () => {
    onReset();
    setOpen(false);
  };

  const trigger = (
    <Button type="button" variant="ghost">
      <RotateCcwIcon data-icon="inline-start" />
      Réinitialiser
    </Button>
  );

  if (isDesktop) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger render={trigger} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <RotateCcwIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>Réinitialiser le badge ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les informations et la photo enregistrées sur cet appareil seront
              remplacées par les valeurs par défaut.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleReset}>
              Réinitialiser
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerTrigger render={trigger} />
      <DrawerContent>
        <DrawerHeader>
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-md bg-muted">
            <RotateCcwIcon className="size-6" />
          </div>
          <DrawerTitle>Réinitialiser le badge ?</DrawerTitle>
          <DrawerDescription>
            Les informations et la photo enregistrées sur cet appareil seront
            remplacées par les valeurs par défaut.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-4">
          <Button type="button" variant="destructive" onClick={handleReset}>
            Réinitialiser
          </Button>
          <DrawerClose render={<Button type="button" variant="outline" />}>
            Annuler
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
