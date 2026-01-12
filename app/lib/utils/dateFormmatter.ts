export function getCurrentDate() {
  return new Date();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);

  return date.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function remainingDate(deadline: Date) {
  const currentDate = getCurrentDate();
  const yearDiff = deadline.getFullYear() - currentDate.getFullYear();
  const monthDiff = deadline.getMonth() - currentDate.getMonth();
  const dateDiff = deadline.getDate() - currentDate.getDate();

  const totalDateDiff = yearDiff * 12 * 30 + monthDiff * 30 + dateDiff;

  return totalDateDiff;
}
