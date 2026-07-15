import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import { enableGoogleAnalytics } from "@/lib/google-analytics";

enableGoogleAnalytics();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="edbb.theme">
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
