import { parse } from "date-fns";

export const compareTime = (startTime: string, endTime: string) => {
  const startTimeDate = parseTime(startTime);
  const endTimeDate = parseTime(endTime);

  if (startTimeDate >= endTimeDate) {
    return false;
  }
  return true;
};

export const parseTime = (time: string) => parse(time, "HH:mm", new Date());

export const convertTimeStringToDateTime = ({ startTime, endTime }: any) => {
  const [hourStartTime, minuteStartTime] = startTime.split(":");
  const [hourEndTime, minuteEndTime] = endTime.split(":");
  const currentStartDate = new Date();
  const currentEndDate = new Date();

  currentStartDate.setHours(hourStartTime);
  currentStartDate.setMinutes(minuteStartTime);
  currentEndDate.setHours(hourEndTime);
  currentEndDate.setMinutes(minuteEndTime);

  const formattedStartTime = currentStartDate.toISOString();
  const formattedEndTime = currentEndDate.toISOString();
  return {
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  };
};

export const generateId = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters[randomIndex];
  }

  return randomId;
};

export const formatPrice = (price: number | string): string => {
  if (typeof price === "number") {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } else {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};
