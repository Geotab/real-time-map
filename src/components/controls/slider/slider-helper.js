
import storage from "../../../dataStore";

export const minutesInDay = 1439;

export function getMinuteOfDay(currentSecond) {
  const difference = currentSecond - storage.dayStart.getTime();
  return Math.floor(difference / 60000);
}

export function calulateCurrentTime(minuteOfDay) {
  return storage.dayStart.getTime() + minuteOfDay * 60 * 1000;
}

export function getTimeInlocalFormat(minuteOfDay) {
  const currentTime = new Date(calulateCurrentTime(minuteOfDay));
  return currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function minuteOfDayToHour(minuteOfDay) {

  const value = Math.round(minuteOfDay);
  const meridiem = value < 720 ? "AM" : "PM";
  const displayTime = Math.ceil((value / 720) * 12);

  return `${displayTime <= 12 ? displayTime : displayTime - 12}:00 ${meridiem}`;
}

export function getPixelsPerMinute(widthPixels) {
  return widthPixels / 24 / 60;
}

export function calculateLeftOffset(offsetPixelWidth, currentValue, pixelsPerMinute) {

  const overFlowValue = Math.abs(Math.round(offsetPixelWidth / pixelsPerMinute));

  if (currentValue <= overFlowValue) {
    return Math.round((overFlowValue - currentValue) * pixelsPerMinute);
  }

  const upperOverFlowLimit = minutesInDay - overFlowValue;
  if (currentValue >= upperOverFlowLimit) {
    return Math.round((upperOverFlowLimit - currentValue) * pixelsPerMinute);
  }

  return 0;

}
