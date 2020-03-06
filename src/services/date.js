export function minutesFromNow(num) {
  return Date.now() + num * 60 * 1000;
}

export function hoursFromNow(num) {
  return minutesFromNow(60 * num);
}

export function daysFromNow(num) {
  return hoursFromNow(24 * num);
}