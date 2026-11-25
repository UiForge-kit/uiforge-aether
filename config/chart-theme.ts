import type { ThemeId } from "@/types/theme";

// Chart.js draws on a canvas and can't take `var(--*)`: keep these values in sync with globals.css by hand

export interface ChartPalette {
  series: [string, string, string, string, string];
  grid: string;
  text: string;
  surface: string;
}

type Scheme = "light" | "dark";

const PALETTES: Record<ThemeId, Record<Scheme, ChartPalette>> = {
  minimal: {
    light: {
      series: ["#c05a34", "#3a352e", "#8f8578", "#c4bcb0", "#e2ddd4"],
      grid: "#e8e4dc",
      text: "#8a857c",
      surface: "#ffffff",
    },
    dark: {
      series: ["#e0885a", "#e8e3da", "#a49a8c", "#6d655b", "#3d3831"],
      grid: "#ffffff1f",
      text: "#a49e94",
      surface: "#2b2926",
    },
  },
  contrast: {
    light: {
      series: ["#10a37f", "#1f2024", "#7d8088", "#b6b9bf", "#e3e4e7"],
      grid: "#eaeaec",
      text: "#71717a",
      surface: "#ffffff",
    },
    dark: {
      series: ["#22c79b", "#e9e9ec", "#9a9ba3", "#5f6068", "#33343a"],
      grid: "#ffffff1f",
      text: "#a0a0a9",
      surface: "#232427",
    },
  },
  terminal: {
    light: {
      series: ["#367d50", "#a17045", "#a14545", "#5c8a6d", "#8aa895"],
      grid: "#c7d1cb",
      text: "#4c6756",
      surface: "#e8eeea",
    },
    dark: {
      series: ["#45a167", "#ac6f39", "#ac3939", "#6aaf83", "#476b54"],
      grid: "#ffffff1f",
      text: "#75a386",
      surface: "#0d120f",
    },
  },
};

export function getChartPalette(themeId: ThemeId, scheme: Scheme): ChartPalette {
  return PALETTES[themeId][scheme];
}

export function withAlpha(hex: string, alpha: number): string {
  const value = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${value}`;
}
