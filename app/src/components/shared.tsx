import { Modal as MantineModal } from "@mantine/core";
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
  return (
    <MantineModal
      opened
      onClose={onClose}
      title={title}
      centered
      size="lg"
      returnFocus={false}
      closeOnClickOutside={false}
      closeButtonProps={{ "aria-label": "닫기" }}
      removeScrollProps={{ allowPinchZoom: true }}
    >
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
    <div className="empty">
      <span className="empty-mark">＋</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export type Run = (
  action: () => Promise<unknown>,
  message?: string,
) => Promise<boolean>;
