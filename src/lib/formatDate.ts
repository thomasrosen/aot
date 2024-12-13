export function formatDate(date: Date | string | undefined) {
  if (!date) {
    return "";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().replace("T", " ").replace("Z", "").slice(0, -7);
}
