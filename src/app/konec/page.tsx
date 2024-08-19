"use client";

import { useSensorStore } from "../dev/components/SensorStore";

export default function KonecPage() {
  const sensor_data = useSensorStore();

  return (
    <div>
      <h1>Konec</h1>
      <pre>{JSON.stringify(sensor_data, null, 2)}</pre>
    </div>
  );
}
