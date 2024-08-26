"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

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
import { connectToPort, readDataFromPort } from "./HandleClick";
import parseJsonString from "./Parser";
import { signOut } from "next-auth/react";
import { createFolderAndSpreadsheet } from "~/server/create_foldet";
import {
  type SensorData,
  type SensorKeyValuePair,
  useSensorStore,
} from "./SensorStore";
import { set, z } from "zod";
import { Name } from "src/server/create_foldet";

const sensor_form_schema = z.object({
  "device-eui": z.string(),
  status: z.number(),
  "frequency-region": z.string(),
  temperature: z.number(),
  humidity: z.number(),
  "join-eui": z.string(),
  "app-key": z.string(),
  "send-period": z.number(),
  ack: z.number(),
  "mov-thr": z.number(),
  "adc-delay": z.number(),
  "company-name": z.string(),
  "adc-enable": z.number(),
});
export type SensorFormSchemaType = z.infer<typeof sensor_form_schema>;

const SerialPortComponent: React.FC = () => {
  const portRef = useRef<unknown>(null);

  const handleClick = async (onDataReceived: (data: string) => void) => {
    try {
      if (!portRef.current) {
        portRef.current = await connectToPort();
      } else {
        console.log("Port is already connected.");
      }

      await readDataFromPort(portRef.current, onDataReceived);
    } catch (error) {
      console.error("Failed to handle click:", error);
    }
  };

  const sensor_form_api = useForm<SensorFormSchemaType>();
  const onSubmit = (data: SensorFormSchemaType, okay: boolean) =>
    console.log(data, okay, current_sensor?.data.common_data[1]?.value);

  const [user, setUser] = useState<string>("John Doe");
  const name = Name();
  // setUser(name);
  const [showAdditionalDetails, setShowAdditionalDetails] =
    useState<boolean>(false);

  const handleDataReceived = useCallback((data: string): void => {
    const parsedData = parseJsonString(data);
    console.log(parsedData);
  }, []);

  const handleButtonClick = useCallback(async () => {
    await handleClick(handleDataReceived);
  }, [handleDataReceived]);

  const [sensorNumber, setSensorNumber] = useState(0);

  const current_sensor = useSensorStore((state) => state.sensors[sensorNumber]);
  const all_sensors = useSensorStore((state) => state.sensors);
  const initialize_sensor_data = useSensorStore(
    (state) => state.initialize_sensor_data,
  );
  const set_sensor_status = useSensorStore((state) => state.set_sensor_status);

  useEffect(() => {
    // zamenjaj z funkcijo ki uporabi prejšn socket
    void handleClick((data) => initialize_sensor_data(data));
  }, [initialize_sensor_data, sensorNumber]);

  useEffect(() => {
    console.log(all_sensors);
  }, [all_sensors]);

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

  function addSensor() {
    throw new Error("Function not implemented.");
  }

  function convertoToBoolean(value: unknown): boolean | undefined {
    if (value === 1) {
      return true;
    } else return false;
  }

  return (
    <form>
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
          <Button
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
          </Button>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <span>{user}</span>
          </Box>
        </Box>
        <Box className="px-6 py-8 md:px-8 md:py-12">
          <h1 className="mb-8 text-center text-3xl font-bold">SENZEMO</h1>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "0.5rem",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getStatusColor(
                current_sensor?.data.common_data[1]?.value as number,
              ),
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            <Box
              style={{
                border: "1px solid black",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <InputLabel htmlFor="device-eui">Device EUI</InputLabel>
              <Input
                id="device-eui"
                {...sensor_form_api.register("device-eui")}
                placeholder="Device EUI will be auto-filled from NFC tag"
                defaultValue={current_sensor?.data.common_data[0]?.value}
              />
            </Box>
            <Box
              style={{
                border: "1px solid black",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <InputLabel htmlFor="status">Status</InputLabel>
              <Input
                type="text"
                id="status"
                {...sensor_form_api.register("status")}
                style={{
                  fontSize: "1.5rem",
                  width: "100%",
                  padding: "0.5rem",
                }}
                disabled
                defaultValue={current_sensor?.data.common_data[1]?.value}
              />
            </Box>
            <Box
              style={{
                border: "1px solid black",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <InputLabel htmlFor="frequency-region">
                Frequency Region
              </InputLabel>
              <FormControl fullWidth>
                <Select
                  id="frequency-region"
                  {...sensor_form_api.register("frequency-region")}
                  defaultValue={current_sensor?.data.common_data[2]?.value}
                >
                  <MenuItem value="AS923">AS923</MenuItem>
                  <MenuItem value="EU868">EU868</MenuItem>
                  <MenuItem value="US915">US915</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              style={{
                border: "1px solid black",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <InputLabel htmlFor="temperature">Temperature</InputLabel>
              <Input
                id="temperature"
                {...sensor_form_api.register("temperature")}
                placeholder="Temperature"
                defaultValue={current_sensor?.data.common_data[2]?.value}
              />
            </Box>
            <Box
              style={{
                border: "1px solid black",
                padding: "0.5rem",
                borderRadius: "8px",
              }}
            >
              <InputLabel htmlFor="humidity">Humidity</InputLabel>
              <Input
                id="humidity"
                {...sensor_form_api.register("humidity")}
                placeholder="Humidity"
                defaultValue={current_sensor?.data.common_data[2]?.value}
              />
            </Box>
          </Box>

          <Button
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
          </Button>
          {showAdditionalDetails && (
            <Box className="mt-4">
              <Box className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Box>
                  <InputLabel htmlFor="join-eui">Join EUI</InputLabel>
                  <Input
                    id="join-eui"
                    {...sensor_form_api.register("join-eui")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
                <Box>
                  <InputLabel htmlFor="app-key">App Key</InputLabel>
                  <Input
                    id="app-key"
                    {...sensor_form_api.register("app-key")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
                <Box>
                  <InputLabel htmlFor="send-period">Send Period</InputLabel>
                  <Input
                    id="send-period"
                    {...sensor_form_api.register("send-period")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
                <Box>
                  <InputLabel htmlFor="ack">ACK</InputLabel>
                  <Input
                    id="ack"
                    {...sensor_form_api.register("ack")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
              </Box>
              <Box className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Box>
                  <InputLabel htmlFor="mov-thr">MOV THR</InputLabel>
                  <Input
                    id="mov-thr"
                    {...sensor_form_api.register("mov-thr")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
                <Box>
                  <InputLabel htmlFor="adc-delay">ADC Delay</InputLabel>
                  <Input
                    id="adc-delay"
                    {...sensor_form_api.register("adc-delay")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
              </Box>
              <Box className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Box>
                  <InputLabel htmlFor="company-name">Company Name</InputLabel>
                  <Input
                    id="company-name"
                    {...sensor_form_api.register("company-name")}
                    defaultValue={current_sensor?.data.common_data[1]?.value}
                  />
                </Box>
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    {...sensor_form_api.register("adc-enable")}
                    checked={convertoToBoolean(
                      current_sensor?.data.common_data[1]?.value,
                    )}
                  />
                  <span>ADC Enable</span>
                </Box>
              </Box>
            </Box>
          )}
          <Box className="mt-4 flex justify-between">
            <Button
              onClick={sensor_form_api.handleSubmit(
                (data: SensorFormSchemaType) => onSubmit(data, true),
              )}
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
              href="/konec"
              // onClick={async () => {
              //   await createFolderAndSpreadsheet();
              // }}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
              }}
            >
              Finish
            </Button>
            <Button
              onClick={sensor_form_api.handleSubmit(
                (data: SensorFormSchemaType) => onSubmit(data, false),
              )}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
              }}
            >
              not Accept
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default SerialPortComponent;
