import * as React from "react";
import { ImagePlusIcon, RotateCcwIcon } from "lucide-react";

import { PhotoCropDialog } from "@/components/photo-crop-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

type PhotoFieldProps = {
  photo: string;
  onChange: (photo: string) => void;
};

const maximumFileSize = 10 * 1024 * 1024;

export function PhotoField({ photo, onChange }: PhotoFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [cropSource, setCropSource] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Sélectionnez un fichier image.");
      return;
    }
    if (file.size > maximumFileSize) {
      setError("L'image doit peser moins de 10 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setError(null);
      setCropSource(reader.result);
    };
    reader.onerror = () => setError("Impossible de lire cette image.");
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Field orientation="horizontal" data-invalid={Boolean(error)}>
        <Avatar className="size-12" size="lg">
          <AvatarImage src={photo} alt="Photo actuelle" />
          <AvatarFallback className="text-[9px] leading-tight">
            École Directe
          </AvatarFallback>
        </Avatar>
        <FieldContent className="min-w-0">
          <FieldLabel htmlFor="badge-photo">Photo</FieldLabel>
          <FieldDescription>
            Recadrable avant utilisation.
          </FieldDescription>
          {error && <FieldError>{error}</FieldError>}
        </FieldContent>
        <div className="flex shrink-0 items-center gap-1">
          <input
            ref={inputRef}
            id="badge-photo"
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Choisir une photo"
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlusIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Rétablir la photo par défaut"
            disabled={photo === "/badge/default-photo.png"}
            onClick={() => onChange("/badge/default-photo.png")}
          >
            <RotateCcwIcon />
          </Button>
        </div>
      </Field>

      <PhotoCropDialog
        key={cropSource ?? "closed"}
        source={cropSource}
        onClose={() => setCropSource(null)}
        onSave={onChange}
      />
    </>
  );
}
