import * as React from "react"
import Cropper, { type Area } from "react-easy-crop"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { cropImage } from "@/lib/crop-image"

type PhotoCropDialogProps = {
  source: string | null
  onClose: () => void
  onSave: (photo: string) => void
}

export function PhotoCropDialog({
  source,
  onClose,
  onSave,
}: PhotoCropDialogProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSave = async () => {
    if (!source || !croppedArea) return
    setIsSaving(true)
    setError(null)

    try {
      onSave(await cropImage(source, croppedArea))
      onClose()
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Le recadrage a échoué."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={Boolean(source)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg data-open:zoom-in-100 data-closed:zoom-out-100">
        <DialogHeader>
          <DialogTitle>Recadrer la photo</DialogTitle>
          <DialogDescription>
            Positionnez le visage dans le cercle. L'image reste uniquement dans
            ce navigateur.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-80 overflow-hidden rounded-lg bg-muted">
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

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            disabled={!croppedArea || isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Recadrage…" : "Utiliser cette photo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
