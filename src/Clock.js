import React from "react";
import { useState, useEffect, useCallback } from "react";

const Clock = ({
  isLocal = false,
  localTimezone,
  timeZone,
  currentTime,
  description,
  setLocalTime,
  localTime,
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState({});
  const [date, setDate] = useState(new Date());
  const [secCounter, setSecCounter] = useState(0);
  const [differenceMessage, setDifferenceMessage] = useState("");
  const localCity = localTimezone
    ? localTimezone.split("/")[1]?.replace("_", " ")
    : "---";
  const city = timeZone ? timeZone.split("/")[1]?.replace("_", " ") : "---";

  const fetchTimezone = useCallback(
    async (selectedTimezone) => {
      const response = await fetch(
        `http://worldtimeapi.org/api/timezone/${selectedTimezone}`
      );
      const res = await response.json();
      if (isLocal) {
        setLocalTime(res);
      }
      setSelectedTimezone(res);
    },
    [isLocal, setLocalTime]
  );

  const refreshClock = useCallback(() => {
    const unixtime = Math.floor(
      new Date(
        selectedTimezone?.datetime?.replace(selectedTimezone?.utc_offset, "")
      ).getTime() / 1000
    );
    setSecCounter(secCounter + 1);
    setDate(new Date((unixtime + secCounter) * 1000));
  }, [selectedTimezone, secCounter]);

  useEffect(() => {
    setSecCounter(0);
    fetchTimezone(timeZone);
  }, [timeZone, fetchTimezone]);

  useEffect(() => {
    const timerId = selectedTimezone ? setInterval(refreshClock, 1000) : null;
    return () => {
      clearInterval(timerId);
    };
  }, [selectedTimezone, refreshClock]);

  useEffect(() => {
    const date1 = new Date(localTime?.datetime);
    const date2 = new Date(
      selectedTimezone?.datetime?.replace(selectedTimezone?.utc_offset, "")
    );
    const diff = date2.valueOf() - date1.valueOf();
    const roundedDiff = Math.round(diff / 1000 / 60 / 60);
    const type = roundedDiff > 0 ? "ahead" : "behind";
    setDifferenceMessage(
      `${Math.abs(roundedDiff)} ${
        Math.abs(roundedDiff) > 1 ? "hours" : "hour"
      } ${type} from ${localCity}`
    );
  }, [localTime, city, selectedTimezone, localCity]);

  return (
    <div>
      {isLocal ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: "0px", textAlign: "center" }}>{city}</h3>
          <h1 style={{ marginTop: "0px", textAlign: "center" }}>
            {date.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h1>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid black",
            padding: "10px 25px",
          }}
        >
          <div>
            <h3
              style={
                description ? { marginBottom: "0px" } : { textAlign: "center" }
              }
            >
              {city}
            </h3>
            {description ? (
              <h4 style={{ marginTop: "0px", textAlign: "center" }}>
                {description}
              </h4>
            ) : null}
          </div>
          <h1 style={{ textAlign: "center" }}>
            {date.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h1>
          <div>
            <h4 style={{ marginBottom: "0px", textAlign: "center" }}>
              {selectedTimezone?.abbreviation}
            </h4>
            <h4 style={{ marginTop: "0px", textAlign: "center" }}>
              {differenceMessage}
            </h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clock;
