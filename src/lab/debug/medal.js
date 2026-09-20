export function medalForScore(score) {
  if (score >= 90) return { id: "gold", label: "GOLD DEBUGGER" };
  if (score >= 75) return { id: "silver", label: "SILVER DEBUGGER" };
  return { id: "bronze", label: "BRONZE DEBUGGER" };
}
