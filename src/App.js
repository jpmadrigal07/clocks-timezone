import Clock from "./Clock";
import { useState } from "react";
import Selection from "./Selection";

function App() {
  const [localTime, setLocalTime] = useState({});
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [timezoneData, setTimezoneData] = useState([]);
  const [showTimezone, setShowTimezone] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px",
      }}
    >
      {showTimezone ? (
        <>
          <Clock isLocal timeZone={timeZone} setLocalTime={setLocalTime} />
          <div style={{ display: "flex", gap: "25px", marginTop: "25px" }}>
            {timezoneData
              .filter((item) => item.isSelected)
              .map((data, index) => (
                <Clock
                  key={index}
                  timeZone={data.value}
                  localTimezone={timeZone}
                  localTime={localTime}
                />
              ))}
          </div>
          <button
            style={{ marginTop: "55px" }}
            onClick={() => setShowTimezone(false)}
          >
            Back to menu
          </button>
        </>
      ) : (
        <Selection
          setShowTimezone={setShowTimezone}
          timezoneData={timezoneData}
          setTimezoneData={setTimezoneData}
        />
      )}
    </div>
  );
}

export default App;
