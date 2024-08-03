"use client";

import {
    Checkbox,
    Button,
    InputLabel,
    Input,
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";
import { use, useState } from 'react';
import React from 'react';
import { useSensor } from 'src/app/components/Contexts';

export default function Component() {
    const [sensorData, setSensorData] = useSensor();

    const [deviceType, setDeviceType] = useState(sensorData.deviceType);
    const [dataRate, setDataRate] = useState(Number(sensorData.dataRateOptions[0]));
    const [frequencyRegion, setFrequencyRegion] = useState(sensorData.frequencyRegion);
    const [hybridEnable, setHybridEnable] = useState<string[]>(sensorData.hybridEnable ?? []);;
    const [hybridMask, setHybridMask] = useState<string[]>([]);

    const updateSensorData = () => {
        setSensorData({
            ...sensorData,
            deviceType,
            dataRate,
            frequencyRegion,
            hybridEnable,
            hybridMask,
            status: 2,
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-8">SENZEMO</h1>
            <div className="w-full max-w-5xl">
                <h2 className="text-center text-xl font-semibold mb-4">CONFIG</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="device-type">CHOOSE DEVICE TYPE</InputLabel>
                            <Select
                                id="device-type"
                                value={deviceType}
                                onChange={(e) => setDeviceType(e.target.value)}
                                label="CHOOSE DEVICE TYPE"
                            >
                                {sensorData.deviceTypeOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="app-eui">APP EUI</InputLabel>
                        <Input id="app-eui" placeholder="(ENTER VALUE)" fullWidth />
                        <p className="text-sm text-muted-foreground">optional</p>
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="app-key">APP KEY</InputLabel>
                        <Input id="app-key" placeholder="(ENTER VALUE)" fullWidth />
                        <p className="text-sm text-muted-foreground">optional</p>
                    </div>
                    <div className="col-span-1">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="data-rate">DATA RATE</InputLabel>
                            <Select
                                id="data-rate"
                                value={dataRate}
                                onChange={(e) => setDataRate(e.target.value as number)}
                                label="DATA RATE"
                            >
                                {sensorData.dataRateOptions.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-span-1">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="frequency-region">FREQUENCY REGION</InputLabel>
                            <Select
                                id="frequency-region"
                                value={frequencyRegion}
                                onChange={(e) => setFrequencyRegion(e.target.value)}
                                label="FREQUENCY REGION"
                            >
                                <MenuItem value="eu">EU</MenuItem>
                                <MenuItem value="us">US</MenuItem>
                            </Select>
                        </FormControl>
                        <p className="text-sm text-muted-foreground">optional EU, US,...</p>
                    </div>
                    <div className="col-span-1">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="hybrid-enable">HYBRID ENABLE + AS923 OFFSET + MASK0-1</InputLabel>
                            <Select
                                id="hybrid-enable"
                                value={hybridEnable}
                                onChange={(e) => setHybridEnable(e.target.value as string[])}
                                label="HYBRID ENABLE + AS923 OFFSET + MASK0-1"
                            >
                                {sensorData.hybridEnable.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-span-1">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="hybrid-mask">HYBRID MASK 2-5</InputLabel>
                            <Select
                                id="hybrid-mask"
                                value={hybridMask}
                                onChange={(e) => setHybridMask(e.target.value as string[])}
                                label="HYBRID MASK 2-5"
                            >
                                <MenuItem value="mask1">Mask 1</MenuItem>
                                <MenuItem value="mask2">Mask 2</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="send-period">SEND PERIOD</InputLabel>
                        <Input id="send-period" placeholder="(ENTER VALUE)" fullWidth />
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="ack">ACK</InputLabel>
                        <Input id="ack" placeholder="(ENTER VALUE)" fullWidth />
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="mov-thr">MOV THR</InputLabel>
                        <Input id="mov-thr" placeholder="(ENTER VALUE)" fullWidth />
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="adc-enable">ADC ENABLE</InputLabel>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="adc-enable" />
                            <label
                                htmlFor="adc-enable"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                [DEVICE SPECIFIC] SMISLENO OMOGOČITI GLEDE NA TIP
                            </label>
                        </div>
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="adc-delay">ADC delay</InputLabel>
                        <Input id="adc-delay" placeholder="(ENTER VALUE)" fullWidth />
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="company-name">ENTER COMPANY NAME</InputLabel>
                        <Input id="company-name" placeholder="(INPUT STRING)" fullWidth />
                    </div>
                    <div className="col-span-1">
                        <InputLabel htmlFor="serial-number">SERIAL NUMBER</InputLabel>
                        <Input id="serial-number" placeholder="(ENTER VALUE)" fullWidth />
                    </div>
                    <div className="col-span-4 flex justify-center mt-4">
                        <Button onClick={updateSensorData}>START SCAN</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
