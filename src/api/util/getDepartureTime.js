export const getDepartureTime = (date = new Date()) => {
  const dayOfWeek = date.getUTCDay();

  if (dayOfWeek !== 1) {
    const dayOfMonth = date.getUTCDate();

    date.setUTCDate(dayOfMonth - dayOfWeek + 8);
  }

  date.setUTCHours(9, 0, 0, 0);

  return date;
};
