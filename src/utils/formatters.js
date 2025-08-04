/**
 * Format remaining time duration into human readable format
 * @param {number} value - Duration value
 * @param {object} options - Formatting options
 * @param {string} options.unit_of_measurement - Input unit: 'hour' or 'minute' (default: 'hour')
 * @param {boolean} options.showSeconds - Whether to show seconds (default: false)
 * @param {boolean} options.showComplete - Whether to show complete text when done (default: true)
 * @param {string} options.completeText - Text to show when complete (default: 'Complete')
 * @returns {string} Formatted duration string
 */
export const formatDuration = (value, options = {}) => {
  const {
    unit_of_measurement = "hour",
    showSeconds = false,
    showComplete = true,
    completeText = "Complete",
  } = options;

  if (!value || value <= 0) {
    return showComplete ? completeText : "0m";
  }

  let totalMinutes;
  if (unit_of_measurement === "hour") {
    totalMinutes = value * 60;
  } else {
    totalMinutes = value;
  }

  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.floor(totalMinutes % 60);
  const secs = showSeconds ? Math.floor((totalMinutes % 1) * 60) : 0;

  let result = "";

  if (hours > 0) {
    result += `${hours}h`;
    if (mins > 0 || showSeconds) {
      result += ` ${mins}m`;
    }
  } else if (mins > 0) {
    result += `${mins}m`;
  } else if (!showSeconds) {
    result += "0m";
  }

  if (showSeconds && (hours > 0 || mins > 0 || secs > 0)) {
    result += ` ${secs}s`;
  } else if (showSeconds && hours === 0 && mins === 0) {
    result = `${secs}s`;
  }

  return result || "0m";
};

/**
 * Calculate and format the end time based on remaining time
 * @param {number} remainingTime - Remaining time value
 * @param {object} hass - Home Assistant instance
 * @param {object} options - Formatting options
 * @param {string} options.unit_of_measurement - Input unit: 'hour' or 'minute' (default: 'hour')
 * @returns {string} Formatted end time
 */
export const formatEndTime = (remainingTime, hass, options = {}) => {
  const { unit_of_measurement = "hour" } = options;

  if (!remainingTime || remainingTime <= 0 || !hass) {
    return "---";
  }

  try {
    // Convert to minutes for calculation
    const remainingMinutes =
      unit_of_measurement === "hour" ? remainingTime * 60 : remainingTime;

    const endTime = new Date(Date.now() + remainingMinutes * 60000);
    const timeFormat = {
      hour: hass.locale.hour_24 ? "2-digit" : "numeric",
      minute: "2-digit",
      hour12: !hass.locale.hour_24,
    };

    return new Intl.DateTimeFormat(hass.locale.language, timeFormat)
      .format(endTime)
      .toLowerCase()
      .replace(/\s/g, "");
  } catch (error) {
    console.warn("Error formatting end time:", error);
    return "---";
  }
};

/**
 * Format a temperature value with unit
 * @param {number|string} value - Temperature value
 * @param {string} unit - Temperature unit
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (value, unit) => {
  const temp = parseFloat(value);
  if (isNaN(temp)) return "---";
  return `${temp.toFixed(0)}${unit}`;
};
