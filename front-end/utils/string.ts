import { parse  } from 'date-fns'

export const compareTime = (startTime: string, endTime: string) => {

  const startTimeDate = parseTime(startTime);
  const endTimeDate = parseTime(endTime);

  if (startTimeDate >= endTimeDate) {
    return false;
  } 
  return true;
}

export const parseTime = (time: string) => parse(time, 'HH:mm', new Date());

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
    endTime: formattedEndTime
  }
}

