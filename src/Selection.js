import React from "react";
import { useState, useEffect } from "react";

const Selection = ({ timezoneData, setTimezoneData, setShowTimezone }) => {
  const [error, setError] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);
  const checkList = [
    "Asia/Singapore",
    "Asia/Tokyo",
    "Asia/Seoul",
    "Australia/Melbourne",
    "Australia/Sydney",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "America/New_York",
    "America/Los_Angeles",
  ];

  const handleCheckboxChange = (isSelected, value) => {
    setError("");
    const itemIndex = timezoneData.findIndex((item) => item.value === value);
    if (itemIndex >= 0) {
      timezoneData[itemIndex].isSelected = isSelected;
      setTimezoneData([...timezoneData]);
    } else {
      setTimezoneData([
        ...timezoneData,
        {
          value: value,
          isSelected: isSelected,
        },
      ]);
    }
  };

  useEffect(() => {
    setSelectedCount(timezoneData.filter((item) => item.isSelected));
  }, [timezoneData]);

  return (
    <div>
      <h3>Please select timezone (Max: 4)</h3>
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
      {checkList.map((item, index) => {
        const data = timezoneData.find((res) => res.value === item);
        return (
          <div key={index} style={{ paddingBottom: "10px" }}>
            <input
              value={item}
              id={index}
              type="checkbox"
              checked={data?.isSelected}
              disabled={!data?.isSelected && selectedCount.length > 3}
              onChange={(e) => handleCheckboxChange(e.target.checked, item)}
            />
            <label htmlFor={index} style={{ marginLeft: "5px" }}>
              {item}
            </label>
          </div>
        );
      })}
      <button
        style={{ marginTop: "10px" }}
        onClick={() => {
          if (selectedCount.length === 0) {
            setError("Please select at least one timezone");
          } else {
            setShowTimezone(true);
          }
        }}
      >
        Show
      </button>
    </div>
  );
};

export default Selection;
