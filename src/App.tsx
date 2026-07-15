import * as React from "react";
import { ExpandIcon, InfoIcon, Settings2Icon } from "lucide-react";
import { SiGithub } from "react-icons/si";

import { BadgePreview } from "@/components/badge-preview";
import { FaqDialog } from "@/components/faq-dialog";
import { PhotoField } from "@/components/photo-field";
import { ResetBadgeDialog } from "@/components/reset-badge-dialog";
import { ShareDialog } from "@/components/share-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBadgeState } from "@/hooks/use-badge-state";
import { classOptions, mealDays, type MealDay } from "@/lib/badge-state";

function detectIos() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function detectMobile() {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.matchMedia("(pointer: coarse)").matches
  );
}

type OrientationController = ScreenOrientation & {
  lock?: (orientation: "portrait") => Promise<void>;
  unlock?: () => void;
};

function getOrientationController() {
  return screen.orientation as OrientationController;
}

export function App() {
  const { badge, updateBadge, resetBadge } = useBadgeState();
  const badgeRef = React.useRef<HTMLDivElement>(null);
  const [isFallbackFullscreen, setIsFallbackFullscreen] = React.useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = React.useState(false);
  const isIos = React.useMemo(() => detectIos(), []);
  const isMobile = React.useMemo(() => detectMobile(), []);

  React.useEffect(() => {
    const onFullscreenChange = () => {
      const isFullscreen = Boolean(document.fullscreenElement);
      setIsNativeFullscreen(isFullscreen);
      if (isFullscreen && isMobile) {
        void getOrientationController()
          .lock?.("portrait")
          .catch(() => {
            // The CSS landscape fallback keeps the badge visually in portrait.
          });
      } else if (!isFullscreen) {
        getOrientationController().unlock?.();
        setIsFallbackFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [isMobile]);

  React.useEffect(() => {
    if (!isFallbackFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFallbackFullscreen]);

  const enterFullscreen = async () => {
    if (!badgeRef.current) return;

    if (isIos) {
      setIsFallbackFullscreen(true);
      return;
    }

    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen({
          navigationUI: "hide",
        });
        return;
      } catch {
        // Safari on iPhone does not expose element fullscreen; use the local fallback.
      }
    }
    setIsFallbackFullscreen(true);
  };

  const leaveFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    getOrientationController().unlock?.();
    setIsFallbackFullscreen(false);
  };

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {!isNativeFullscreen && !isFallbackFullscreen && (
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
            <img
              src="/icon.png"
              alt=""
              className="size-8 rounded-lg ring-1 ring-black/10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                École Directe Badge Bypass
              </p>
            </div>
            <FaqDialog />
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href="https://github.com/Fefedu973/Ecole-Directe-Badge-Bypass"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Voir le code source sur GitHub"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "icon",
                    })}
                  />
                }
              >
                <SiGithub />
              </TooltipTrigger>
              <TooltipContent>GitHub</TooltipContent>
            </Tooltip>
            <ShareDialog />
            <ThemeToggle />
          </div>
        </header>
      )}

      <main className="mx-auto grid w-full min-w-0 max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start lg:py-10">
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                <Settings2Icon className="size-4" />
              </div>
              <div>
                <CardTitle>Personnaliser le badge</CardTitle>
                <CardDescription>
                  Les modifications sont enregistrées sur cet appareil.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="first-name">Prénom</FieldLabel>
                  <Input
                    id="first-name"
                    value={badge.firstName}
                    placeholder="Prénom"
                    maxLength={60}
                    autoComplete="off"
                    onChange={(event) =>
                      updateBadge("firstName", event.target.value)
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Nom</FieldLabel>
                  <Input
                    id="last-name"
                    value={badge.lastName}
                    placeholder="Nom"
                    maxLength={60}
                    autoComplete="off"
                    onChange={(event) =>
                      updateBadge("lastName", event.target.value)
                    }
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="class-select">Classe</FieldLabel>
                <Select
                  value={badge.classChoice || null}
                  onValueChange={(value) =>
                    value && updateBadge("classChoice", value)
                  }
                >
                  <SelectTrigger id="class-select" className="w-full">
                    <SelectValue placeholder="Choisir une classe">
                      {(value: string | null) =>
                        value === "custom"
                          ? "Autre classe…"
                          : value || "Choisir une classe"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="custom">Autre classe…</SelectItem>
                      <SelectSeparator />
                      {classOptions.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {badge.classChoice === "custom" && (
                <Field>
                  <FieldLabel htmlFor="custom-class">
                    Classe personnalisée
                  </FieldLabel>
                  <Input
                    id="custom-class"
                    value={badge.customClass}
                    maxLength={60}
                    placeholder="Ex. BTS SIO 1"
                    onChange={(event) =>
                      updateBadge("customClass", event.target.value)
                    }
                  />
                </Field>
              )}

              <Field>
                <FieldLabel>Repas du midi</FieldLabel>
                <ToggleGroup
                  multiple
                  variant="outline"
                  value={badge.mealDays}
                  spacing={1}
                  className="grid min-w-0 w-full grid-cols-5"
                  onValueChange={(value) =>
                    updateBadge("mealDays", value as MealDay[])
                  }
                >
                  {mealDays.map((day) => (
                    <Tooltip key={day.value}>
                      <TooltipTrigger
                        render={
                          <ToggleGroupItem
                            value={day.value}
                            aria-label={day.label}
                            className="min-w-0 w-full px-1"
                          />
                        }
                      >
                        {day.shortLabel}
                      </TooltipTrigger>
                      <TooltipContent>{day.label}</TooltipContent>
                    </Tooltip>
                  ))}
                </ToggleGroup>
                <FieldDescription>
                  Sélectionnez les jours inclus dans la demi-pension.
                </FieldDescription>
              </Field>

              <PhotoField
                photo={badge.photo}
                onChange={(photo) => updateBadge("photo", photo)}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="justify-between">
            <ResetBadgeDialog onReset={resetBadge} />
          </CardFooter>
        </Card>

        <section className="min-w-0 lg:sticky lg:top-24">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">Aperçu</h1>
            </div>
            <Button type="button" onClick={enterFullscreen}>
              <ExpandIcon data-icon="inline-start" />
              Plein écran
            </Button>
          </div>

          <div className="badge-stage grid min-h-[660px] place-items-center rounded-lg border p-3 sm:p-8">
            <BadgePreview
              ref={badgeRef}
              badge={badge}
              isIos={isIos}
              isMobile={isMobile}
              isIosFullscreen={isFallbackFullscreen}
              onClose={leaveFullscreen}
            />
          </div>

          <Alert className="mt-4">
            <InfoIcon />
            <AlertTitle>Aperçu uniquement</AlertTitle>
            <AlertDescription>
              Cet outil ne génère aucun identifiant fonctionnel et ne se
              connecte pas à ÉcoleDirecte.
            </AlertDescription>
          </Alert>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} École Directe Badge Bypass
      </footer>
    </div>
  );
}

export default App;
