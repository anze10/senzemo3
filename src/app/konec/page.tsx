"use client";

import { useRouter } from "next/navigation";
import { useSensorStore } from "../dev/components/SensorStore";

export default function KonecPage() {
  const sensor_data = useSensorStore((state) => state.sensors);
  const resetStore = useSensorStore((state) => state.reset);
  const router = useRouter();
  return (
    <div>
      <h1>Konec</h1>
      <pre>{JSON.stringify(sensor_data, null, 2)}</pre>
      <button onClick={() => {
        resetStore();
        router.push("/dev");
      }}>
        test
      </button>
    </div>
  );
}
