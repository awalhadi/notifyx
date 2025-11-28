/**
 * Available toast positions on screen
 * @public
 */
export const POSITIONS = {
  TOP_RIGHT: "top-right",
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
  CENTER: "center", // For loading toasts
} as const;

/**
 * Toast position type
 * @public
 */
export type Position = (typeof POSITIONS)[keyof typeof POSITIONS];
