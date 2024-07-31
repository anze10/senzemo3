'use client';
import React, { useEffect, useState } from 'react';
import { Checkbox, Button, InputLabel, Input, FormControl, MenuItem, Select } from '@mui/material';
import handleClick from './HandleClick';
import parseJsonString from './Parser';
import { gapi } from 'gapi-script';
//import PersonIcon from '@mui/icons-material/Person'; // Adjust the path to the actual location of the user icon image

let sessionCounter = 1;

const SerialPortComponent: React.FC = () => {
    const [orderName, setOrderName] = useState<string>('');
    const [deviceType, setDeviceType] = useState<string>('');
    const [count, setCount] = useState<string>('');
    const [user, setUser] = useState<string>('John Doe');  // Placeholder for the logged-in user's name
    const [deviceEui, setDeviceEui] = useState<string>('');
    const [status, setStatus] = useState<number>(0);
    const [appEui, setAppEui] = useState<string>('');
    const [appKey, setAppKey] = useState<string>('');
    const [sendPeriod, setSendPeriod] = useState<string>('');
    const [ack, setAck] = useState<string>('');
    const [movThr, setMovThr] = useState<string>('');
    const [adcEnable, setAdcEnable] = useState<boolean>(false);
    const [adcDelay, setAdcDelay] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [temperature, setTemperature] = useState<string>('');
    const [humidity, setHumidity] = useState<string>('');
    const [deviceTypeOptions, setDeviceTypeOptions] = useState<string[]>([]);
    const [dataRateOptions, setDataRateOptions] = useState<string[]>([]);
    const [frequencyRegionOptions, setFrequencyRegionOptions] = useState<string>('');
    const [hybridEnableOptions, setHybridEnableOptions] = useState<string[]>([]);
    const [hybridMaskOptions, setHybridMaskOptions] = useState<number>(0);
    const [showAdditionalDetails, setShowAdditionalDetails] = useState<boolean>(false);

    useEffect(() => {
        const loadGapi = () => {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                gapi.load('client:auth2', initClient);
            };
            document.body.appendChild(script);
        };
    
        const initClient = () => {
            gapi.client.init({
                apiKey: process.env.API_KEY,
                clientId: process.env.AUTH_GOOGLE_ID,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                scope: 'https://www.googleapis.com/auth/spreadsheets',
            }).then(() => {
                console.log('GAPI client initialized.');
                const authInstance = gapi.auth2.getAuthInstance();
                if (authInstance) {
                    if (authInstance.isSignedIn.get()) {
                        console.log('User is signed in.');
                    } else {
                        console.log('User is not signed in.');
                        authInstance.signIn().then(() => {
                            console.log('User signed in.');
                        }).catch((error:any) => {
                            console.error('Error signing in:', error);
                        });
                    }
                } else {
                    console.error('Auth instance is not available.');
                }
            }).catch((error:any) => {
                console.error('Error initializing GAPI client:', error);
            });
        };
    
        loadGapi();
    }, []);

    const handleDataReceived = (data: string) => {
        const parsedData = parseJsonString(data);
        console.log(parsedData);
        console.log(parsedData.lora.freq_reg);

        setDeviceType(parsedData.deviceType || 'Senstic');
        setDeviceEui(parsedData.dev_eui || '');
        setStatus(parsedData.device?.status !== undefined ? parseInt(parsedData.device.status, 10) : 10);
        setAppEui(parsedData.join_eui || '');
        setAppKey(parsedData.app_key || '');
        setSendPeriod(parsedData.lora.send_period || '');
        setAck(parsedData.lora.ack || '');
        setMovThr(parsedData.device.mov_thr || '');
        setAdcEnable(parsedData.adcEnable || false);
        setAdcDelay(parsedData.device.adc_delay || '');
        setTemperature(parsedData.sensors.temp || '');
        setHumidity(parsedData.sensors.hum || '');
        setDeviceTypeOptions(parsedData.deviceTypeOptions || []);
        setDataRateOptions(parsedData.dataRateOptions || []);
        setFrequencyRegionOptions(parsedData.lora.freq_reg || '');
        setHybridEnableOptions(parsedData.hybridEnableOptions || []);
        setHybridMaskOptions(parsedData.lora.mask2_5 !== undefined ? parsedData.lora.mask2_5 : 0);
    };

    useEffect(() => {
        console.log('useEffect', status);
    }, [status]);

    const handleButtonClick = () => {
        handleClick(handleDataReceived);
    };

    const getStatusColor = (statu: number) => {
        if (statu === 0) {
            return 'green';
        } else if (statu === 1 || statu === 2) {
            return 'yellow';
        } else if (statu > 2) {
            return 'red';
        } else {
            return 'bg-purple-200';
        }
    };

    const generateUniqueId = (product: string, counter: number) => {
        return `${product}-${counter.toString().padStart(3, '0')}`;
    };

    const handleAccept = () => {
        const uniqueId = generateUniqueId(deviceType, sessionCounter);
        sessionCounter++;
        createSpreadsheet(uniqueId, deviceEui, appEui, appKey);
    };

    const createSpreadsheet = (id: string, deviceEui: string, joinEui: string, appKey: string) => {
        const spreadsheetBody = {
            properties: {
                title: `Session ${sessionCounter}`,
            },
            sheets: [
                {
                    properties: {
                        title: 'Sheet1',
                    },
                    data: [
                        {
                            rowData: [
                                {
                                    values: [
                                        { userEnteredValue: { stringValue: 'ID' } },
                                        { userEnteredValue: { stringValue: 'Device EUI' } },
                                        { userEnteredValue: { stringValue: 'Join EUI' } },
                                        { userEnteredValue: { stringValue: 'App Key' } },
                                    ],
                                },
                                {
                                    values: [
                                        { userEnteredValue: { stringValue: id } },
                                        { userEnteredValue: { stringValue: deviceEui } },
                                        { userEnteredValue: { stringValue: joinEui } },
                                        { userEnteredValue: { stringValue: appKey } },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        gapi.client.sheets.spreadsheets.create({}, spreadsheetBody).then(
            (response: any) => {
                console.log('Spreadsheet created successfully:', response);
            },
            (error: any) => {
                console.error('Error creating spreadsheet:', error);
            }
        );
    };

    const handleFinish = () => {
        

    };

    return (
        <div style={{ fontFamily: 'Montserrat, sans-serif', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f5f5f5' }}>
                <button onClick={handleButtonClick} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
                    Open Serial Port
                </button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{user}</span>
                </div>
            </div>
            <div className="px-6 py-8 md:px-8 md:py-12">
                <h1 className="text-center text-3xl font-bold mb-8">SENZEMO</h1>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.5rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: getStatusColor(status),
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    width: '100%'
                }}>
                    <div style={{
                        border: '1px solid black',
                        padding: '0.5rem',
                        borderRadius: '8px'
                    }}>
                        <InputLabel htmlFor="device-eui">Device EUI</InputLabel>
                        <Input
                            id="device-eui"
                            value={deviceEui}
                            onChange={(e) => setDeviceEui(e.target.value)}
                            placeholder="Device EUI will be auto-filled from NFC tag"
                        />
                    </div>
                    <div style={{
                        border: '1px solid black',
                        padding: '0.5rem',
                        borderRadius: '8px'
                    }}>
                        <InputLabel htmlFor="status">Status</InputLabel>
                        <input
                            type="text"
                            id="status"
                            value={status}
                            style={{
                                backgroundColor: getStatusColor(status),
                                fontSize: '1.5rem',
                                width: '100%',
                                padding: '0.5rem',
                            }}
                            disabled
                        />
                    </div>
                    <div style={{
                        border: '1px solid black',
                        padding: '0.5rem',
                        borderRadius: '8px'
                    }}>
                        <InputLabel htmlFor="frequency-region">Frequency Region</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                id="frequency-region"
                                value={frequencyRegionOptions}
                                onChange={(e) => setFrequencyRegionOptions(e.target.value as string)}
                            >
                                <MenuItem value="AS923">AS923</MenuItem>
                                <MenuItem value="EU868">EU868</MenuItem>
                                <MenuItem value="US915">US915</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{
                        border: '1px solid black',
                        padding: '0.5rem',
                        borderRadius: '8px'
                    }}>
                        <InputLabel htmlFor="temperature">Temperature</InputLabel>
                        <Input id="temperature" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="Temperature" />
                    </div>
                    <div style={{
                        border: '1px solid black',
                        padding: '0.5rem',
                        borderRadius: '8px'
                    }}>
                        <InputLabel htmlFor="humidity">Humidity</InputLabel>
                        <Input id="humidity" value={humidity} onChange={(e) => setHumidity(e.target.value)} placeholder="Humidity" />
                    </div>
                </div>

                <button
                    onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}
                    style={{
                        backgroundColor: '#008CBA',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    {showAdditionalDetails ? 'Show Less' : 'Show More'}
                </button>
                {showAdditionalDetails && (
                    <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <InputLabel htmlFor="join-eui">Join EUI</InputLabel>
                                <Input id="join-eui" value={appEui} onChange={(e) => setAppEui(e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="app-key">App Key</InputLabel>
                                <Input id="app-key" value={appKey} onChange={(e) => setAppKey(e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="send-period">Send Period</InputLabel>
                                <Input id="send-period" value={sendPeriod} onChange={(e) => setSendPeriod(e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="ack">ACK</InputLabel>
                                <Input id="ack" value={ack} onChange={(e) => setAck(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <InputLabel htmlFor="mov-thr">MOV THR</InputLabel>
                                <Input id="mov-thr" value={movThr} onChange={(e) => setMovThr(e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="adc-delay">ADC Delay</InputLabel>
                                <Input id="adc-delay" value={adcDelay} onChange={(e) => setAdcDelay(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <InputLabel htmlFor="company-name">Company Name</InputLabel>
                                <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Checkbox checked={adcEnable} onChange={(e) => setAdcEnable(e.target.checked)} />
                                <span>ADC Enable</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mt-4 flex justify-between">
                    <Button onClick={handleAccept} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px' }}>
                        Accept
                    </Button>
                    <Button onClick={handleFinish} style={{ backgroundColor: '#f44336', color: 'white', padding: '10px 20px' }}>
                        Finish
                    </Button>
                </div>

            </div>
        </div >
    );
};

export default SerialPortComponent;
