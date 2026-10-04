import { createTheme } from "@mantine/core";
const fontFamily =
  '"Geist Variable", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
export const theme = createTheme({
  fontFamily,
  headings: {
    fontFamily,
    fontWeight: "650",
    sizes: {
      h1: { fontSize: "1.75rem", lineHeight: "1.2" },
      h2: { fontSize: "1.2rem", lineHeight: "1.35" },
      h3: { fontSize: "1rem", lineHeight: "1.4" },
    },
  },
  primaryColor: "blue",
  primaryShade: 7,
  defaultRadius: "lg",
  radius: { xs: "6px", sm: "10px", md: "12px", lg: "16px", xl: "24px" },
  respectReducedMotion: true,
  colors: {
    blue: [
      "#edf4ff",
      "#dce9ff",
      "#b7d2ff",
      "#8eb9ff",
      "#6aa4ff",
      "#4b91ff",
      "#2774ed",
      "#1b61d3",
      "#184faa",
      "#174488",
    ],
    dark: [
      "#eef2fa",
      "#bac6db",
      "#91a0bb",
      "#60708c",
      "#334158",
      "#243047",
      "#192235",
      "#111a2b",
      "#0c1422",
      "#080f1b",
    ],
  },
  components: {
    Paper: {
      defaultProps: { radius: "xl", p: "lg", withBorder: true, bg: "dark.7" },
    },
    Button: {
      defaultProps: { size: "md", radius: "lg" },
      styles: { root: { minHeight: 44 }, label: { fontWeight: 600, gap: 8 } },
    },
    ActionIcon: { defaultProps: { size: 44, radius: "lg", variant: "subtle" } },
    TextInput: { defaultProps: { size: "md" } },
    PasswordInput: { defaultProps: { size: "md" } },
    NativeSelect: { defaultProps: { size: "md" } },
    Input: {
      styles: {
        input: {
          minHeight: 44,
          fontSize: 16,
          color: "var(--mantine-color-dark-0)",
          backgroundColor: "var(--mantine-color-dark-8)",
          borderColor: "var(--mantine-color-dark-4)",
        },
      },
    },
    InputWrapper: { styles: { label: { fontWeight: 500, marginBottom: 6 } } },
    Badge: { defaultProps: { variant: "light", radius: "md" } },
    NavLink: {
      defaultProps: { variant: "light" },
      styles: {
        root: { borderRadius: "var(--mantine-radius-lg)", minHeight: 60 },
        label: { fontWeight: 550 },
        description: { color: "var(--mantine-color-dark-1)", marginTop: 4 },
      },
    },
    Modal: {
      styles: {
        content: { backgroundColor: "var(--mantine-color-dark-8)" },
        header: { backgroundColor: "var(--mantine-color-dark-8)" },
        title: { fontWeight: 650 },
        close: { minWidth: 44, minHeight: 44 },
      },
    },
    Drawer: {
      styles: {
        content: {
          borderRadius: "24px 24px 0 0",
          backgroundColor: "var(--mantine-color-dark-8)",
          paddingBottom: "env(safe-area-inset-bottom)",
        },
        header: { backgroundColor: "var(--mantine-color-dark-8)" },
        title: { fontWeight: 650 },
        close: { minWidth: 44, minHeight: 44 },
      },
    },
    SegmentedControl: {
      defaultProps: { size: "sm" },
      styles: {
        label: {
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingInline: 6,
        },
      },
    },
    Table: {
      defaultProps: { verticalSpacing: "sm", horizontalSpacing: "sm" },
      styles: {
        th: { fontWeight: 500, color: "var(--mantine-color-dark-1)" },
        td: { fontVariantNumeric: "tabular-nums" },
        caption: { textAlign: "left", color: "var(--mantine-color-dark-1)" },
      },
    },
    Accordion: {
      defaultProps: { variant: "separated", radius: "lg" },
      styles: {
        item: {
          backgroundColor: "var(--mantine-color-dark-8)",
          borderColor: "var(--mantine-color-dark-5)",
        },
        control: { minHeight: 44 },
      },
    },
    Text: { defaultProps: { c: "dark.0" } },
  },
});
