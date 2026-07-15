import * as React from "react";

import {
  getDisplayedClass,
  getMealPlanLabel,
  mealDays,
  type BadgeState,
} from "@/lib/badge-state";

import "@/badge.css";

type BadgePreviewProps = {
  badge: BadgeState;
  isIos?: boolean;
  isMobile?: boolean;
  isIosFullscreen?: boolean;
  onClose?: () => void;
};

function formatFirstName(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "Prénom";
  return `${trimmed.charAt(0).toLocaleUpperCase("fr-FR")}${trimmed.slice(1)}`;
}

function formatDate(date: Date) {
  const datePart = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  return `${datePart} - ${timePart}`;
}

const displayedDays = [
  ...mealDays,
  { value: "saturday", shortLabel: "S", label: "Samedi" },
  { value: "sunday", shortLabel: "D", label: "Dimanche" },
] as const;

export const BadgePreview = React.forwardRef<HTMLDivElement, BadgePreviewProps>(
  function BadgePreview(
    {
      badge,
      isIos = false,
      isMobile = false,
      isIosFullscreen = false,
      onClose,
    },
    ref,
  ) {
    const [now, setNow] = React.useState(() => new Date());
    const lastCloseInteraction = React.useRef(0);

    React.useEffect(() => {
      const interval = window.setInterval(() => setNow(new Date()), 1_000);
      return () => window.clearInterval(interval);
    }, []);

    const requestClose = (event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      const currentTime = Date.now();
      if (currentTime - lastCloseInteraction.current < 500) {
        lastCloseInteraction.current = 0;
        onClose?.();
        return;
      }
      lastCloseInteraction.current = currentTime;
    };

    return (
      <div
        ref={ref}
        className={`student-badge${isMobile ? " student-badge--mobile" : ""}${isIosFullscreen ? " student-badge--ios-fullscreen" : ""}`}
        data-testid="badge-preview"
      >
        <div className="student-badge__header">
          <h1>Badge</h1>
          <img
            className="student-badge__close"
            src="/badge/close.svg"
            alt="Quitter le plein écran"
            role="button"
            tabIndex={0}
            onClick={requestClose}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ")
                requestClose(event);
            }}
          />
        </div>

        <div className="student-badge__identity">
          <img
            className="student-badge__photo"
            src={badge.photo || "/badge/default-photo.png"}
            alt="Photo de profil"
          />
          <div className="student-badge__identity-text">
            <h2>
              {formatFirstName(badge.firstName)}{" "}
              {badge.lastName.trim().toLocaleUpperCase("fr-FR") || "NOM"}
            </h2>
            <h3>{getDisplayedClass(badge)}</h3>
          </div>
        </div>

        <div className="student-badge__barcode">
          <img src="/badge/codebar.svg" alt="Code-barres décoratif" />
        </div>

        <div className="student-badge__plan">
          <h2>Régime : {getMealPlanLabel(badge.mealDays)}</h2>
        </div>

        <div className="student-badge__meals">
          <MealRow
            label="Midi (semaine type)"
            icon={isIos ? "/badge/restaurant-ios.svg" : "/badge/restaurant.svg"}
            selectedDays={badge.mealDays}
          />
          <MealRow
            label="Soir (semaine type)"
            icon={isIos ? "/badge/restaurant-ios.svg" : "/badge/restaurant.svg"}
            selectedDays={[]}
          />
        </div>

        <div className="student-badge__date">
          <p>{formatDate(now)}</p>
        </div>
      </div>
    );
  },
);

function MealRow({
  label,
  icon,
  selectedDays,
}: {
  label: string;
  icon: string;
  selectedDays: BadgeState["mealDays"];
}) {
  return (
    <div className="student-badge__meal-row">
      <img className="student-badge__meal-icon" src={icon} alt="" />
      <div>
        <h2>{label}</h2>
        <div
          className="student-badge__day-list"
          aria-label={`Repas du ${label.toLocaleLowerCase("fr-FR")}`}
        >
          {displayedDays.map((day) => {
            const selected =
              day.value !== "saturday" &&
              day.value !== "sunday" &&
              selectedDays.includes(day.value);
            return (
              <div key={day.value}>
                {day.shortLabel}
                <img
                  className="student-badge__day-state"
                  src={selected ? "/badge/yes.svg" : "/badge/no.svg"}
                  alt={selected ? "Oui" : "Non"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
