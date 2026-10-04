import {
  Activity,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Settings2,
} from "lucide-react";
export const screens = [
  { id: "today", label: "오늘", icon: Activity },
  { id: "library", label: "운동 탐색", icon: BookOpen },
  { id: "routines", label: "나의 루틴", icon: CalendarDays },
  { id: "reports", label: "리포트", icon: ChartNoAxesCombined },
  { id: "settings", label: "설정", icon: Settings2 },
] as const;
export type Screen = (typeof screens)[number]["id"];
