import { Box, Button, Container, SimpleGrid, Stack, Text } from "@mantine/core";
import { screens, type Screen } from "./screens";
export function BottomNavigation({
  screen,
  navigate,
}: {
  screen: Screen;
  navigate: (screen: Screen) => void;
}) {
  return (
    <Box component="nav" className="app-tabbar" aria-label="주 메뉴">
      <Container size={650} px={0}>
        <SimpleGrid cols={5} spacing={4}>
          {screens.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              component="a"
              href={`#${id}`}
              variant="subtle"
              c={screen === id ? "yellow.4" : "dark.1"}
              aria-current={screen === id ? "page" : undefined}
              aria-label={label}
              h={60}
              p={0}
              styles={{ inner: { height: "100%" }, label: { width: "100%" } }}
              onClick={() => navigate(id)}
            >
              <Stack gap={4} align="center" w="100%">
                <Icon
                  size={22}
                  strokeWidth={screen === id ? 2.3 : 1.8}
                  aria-hidden="true"
                />
                <Text
                  component="span"
                  fz={11}
                  fw={screen === id ? 650 : 450}
                  c="inherit"
                >
                  {label}
                </Text>
              </Stack>
            </Button>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
