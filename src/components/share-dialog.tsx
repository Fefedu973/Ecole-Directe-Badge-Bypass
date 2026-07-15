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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useMediaQuery } from "@/hooks/use-media-query";

export function ShareDialog() {
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  const trigger = (
    <Button type="button" variant="outline" onClick={() => setOpen(true)}>
      <QrCodeIcon data-icon="inline-start" />
      <span className="hidden sm:inline">Partager</span>
      <span className="sr-only sm:hidden">Partager</span>
    </Button>
  );

  const content = (
    <>
      <div className="mx-auto rounded-lg border bg-white p-4 shadow-xs">
        <QRCodeSVG
          value={pageUrl}
          size={208}
          level="M"
          marginSize={0}
          className="h-auto max-w-full"
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
    </>
  );

  if (isDesktop) {
    return (
      <>
        {trigger}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Partager l'outil</DialogTitle>
              <DialogDescription>
                Scannez le QR code ou partagez le lien. Les informations du
                badge ne sont jamais incluses.
              </DialogDescription>
            </DialogHeader>
            {content}
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

  return (
    <>
      {trigger}
      <Drawer
        open={open}
        onOpenChange={setOpen}
        showSwipeHandle
        swipeDirection="down"
      >
        <DrawerContent className="max-h-[90dvh]">
          <DrawerHeader>
            <DrawerTitle>Partager l'outil</DrawerTitle>
            <DrawerDescription>
              Scannez le QR code ou partagez le lien. Les informations du badge
              ne sont jamais incluses.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
            {content}
          </div>
          <DrawerFooter>
            {canNativeShare && (
              <Button type="button" onClick={share}>
                <Share2Icon data-icon="inline-start" />
                Partager avec…
              </Button>
            )}
            <DrawerClose render={<Button type="button" variant="outline" />}>
              Fermer
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
