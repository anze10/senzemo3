declare global {
    const BrowserPrint: {
        getDefaultDevice: (deviceType: string, callback: (device: DeviceType) => void) => void;
        // Add other methods as needed
        getLocalDevices: (callback: (devices: DeviceType) => void, deviceType: string) => void;
        // More methods if applicable
        onDeviceSelected: (device: DeviceType, callback: (device: DeviceType) => void) => void;
        getConfig: (callback: (config: Config) => void) => void;
        
    };
}
export type DeviceType = {
    name: string;
    uid: string;
    send: (data: string, successCallback?: () => void, errorCallback?: (error: string) => void) => void;
    read: (successCallback: (data: string) => void, errorCallback?: (error: string) => void) => void;
    convertAndSendFile: (url: string, successCallback?: () => void, errorCallback?: (error: string) => void) => void;
    sendFile: (url: string, successCallback?: () => void, errorCallback?: (error: string) => void) => void;
}
export type Config = {
    something: string;

}

export { };