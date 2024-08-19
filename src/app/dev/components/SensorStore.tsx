import { create } from "zustand";

type SensorData = {
  sensor_name: SensorModel;
  common_data: SensorKeyValuePair[];
  custom_data?: SensorKeyValuePair[];
};

type SensorKeyValuePair = {
  name: string;
  value: unknown;
};

/* export type CommonSensorData = {
  app_key: string;
  dev_eui: string;
  family_id: number;
  join_eui: string;
  product_id: number;
  device: {
    adc_delay: number;
    adc_enable: boolean;
    firmware_version: number;
    hardware_version: number;
    mowment_threshold: number;
    status: number;
  };
  lora: {
    ack: number;
    data_rate: number;
    freq_reg: string;
    hybrid_mask: string[];
    mask2_5: number;
    send_period: number;
  };
}; */

export const COMMON_PROPERTIES = [
  "app_key",
  "dev_eui",
  "family_id",
  "join_eui",
  "product_id",
  "device",
  "lora",
];

// parsed data - common data => custom data

type SensorJSON = Record<string, unknown>;

interface SensorState {
  sensor_data?: SensorData;
  set_from_json: (data: string) => void;
}

export const useSensorStore = create<SensorState>((set) => ({
  sensor_data: undefined,
  set_from_json: (data) => {
    const parsed_data = JSON.parse(data) as SensorJSON;
    const sensor_name = parsed_data.family_id as SensorModel;
    const { common_data, custom_data } = split_common_custom(parsed_data);

    const new_data: SensorData = {
      sensor_name,
      common_data,
      custom_data,
    };

    set((_: unknown) => ({
      sensor_data: new_data,
    }));
  },
}));

enum SensorModel {
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
