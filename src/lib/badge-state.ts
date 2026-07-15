import { z } from "zod";

export const mealDayValues = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export type MealDay = (typeof mealDayValues)[number];

export const mealDays: ReadonlyArray<{
  value: MealDay;
  shortLabel: string;
  label: string;
}> = [
  { value: "monday", shortLabel: "L", label: "Lundi" },
  { value: "tuesday", shortLabel: "M", label: "Mardi" },
  { value: "wednesday", shortLabel: "M", label: "Mercredi" },
  { value: "thursday", shortLabel: "J", label: "Jeudi" },
  { value: "friday", shortLabel: "V", label: "Vendredi" },
];

export const classOptions = [
  ...["Sixième", "Cinquième", "Quatrième", "Troisième"].flatMap((level) =>
    Array.from({ length: 5 }, (_, index) => `${level} ${index + 1}`),
  ),
  ...Array.from({ length: 8 }, (_, index) => `Seconde ${index + 1}`),
  ...Array.from({ length: 9 }, (_, index) => `Première G${index + 1}`),
  "Première STI2D",
  ...Array.from({ length: 9 }, (_, index) => `Terminale G${index + 1}`),
  "Terminale STI2D",
] as const;

const badgeStateSchema = z.object({
  firstName: z.string().max(60),
  lastName: z.string().max(60),
  classChoice: z.string().max(60),
  customClass: z.string().max(60),
  mealDays: z.array(z.enum(mealDayValues)).max(mealDayValues.length),
  photo: z.string().max(6_000_000),
});

export type BadgeState = z.infer<typeof badgeStateSchema>;

export const defaultBadgeState: BadgeState = {
  firstName: "",
  lastName: "",
  classChoice: "",
  customClass: "",
  mealDays: [],
  photo: "/badge/default-photo.png",
};

export const badgeStorageKey = "edbb.badge.v2";

const legacyKeys = [
  "prenom",
  "nom",
  "classe",
  "customclasse",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "photo",
] as const;

function legacyBoolean(value: string | null) {
  return value === "true" || value === "1" || value === "on";
}

function readLegacyState(): BadgeState | null {
  const hasLegacyState = legacyKeys.some((key) => localStorage.getItem(key));
  if (!hasLegacyState) return null;

  const selectedDays = mealDays
    .filter((day) => {
      const legacyKeyByDay: Record<MealDay, string> = {
        monday: "lundi",
        tuesday: "mardi",
        wednesday: "mercredi",
        thursday: "jeudi",
        friday: "vendredi",
      };
      return legacyBoolean(localStorage.getItem(legacyKeyByDay[day.value]));
    })
    .map((day) => day.value);

  const legacyClass = localStorage.getItem("classe") ?? "";
  const legacyCustomClass = localStorage.getItem("customclasse") ?? "";
  const classIsKnown = classOptions.includes(
    legacyClass as (typeof classOptions)[number],
  );

  const hasLegacyClass = Boolean(legacyClass || legacyCustomClass);

  return {
    firstName: localStorage.getItem("prenom") || defaultBadgeState.firstName,
    lastName: localStorage.getItem("nom") || defaultBadgeState.lastName,
    classChoice: !hasLegacyClass ? "" : classIsKnown ? legacyClass : "custom",
    customClass: classIsKnown
      ? legacyCustomClass
      : legacyCustomClass || legacyClass,
    mealDays: selectedDays,
    photo: localStorage.getItem("photo") || defaultBadgeState.photo,
  };
}

export function loadBadgeState(): BadgeState {
  try {
    const savedState = localStorage.getItem(badgeStorageKey);
    if (savedState) {
      const result = badgeStateSchema.safeParse(JSON.parse(savedState));
      if (result.success) {
        return result.data.classChoice === "Classe"
          ? { ...result.data, classChoice: "" }
          : result.data;
      }
    }

    const legacyState = readLegacyState();
    if (legacyState) {
      localStorage.setItem(badgeStorageKey, JSON.stringify(legacyState));
      return legacyState;
    }
  } catch {
    // A disabled or full localStorage should not prevent the editor from loading.
  }

  return defaultBadgeState;
}

export function saveBadgeState(state: BadgeState) {
  try {
    localStorage.setItem(badgeStorageKey, JSON.stringify(state));
  } catch {
    // The current edit remains usable even when persistence is unavailable.
  }
}

export function getDisplayedClass(state: BadgeState) {
  if (!state.classChoice) return "Classe";
  if (state.classChoice === "custom") {
    return state.customClass.trim() || "Classe";
  }
  return state.classChoice;
}

export function getMealPlanLabel(selectedDays: readonly MealDay[]) {
  if (selectedDays.length === 0) return "EXTERNE LIBRE";
  return `DEMI PENSIONNAIRE ${selectedDays.length} JOURS`;
}
