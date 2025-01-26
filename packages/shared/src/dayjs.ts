import dayjs from "dayjs";

export const formatDate = (date: string, format = "YYYY-MM-DD HH:mm:ss") => {
  if (!date) {
    return "-";
  }
  return dayjs(date).format(format);
};
