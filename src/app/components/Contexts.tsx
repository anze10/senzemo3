"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Sensor {
    deviceType: string;
    count: string;
    deviceEui: string;
    dataRate: number;
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
    frequencyRegion: string;
    hybridEnable: string[];
    hybridMask: string[];
    hybridMaskOptions: number;
}

const initialSensorData: Sensor = {
    deviceType: "smc",
    count: "1",
    deviceEui: "ABC123",
    dataRate: 1,
    status: 1,
    appEui: "AppEUI",
    appKey: "AppKey",
    sendPeriod: "60",
    ack: "true",
    movThr: "10",
    adcEnable: true,
    adcDelay: "100",
    temperature: "22.5",
    humidity: "45",
    deviceTypeOptions: ["smc", "ssm"],
    dataRateOptions: ["Rate 1", "Rate 2"],
    frequencyRegion: "EU",
    hybridEnable: ["Enable 1", "Enable 2"],
    hybridMask: ["Mask 1", "Mask 2"],
    hybridMaskOptions: 123
};

const SensorContext = createContext<[Sensor, React.Dispatch<React.SetStateAction<Sensor>>] | undefined>(undefined);

export const SensorProvider = ({ children }: { children: ReactNode }) => {
    const [sensorData, setSensorData] = useState<Sensor>(initialSensorData);
    return (
        <SensorContext.Provider value={[sensorData, setSensorData]}>
            {children} {/*// tega retrna ne razuem popolno če mi ga lahko rezložiš */}
        </SensorContext.Provider>
    );
};

export const useSensor = () => {
    const context = useContext(SensorContext);
    if (context === undefined) {
        throw new Error("useSensor must be used within a SensorProvider");
    }
    return context;
};
