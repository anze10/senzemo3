"use client";

import { useState } from "react";
import handleClick from "../dev/components/HandleClick";
import { useSensorStore } from "../dev/components/SensorStore";

export function NewSensorSetter() {
  const [sensorNumber, setSensorNumber] = useState(0);
  const sensor_data = useSensorStore(
    (state) => state.sensor_data[sensorNumber],
  );
  const set_sensors_from_json = useSensorStore((state) => state.set_from_json);

  return (
    <div>
      <button onClick={() => setSensorNumber(sensorNumber + 1)}>
        Next sensor
      </button>
      <button onClick={() => setSensorNumber(sensorNumber - 1)}>
        Previous sensor
      </button>
      <h1>Sensor {sensorNumber}</h1>
      <button
        onClick={async () => {
          await handleClick((data) =>
            set_sensors_from_json(data, sensorNumber, true),
          );
        }}
      >
        Sensor {sensorNumber}: OKAY
      </button>
      <button
        onClick={async () => {
          await handleClick((data) =>
            set_sensors_from_json(data, sensorNumber, false),
          );
        }}
      >
        Sensor {sensorNumber}: NOT OKAY
      </button>
      <a href="/konec">Zaključi</a>
      <pre>{JSON.stringify(sensor_data, null, 2)}</pre>
    </div>
  );
}
