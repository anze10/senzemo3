"use client";
import React, { useState, useCallback } from "react";
import {
  Checkbox,
  Button,
  InputLabel,
  Input,
  FormControl,
  MenuItem,
  Select,
  Box,
} from "@mui/material";
import handleClick from "./HandleClick";
import parseJsonString from "./Parser";
import { signOut } from "next-auth/react";
import { createFolderAndSpreadsheet } from "~/server/create_foldet";

interface Sensor {
  deviceType: string;
  count: string;
  deviceEui: string;
  status: number;
  appEui: string;
  appKey: string;
  sendPeriod: string;
  ack: string;
  movThr: string;
  adcEnable: boolean;
  adcDelay: string;
  temperature: string;
  humidity: string;
  deviceTypeOptions: string[];
  dataRateOptions: string[];
  frequencyRegionOptions: string;
  hybridEnableOptions: string[];
  hybridMaskOptions: number;
}

const SerialPortComponent: React.FC = () => {
  const [orderName, setOrderName] = useState<string>("");
  const [user, setUser] = useState<string>("John Doe");
  const [companyName, setCompanyName] = useState<string>("");
  const [showAdditionalDetails, setShowAdditionalDetails] =
    useState<boolean>(false);
  const [seznzor, setSensor] = useState<Sensor>({
    deviceType: "",
    count: "",
    deviceEui: "",
    status: 0,
    appEui: "",
    appKey: "",
    sendPeriod: "",
    ack: "",
    movThr: "",
    adcEnable: false,
    adcDelay: "",
    temperature: "",
    humidity: "",
    deviceTypeOptions: [],
    dataRateOptions: [],
    frequencyRegionOptions: "",
    hybridEnableOptions: [],
    hybridMaskOptions: 0,
  });
  const [sensorList, setSensorList] = useState<Sensor[]>([]);

  const addSensor = useCallback(() => {
    const newSensor: Sensor = {
      deviceType: "",
      count: "",
      deviceEui: "",
      status: 0,
      appEui: "",
      appKey: "",
      sendPeriod: "",
      ack: "",
      movThr: "",
      adcEnable: false,
      adcDelay: "",
      temperature: "",
      humidity: "",
      deviceTypeOptions: [],
      dataRateOptions: [],
      frequencyRegionOptions: "",
      hybridEnableOptions: [],
      hybridMaskOptions: 0,
    };
    setSensorList((prev) => [...prev, newSensor]);
  }, []);

  const handleDataReceived = useCallback((data: string) => {
    const parsedData = parseJsonString(data);
    console.log(parsedData);

    setSensor((prevState) => ({
      ...prevState,
      deviceType: parsedData.deviceType || "Senstic",
      deviceEui: parsedData.dev_eui || "",
      status:
        parsedData.device?.status !== undefined
          ? parseInt(parsedData.device.status, 10)
          : 10,
      appEui: parsedData.join_eui || "",
      appKey: parsedData.app_key || "",
      sendPeriod: parsedData.lora.send_period || "",
      ack: parsedData.lora.ack || "",
      movThr: parsedData.device.mov_thr || "",
      adcEnable: parsedData.adcEnable || false,
      adcDelay: parsedData.device.adc_delay || "",
      temperature: parsedData.sensors.temp || "",
      humidity: parsedData.sensors.hum || "",
      deviceTypeOptions: parsedData.deviceTypeOptions || [],
      dataRateOptions: parsedData.dataRateOptions || [],
      frequencyRegionOptions: parsedData.lora.freq_reg || "",
      hybridEnableOptions: parsedData.hybridEnableOptions || [],
      hybridMaskOptions:
        parsedData.lora.mask2_5 !== undefined ? parsedData.lora.mask2_5 : 0,
    }));
  }, []);

  const handleButtonClick = useCallback(() => {
    handleClick(handleDataReceived);
  }, [handleDataReceived]);

  const getStatusColor = useCallback((status: number) => {
    switch (status) {
      case 0:
        return "green";
      case 1:
      case 2:
        return "yellow";
      case 3:
      default:
        return "red";
    }
  }, []);

  return (
    <Box style={{ fontFamily: "Montserrat, sans-serif", width: "100%" }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <a href="/pregleduj">Pregleduj</a>
        <button
          onClick={handleButtonClick}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Open Serial Port
        </button>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>{user}</span>
        </div>
      </Box>
      <div className="px-6 py-8 md:px-8 md:py-12">
        <h1 className="mb-8 text-center text-3xl font-bold">SENZEMO</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: getStatusColor(seznzor.status),
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <div
            style={{
              border: "1px solid black",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <InputLabel htmlFor="device-eui">Device EUI</InputLabel>
            <Input
              id="device-eui"
              value={seznzor.deviceEui}
              onChange={(e) =>
                setSensor({ ...seznzor, deviceEui: e.target.value })
              }
              placeholder="Device EUI will be auto-filled from NFC tag"
            />
          </div>
          <div
            style={{
              border: "1px solid black",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <InputLabel htmlFor="status">Status</InputLabel>
            <input
              type="text"
              id="status"
              value={seznzor.status}
              style={{
                backgroundColor: getStatusColor(seznzor.status),
                fontSize: "1.5rem",
                width: "100%",
                padding: "0.5rem",
              }}
              disabled
            />
          </div>
          <div
            style={{
              border: "1px solid black",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <InputLabel htmlFor="frequency-region">Frequency Region</InputLabel>
            <FormControl fullWidth>
              <Select
                id="frequency-region"
                value={seznzor.frequencyRegionOptions}
                onChange={(e) =>
                  setSensor({
                    ...seznzor,
                    frequencyRegionOptions: e.target.value as string,
                  })
                }
              >
                <MenuItem value="AS923">AS923</MenuItem>
                <MenuItem value="EU868">EU868</MenuItem>
                <MenuItem value="US915">US915</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div
            style={{
              border: "1px solid black",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <InputLabel htmlFor="temperature">Temperature</InputLabel>
            <Input
              id="temperature"
              value={seznzor.temperature}
              onChange={(e) =>
                setSensor({ ...seznzor, temperature: e.target.value })
              }
              placeholder="Temperature"
            />
          </div>
          <div
            style={{
              border: "1px solid black",
              padding: "0.5rem",
              borderRadius: "8px",
            }}
          >
            <InputLabel htmlFor="humidity">Humidity</InputLabel>
            <Input
              id="humidity"
              value={seznzor.humidity}
              onChange={(e) =>
                setSensor({ ...seznzor, humidity: e.target.value })
              }
              placeholder="Humidity"
            />
          </div>
        </div>

        <button
          onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
          style={{
            backgroundColor: "#008CBA",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {showAdditionalDetails ? "Show Less" : "Show More"}
        </button>
        {showAdditionalDetails && (
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <div>
                <InputLabel htmlFor="join-eui">Join EUI</InputLabel>
                <Input
                  id="join-eui"
                  value={seznzor.appEui}
                  onChange={(e) =>
                    setSensor({ ...seznzor, appEui: e.target.value })
                  }
                />
              </div>
              <div>
                <InputLabel htmlFor="app-key">App Key</InputLabel>
                <Input
                  id="app-key"
                  value={seznzor.appKey}
                  onChange={(e) =>
                    setSensor({ ...seznzor, appKey: e.target.value })
                  }
                />
              </div>
              <div>
                <InputLabel htmlFor="send-period">Send Period</InputLabel>
                <Input
                  id="send-period"
                  value={seznzor.sendPeriod}
                  onChange={(e) =>
                    setSensor({ ...seznzor, sendPeriod: e.target.value })
                  }
                />
              </div>
              <div>
                <InputLabel htmlFor="ack">ACK</InputLabel>
                <Input
                  id="ack"
                  value={seznzor.ack}
                  onChange={(e) =>
                    setSensor({ ...seznzor, ack: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <InputLabel htmlFor="mov-thr">MOV THR</InputLabel>
                <Input
                  id="mov-thr"
                  value={seznzor.movThr}
                  onChange={(e) =>
                    setSensor({ ...seznzor, movThr: e.target.value })
                  }
                />
              </div>
              <div>
                <InputLabel htmlFor="adc-delay">ADC Delay</InputLabel>
                <Input
                  id="adc-delay"
                  value={seznzor.adcDelay}
                  onChange={(e) =>
                    setSensor({ ...seznzor, adcDelay: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <InputLabel htmlFor="company-name">Company Name</InputLabel>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={seznzor.adcEnable}
                  onChange={(e) =>
                    setSensor({ ...seznzor, adcEnable: e.target.checked })
                  }
                />
                <span>ADC Enable</span>
              </div>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-between">
          <Button
            onClick={async () => {
              await addSensor();
            }}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
            }}
          >
            Accept
          </Button>
          <Button onClick={async () => await signOut()}>Odjavi se</Button>
          <Button
            onClick={async () => {
              await createFolderAndSpreadsheet();
            }}
            style={{
              backgroundColor: "#f44336",
              color: "white",
              padding: "10px 20px",
            }}
          >
            Finish
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default SerialPortComponent;
