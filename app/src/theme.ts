import { createTheme } from "@mantine/core";
export const theme = createTheme({
  fontFamily: '"Spoqa Han Sans Neo", "Apple SD Gothic Neo", sans-serif',
  headings: {
    fontFamily: '"Spoqa Han Sans Neo", "Apple SD Gothic Neo", sans-serif',
  },
  primaryColor: "training",
  primaryShade: 7,
  defaultRadius: "md",
  colors: {
    training: [
      "#f1f8e9",
      "#e5f0d9",
      "#ccdfb5",
      "#b1ce90",
      "#96ba6b",
      "#7da64c",
      "#658b3c",
      "#4e702f",
      "#395426",
      "#243b1e",
    ],
  },
  components: {
    TextInput: { defaultProps: { size: "md" } },
    PasswordInput: { defaultProps: { size: "md" } },
    NativeSelect: { defaultProps: { size: "md" } },
    Button: { defaultProps: { size: "md" } },
  },
});
