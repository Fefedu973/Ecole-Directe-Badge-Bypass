import * as React from "react";
import { CheckIcon, CopyIcon, QrCodeIcon, Share2Icon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

export function ShareDialog() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const pageUrl = window.location.origin;
  const canNativeShare =
    typeof (navigator as Navigator & { share?: Navigator["share"] }).share ===
    "function";

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_500);
  };

  const share = async () => {
    if (!canNativeShare) return;
    await navigator.share({
      title: "École Directe Badge Bypass",
      text: "Créez un aperçu de badge directement dans votre navigateur.",
      url: pageUrl,
    });
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <QrCodeIcon data-icon="inline-start" />
        <span className="hidden sm:inline">Partager</span>
        <span className="sr-only sm:hidden">Partager</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partager l'outil</DialogTitle>
            <DialogDescription>
              Scannez le QR code ou partagez le lien. Les informations du badge
              ne sont jamais incluses.
            </DialogDescription>
          </DialogHeader>

          <div className="mx-auto rounded-lg border bg-white p-4 shadow-xs">
            <QRCodeSVG
              value={pageUrl}
              size={208}
              level="M"
              marginSize={0}
              title="QR code vers École Directe Badge Bypass"
            />
          </div>

          <InputGroup>
            <InputGroupInput
              value={pageUrl}
              readOnly
              aria-label="Lien de partage"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label={copied ? "Lien copié" : "Copier le lien"}
                onClick={copyLink}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {canNativeShare && (
            <DialogFooter>
              <Button type="button" onClick={share}>
                <Share2Icon data-icon="inline-start" />
                Partager avec…
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
