"use client";
import {
    Checkbox,
    Button,
    InputLabel,
    Input,
    FormControl,
    MenuItem,
    Select,
    Box,
    Typography,
} from "@mui/material";
import { createFolderAndSpreadsheet, GoogleDriveType } from "src/server/create_foldet";
import { useSensorStore } from "src/app/dev/components/SensorStore";
import React, { useState, createContext, useContext } from 'react';
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { SensorFormSchemaType } from "src/app/dev/components/Reader";



export const GoogleDriveContext = createContext<GoogleDriveType | null>(null);


export default function Component() {
    const [googleDrive, setGoogleDrive] = useState<GoogleDriveType | null>(null);
    const googleDrived = useContext(GoogleDriveContext);
    const default_sensor_data = useSensorStore((state) => state.default_sensor_data);
    const sensor_form_api = useForm<SensorFormSchemaType>();
    const [order_number, set_order_number] = useState<string>("");
    const router = useRouter();
    const set_default_sensor_data = useSensorStore(
        (state) => state.set_default_sensor_data,
    );

    const handleStartScan: () => void = () => {
        const formData = sensor_form_api.getValues(); // Get the current form values
        set_default_sensor_data(formData); // Update the store with form data

        // Log the data that was just stored in the store
        console.log("Data stored in default_sensor_data:", formData);
        const custome_name = formData.company_name;
        const result = createFolderAndSpreadsheet(custome_name, order_number);
        setGoogleDrive(result as any as GoogleDriveType);

        router.push('/dev');
    };


    return (
        <GoogleDriveContext.Provider value={googleDrived}>
            <form>


                <Box className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
                    <Typography variant="h3" className="font-bold mb-8">SENZEMO</Typography>
                    <Box className="w-full  bg-white p-6 rounded-lg shadow-md">
                        <Typography variant="h5" className="font-semibold mb-6 text-center">Configuration</Typography>
                        <Box className="flex flex-wrap gap-6">

                            <Box className="flex-1 min-w-[200px]">
                                <InputLabel htmlFor="frequency-region">Izberi senzor</InputLabel>
                                <Controller
                                    name="family_id"
                                    control={sensor_form_api.control}
                                    defaultValue={1}
                                    render={({ field }) => (
                                        <Select id="family_id" {...field} fullWidth>
                                            <MenuItem value={1}>SMC30</MenuItem>
                                            <MenuItem value={2}>SSM40</MenuItem>
                                            <MenuItem value={3}>SXX3.6</MenuItem>
                                        </Select>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="join_eui"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="join_eui">Join EUI</InputLabel>
                                            <Input {...field} fullWidth placeholder="Enter Join EUI" />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="app_key"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="app-key">App Key</InputLabel>
                                            <Input {...field} fullWidth placeholder="Enter App Key" />
                                        </>
                                    )}
                                />

                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="device.status"
                                    defaultValue={0}
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="device.status">Status</InputLabel>
                                            <Input
                                                disabled

                                                {...field}
                                                fullWidth
                                                placeholder="Status"
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="lora.dr_adr_en"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="lora.dr_adr_en">Data Rate</InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder="Data Rate"
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <InputLabel htmlFor="frequency-region">Frequency Region</InputLabel>
                                <Controller
                                    name="lora.freq_reg"
                                    control={sensor_form_api.control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select id="lora.freq_reg" {...field} fullWidth>
                                            <MenuItem value="AS923">AS923</MenuItem>
                                            <MenuItem value="EU868">EU868</MenuItem>
                                            <MenuItem value="US915">US915</MenuItem>
                                        </Select>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="lora.hyb_asoff_mask0_1"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="lora.hyb_asoff_mask0_1">
                                                Hybrid Enable + AS923 Offset + Mask0-1
                                            </InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder="Hybrid Enable + AS923 Offset + Mask0-1"
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="lora.mask2_5"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="lora.mask2_5">Hybrid Mask 2-5</InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder="Hybrid Mask 2-5"
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="lora.send_period"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="lora.send_period">Send Period</InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder=""
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />


                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="lora.ack"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="lora.ack">ACK</InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder=""
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="device.mov_thr"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="device.mov_thr">MOV THR</InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder=""
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <Controller
                                    control={sensor_form_api.control}
                                    name="company_name"
                                    render={({ field }) => (
                                        <>
                                            <InputLabel htmlFor="Company_name">Company Name</InputLabel>
                                            <Input

                                                {...field}
                                                fullWidth
                                                placeholder=""
                                                style={{
                                                    fontSize: "1.25rem",
                                                    padding: "0.75rem",
                                                }}
                                                required
                                            />
                                        </>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1 min-w-[200px]">
                                <InputLabel htmlFor="serial-number">Order Number</InputLabel>
                                <Input
                                    id="serial-number"
                                    placeholder="Enter Serial Number"
                                    fullWidth
                                    value={order_number}
                                    onChange={(e) => set_order_number(e.target.value)}
                                    required
                                />
                            </Box>
                        </Box>
                        <Box className="flex justify-center mt-8">
                            <Button variant="contained" color="primary" onClick={handleStartScan}>
                                Start Scan
                            </Button>
                        </Box>
                    </Box>
                </Box>

            </form>
        </GoogleDriveContext.Provider>
    );
}