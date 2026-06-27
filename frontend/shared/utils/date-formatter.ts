import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi"; // Import Vietnamese locale for human-friendly terms

// Extend relativeTime plugin
dayjs.extend(relativeTime);
// Set Vietnamese as default locale
dayjs.locale("vi");

export const formatDate = (
  date: string | Date | number | null | undefined,
  formatPattern = "DD/MM/YYYY"
): string => {
  if (!date) return "";
  return dayjs(date).format(formatPattern);
};

export const formatDateTime = (
  date: string | Date | number | null | undefined,
  formatPattern = "DD/MM/YYYY HH:mm"
): string => {
  if (!date) return "";
  return dayjs(date).format(formatPattern);
};

export const timeAgo = (date: string | Date | number | null | undefined): string => {
  if (!date) return "";
  return dayjs(date).fromNow();
};

export { dayjs };
export default dayjs;
