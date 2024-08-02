"use client"
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
import { useState } from 'react';

export default function Component() {
    const [deviceType, setDeviceType] = useState('');
    const [dataRate, setDataRate] = useState('');
    const [frequencyRegion, setFrequencyRegion] = useState('');
    const [hybridEnable, setHybridEnable] = useState('');
    const [hybridMask, setHybridMask] = useState('');

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
                                <MenuItem value="smc">SMC</MenuItem>
                                <MenuItem value="ssm">SSM</MenuItem>
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
                                onChange={(e) => setDataRate(e.target.value)}
                                label="DATA RATE"
                            >
                                <MenuItem value="rate1">Rate 1</MenuItem>
                                <MenuItem value="rate2">Rate 2</MenuItem>
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
                                onChange={(e) => setHybridEnable(e.target.value)}
                                label="HYBRID ENABLE + AS923 OFFSET + MASK0-1"
                            >
                                <MenuItem value="enable1">Enable 1</MenuItem>
                                <MenuItem value="enable2">Enable 2</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-span-1">
                        <FormControl fullWidth>
                            <InputLabel htmlFor="hybrid-mask">HYBRID MASK 2-5</InputLabel>
                            <Select
                                id="hybrid-mask"
                                value={hybridMask}
                                onChange={(e) => setHybridMask(e.target.value)}
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
                        <Button>START SCAN</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
