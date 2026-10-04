import {
  Modal as MantineModal,
  Drawer,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Dumbbell } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const mobile = useMediaQuery("(max-width: 48em)");
  const [returnTo] = useState(() =>
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  // These editors unmount when closed; Mantine's opened=false transition never runs.
  useEffect(
    () => () => {
      if (returnTo?.isConnected) returnTo.focus({ preventScroll: true });
    },
    [returnTo],
  );
  const props = {
    opened: true,
    onClose,
    title,
    returnFocus: false,
    closeOnClickOutside: false,
    closeButtonProps: { "aria-label": "닫기" },
    removeScrollProps: { allowPinchZoom: true },
  };
  return mobile ? (
    <Drawer
      {...props}
      position="bottom"
      size="auto"
      styles={{
        content: { height: "auto", maxHeight: "90dvh" },
        body: { maxHeight: "calc(90dvh - 80px)", overflowY: "auto" },
      }}
      padding="lg"
    >
      {children}
    </Drawer>
  ) : (
    <MantineModal {...props} centered size="lg" padding="lg">
      {children}
    </MantineModal>
  );
}
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Stack align="center" gap="sm" py="xl" ta="center">
      <ThemeIcon variant="light" size={44} radius="lg">
        <Dumbbell size={22} />
      </ThemeIcon>
      <Title order={3}>{title}</Title>
      <Text c="dimmed" size="sm" maw={400}>
        {children}
      </Text>
    </Stack>
  );
}
export type Run = (
  action: () => Promise<unknown>,
  message?: string,
) => Promise<boolean>;
