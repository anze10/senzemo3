"use client";

import { useRouter } from "next/navigation";
import { useSensorStore } from "../dev/components/SensorStore";
import { useContext, useState } from "react";
import { GoogleDriveContext } from "../_components/google_drive_context";
import { insert } from "~/server/create_foldet";

export function Konec() {
  const googleDrive = useContext(GoogleDriveContext);
  const sensor_data = useSensorStore((state) => state.sensors);
  const resetStore = useSensorStore((state) => state.reset);
  const [mode_id, set_model_id] = useState<string>("");
  const [device_name, set_device_name] = useState<string>("");
  const [band_id, set_band_id] = useState<string>("");
  const lorawan_version = "RP001_V1_0_3_REV_A";
  const [frequancy_plan_id, set_frequancy_plan_id] = useState<string>("");
  const router = useRouter();

  if (!googleDrive) return <p>Napaka z Google Drive</p>;
  const custom_FW = "NA";
  console.log(googleDrive);
   if(!googleDrive.googleDrive?.fileId) {
        throw new Error("No file id");
      }

  let newRowCSV = [];
  let newROWEXE = [];
  for (const element of sensor_data) {
    if (element.okay) {
      switch (element?.data.common_data?.family_id) {
        case 1:
          set_model_id("SMC30");
          set_device_name("Senstick Microclimate");

          break;
        case 2:
          set_model_id("SSM40");
          break;
        case 3:
          set_model_id("SXX3.6");
          break;
      }
      switch (element?.data.common_data?.lora.freq_reg) {
        case "AS923":
          set_frequancy_plan_id("AS_920_923_TTN_AU");
          set_band_id("AS_923");
          break;
        case "EU868":
          set_frequancy_plan_id("EU_863_870_TTN");
          set_band_id("EU_863_870");
          break;
        case "US915":
          set_frequancy_plan_id("US_902_928_FSB_2");
          set_band_id("US_902_928");
          break;
      }
      newRowCSV = [
        mode_id + "-" + element?.data.common_data?.dev_eui,
        element?.data.common_data?.dev_eui,
        element?.data.common_data?.join_eui,
        device_name,
        frequancy_plan_id,
        lorawan_version,
        element?.data.common_data?.app_key,
        "Senzemo",
        mode_id,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        band_id,
      ];
      newROWEXE = [
        mode_id,
        element?.data.common_data?.dev_eui,
        element?.data.common_data?.app_key,
        element?.data.common_data?.join_eui,
        element?.data.common_data?.lora.freq_reg,
        "FSB2",
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        element?.data.common_data?.device.hw_ver,
        element?.data.common_data.device.fw_ver,
        custom_FW,
        element?.data.common_data?.lora.send_period,
        element?.data.common_data.device.adc_delay,
        element?.data.common_data.device.mov_thr,
      ];
     
      void insert(googleDrive.googleDrive?.fileId, newRowCSV as string[]); ;
    }
  }

  return (
    <div>
      <h1>Konec</h1>
      <pre>{JSON.stringify(sensor_data, null, 2)}</pre>
      <button
        onClick={() => {
          resetStore();
          router.push("/dev");
        }}
      >
        test
      </button>
    </div>
  );
}
