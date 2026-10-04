import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@mantine/core/styles.css";
import "@fontsource-variable/geist";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { AuthProvider, WorkspaceProvider } from "./auth/providers";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} forceColorScheme="dark">
      <AuthProvider>
        <WorkspaceProvider>
          <App />
        </WorkspaceProvider>
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
);
