import * as React from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Field, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cropImage } from "@/lib/crop-image";

type PhotoCropDialogProps = {
  source: string | null;
  onClose: () => void;
  onSave: (photo: string) => void;
};

export function PhotoCropDialog({
  source,
  onClose,
  onSave,
}: PhotoCropDialogProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSave = async () => {
    if (!source || !croppedArea) return;
    setIsSaving(true);
    setError(null);

    try {
      onSave(await cropImage(source, croppedArea));
      onClose();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Le recadrage a échoué.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const editor = (
    <>
      <div className="relative h-[min(42dvh,20rem)] shrink-0 overflow-hidden rounded-lg bg-muted">
        {source && (
          <Cropper
            image={source}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedArea(pixels)}
          />
        )}
      </div>

      <Field>
        <FieldLabel htmlFor="photo-zoom">Zoom</FieldLabel>
        <Slider
          id="photo-zoom"
          min={1}
          max={3}
          step={0.01}
          value={[zoom]}
          onValueChange={(value) =>
            setZoom(Array.isArray(value) ? (value[0] ?? 1) : value)
          }
        />
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </>
  );

  const cancelAction = (
    <Button type="button" variant="outline" onClick={onClose}>
      Annuler
    </Button>
  );

  const saveAction = (
    <Button
      type="button"
      disabled={!croppedArea || isSaving}
      onClick={handleSave}
    >
      {isSaving ? "Recadrage…" : "Utiliser cette photo"}
    </Button>
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  if (isDesktop) {
    return (
      <Dialog open={Boolean(source)} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg data-open:zoom-in-100 data-closed:zoom-out-100">
          <DialogHeader>
            <DialogTitle>Recadrer la photo</DialogTitle>
            <DialogDescription>
              Positionnez le visage dans le cercle. L'image reste uniquement
              dans ce navigateur.
            </DialogDescription>
          </DialogHeader>
          {editor}
          <DialogFooter>
            {cancelAction}
            {saveAction}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={Boolean(source)}
      onOpenChange={handleOpenChange}
      showSwipeHandle
      swipeDirection="down"
    >
      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader>
          <DrawerTitle>Recadrer la photo</DrawerTitle>
          <DrawerDescription>
            Positionnez le visage dans le cercle. L'image reste uniquement dans
            ce navigateur.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
          {editor}
        </div>
        <DrawerFooter>
          {saveAction}
          <DrawerClose render={<Button type="button" variant="outline" />}>
            Annuler
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
