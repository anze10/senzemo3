import { create, StateCreator } from "zustand";
import { produce } from "immer";
import { persist, createJSONStorage } from "zustand/middleware";

export type SensorData = {
  sensor_name: SensorModel;
  common_data: SensorKeyValuePair[];
  custom_data?: SensorKeyValuePair[];
};

export type SensorKeyValuePair = {
  name: string;
  value: unknown;
};

export const COMMON_PROPERTIES = [
  "app_key",
  "dev_eui",
  "family_id",
  "join_eui",
  "product_id",
  "device",
  "lora",
];

type SensorJSON = Record<string, unknown>;

export type RatedSensorData = {
  data: SensorData;
  okay?: boolean;
};

interface SensorState {
  current_sensor_index: number;
  sensors: RatedSensorData[];
  add_new_sensor: (data: string) => void;
  set_current_sensor_index: (new_index: number) => void;
  set_sensor_status: (sensor_number: number, okay: boolean) => void;
  set_sensor_data: (sensor_number: number, new_data: SensorData) => void;
}

const sensor_callback: StateCreator<SensorState, [], []> = (set) => ({
  current_sensor_index: 0,
  sensors: [],
  add_new_sensor: (data) => {
    const parsed_data = JSON.parse(data) as SensorJSON;
    const sensor_name = parsed_data.family_id as SensorModel;

    const { common_data, custom_data } = split_common_custom(parsed_data);

    const new_data: SensorData = {
      sensor_name,
      common_data,
      custom_data,
    };

    console.log("Adding new sensor:", new_data);
    set(
      produce((state: SensorState) => {
        state.sensors.push({
          data: new_data,
        });

        state.current_sensor_index = state.sensors.length - 1;
      }),
    );
  },
  set_current_sensor_index: (new_index: number) =>
    set({ current_sensor_index: new_index }),
  set_sensor_status: (sensor_number, okay) => {
    set(
      produce((state: SensorState) => {
        const this_sensor = state.sensors[sensor_number];
        if (!this_sensor) return;

        this_sensor.okay = okay;
      }),
    );
  },
  set_sensor_data: (sensor_number, new_data) => {
    set(
      produce((state: SensorState) => {
        const this_sensor = state.sensors[sensor_number];
        if (!this_sensor) return;

        this_sensor.data = new_data;
      }),
    );
  },
});

export const useSensorStore = create<SensorState>()(
  persist(sensor_callback, {
    name: "sensor-store",
    storage: createJSONStorage(() => localStorage),
  }),
);

export enum SensorModel {
  SMC30,
  SSM40,
  STO10,
  STP40,
  SLW10,
  SRM10,
  STF40,
  KOU20,
  SPU10,
}

function split_common_custom(parsed_data: SensorJSON): {
  common_data: SensorKeyValuePair[];
  custom_data: SensorKeyValuePair[];
} {
  const parsed_data_keys = Object.keys(parsed_data);

  const common_data = parsed_data_keys
    .filter((key) => COMMON_PROPERTIES.includes(key))
    .map((key) => ({ name: key, value: parsed_data[key] }));
  const custom_data = parsed_data_keys
    .filter((key) => !COMMON_PROPERTIES.includes(key))
    .map((key) => ({ name: key, value: parsed_data[key] }));

  return {
    common_data,
    custom_data,
  };
}
