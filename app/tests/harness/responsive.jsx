import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Box,
  Group,
  MantineProvider,
  NativeSelect,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@fontsource-variable/geist";
import { theme } from "../../src/theme";
import { screens } from "../../src/components/screens";

// Dev-only: iframe content uses its real layout viewport, without clearing data.
// This HTML is not a Vite production entry or a public asset.
export default function Harness() {
  const [width, setWidth] = useState("390");
  const [screen, setScreen] = useState("today");
  return (
    <MantineProvider theme={theme} forceColorScheme="dark">
      <Stack p="lg" bg="dark.9" mih="100dvh">
        <Title order={1}>반응형 검사</Title>
        <Text size="sm" c="dimmed">
          개발용 동일 origin 검사입니다. 가짜 프로필을 사용하세요. 실제
          iPhone·키보드·safe area 검증을 대신하지 않습니다.
        </Text>
        <Group>
          <NativeSelect
            label="검증 폭"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            data={["320", "375", "390", "768", "1440"]}
          />
          <NativeSelect
            label="화면"
            value={screen}
            onChange={(e) => setScreen(e.target.value)}
            data={screens.map((s) => ({ value: s.id, label: s.label }))}
          />
        </Group>
        <ScrollArea>
          <Box
            component="iframe"
            title="앱 반응형 검사"
            src={`/#${screen}`}
            w={Number(width)}
            h={844}
            style={{
              display: "block",
              border: 0,
              outline: "1px solid var(--mantine-color-dark-4)",
            }}
          />
        </ScrollArea>
      </Stack>
    </MantineProvider>
  );
}
createRoot(document.getElementById("root")).render(<Harness />);
