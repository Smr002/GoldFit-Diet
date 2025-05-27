export function formatDate(dateInput) {
  console.log("formatDate called with:", dateInput);
  const date = new Date(dateInput);
  console.log("Parsed date:", date);
  if (isNaN(date)) return "Invalid date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
