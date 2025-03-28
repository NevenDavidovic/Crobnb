export function useDateFormatter() {
  const formatDate = (date: Date | string): string => {
    if (typeof date === "string" && date.includes(".")) {
      const parts = date.split(".");
      if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const year = parseInt(parts[2]);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return `${day.toString().padStart(2, "0")}/${(month + 1)
            .toString()
            .padStart(2, "0")}/${year}`;
        }
      }
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return typeof date === "string" ? date : "";
    }

    return `${dateObj.getDate().toString().padStart(2, "0")}/${(
      dateObj.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`;
  };
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";

    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString;
    }

    if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString.substring(0, 5);
    }

    try {
      const date = new Date(timeString);
      if (!isNaN(date.getTime())) {
        return (
          date.getHours().toString().padStart(2, "0") +
          ":" +
          date.getMinutes().toString().padStart(2, "0")
        );
      }
    } catch (e) {
      console.error("Error parsing time:", e);
    }

    return timeString;
  };

  return {
    formatDate,
    formatTime,
  };
}
