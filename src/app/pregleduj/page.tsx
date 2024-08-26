"use client";

import { useEffect, useState } from "react";
import handleClick from "../dev/components/HandleClick";
import {
  type SensorData,
  type SensorKeyValuePair,
  useSensorStore,
} from "../dev/components/SensorStore";
import { Typography } from "@mui/material";

export default function NewSensorSetter() {
  const [sensorNumber, setSensorNumber] = useState(0);

  const current_sensor = useSensorStore((state) => state.sensors[sensorNumber]);
  const all_sensors = useSensorStore((state) => state.sensors);
  const initialize_sensor_data = useSensorStore(
    (state) => state.add_new_sensor,
  );
  const set_sensor_status = useSensorStore((state) => state.set_sensor_status);

  useEffect(() => {
    // zamenjaj z funkcijo ki uporabi prejšn socket
    void handleClick((data) => initialize_sensor_data(data));
  }, [initialize_sensor_data, sensorNumber]);

  useEffect(() => {
    console.log(all_sensors);
  }, [all_sensors]);
  return (
    <div>
      <button onClick={() => setSensorNumber(sensorNumber - 1)}>
        Previous sensor
      </button>
      <h1>Sensor {sensorNumber}</h1>
      <button
        onClick={async () => {
          set_sensor_status(sensorNumber, true);
          setSensorNumber(sensorNumber + 1);
        }}
      >
        Sensor {sensorNumber}: OKAY
      </button>
      <button
        onClick={async () => {
          set_sensor_status(sensorNumber, false);
          setSensorNumber(sensorNumber + 1);
        }}
      >
        Sensor {sensorNumber}: NOT OKAY
      </button>
      <a href="/konec">Zaključi</a>
      <Typography variant="h1">Trenutni sensor</Typography>
      <pre>{JSON.stringify(current_sensor, null, 2)}</pre>

      <Typography variant="h1">Vsi sensorji</Typography>
      <pre>{JSON.stringify(all_sensors, null, 2)}</pre>
      <form>
        <CommonDataInput current_sensor={current_sensor?.data} />
        {current_sensor?.data.custom_data?.map((some_property) => (
          <CustomSensorInput
            key={some_property.name}
            name={some_property.name}
            value={some_property.value}
          />
        ))}
      </form>
    </div>
  );
}

function CommonDataInput({ current_sensor }: { current_sensor?: SensorData }) {
  return <pre>{JSON.stringify(current_sensor, null, 2)}</pre>;
}

function CustomSensorInput({ name, value }: SensorKeyValuePair) {
  if (typeof value !== "number") return null;

  return <input key={name} type="number" defaultValue={value} />;
}
