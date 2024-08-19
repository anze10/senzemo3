import parseJsonString from "./Parser";

type SensorData = {
    // sensor_type: string;
    sensor_name?: SensorName;
    common_data: CommonSensorData;
    custom_data?: CustomSensorData[];
};

type CustomSensorData = {
    name: string;
    value: number;
};

type SensorName =
    | "SMC30"
    | "SSM40"
    | "STO10"
    | "STP40"
    | "SLW10"
    | "SRM10"
    | "STF40"
    | "KOU20"
    | "SPU10";

export type CommonSensorData = {
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
        data_rate: number | "error";
        freq_reg: string;
        hybrid_mask: number;
        mask2_5: number;
        send_period: number;

    };




    //po family id se najde  SensorName





    deviceTypeOptions: string[];
    dataRateOptions: string[];

    hybridEnableOptions: string[];

};

type ParsedData<T = {}> = CommonSensorData & T;

const PresantateData = (jsonString: string) => {
    const initializeSensorData = (data: string): SensorData => {
        const parsedData = parseJsonString(data) as ParsedData;

        const common_data: CommonSensorData = {

            data_rate: parsedData.lora?.data_rate || "error",

            deviceEui: parsedData.dev_eui || "error",
            status:
                parsedData.device?.status !== undefined
                    ? (parsedData.device.status, 10)
                    : 10,
            family_id: parsedData.family_id || 0,
            appEui: parsedData.join_eui || "error",
            appKey: parsedData.app_key || "error",
            sendPeriod: parsedData.lora?.send_period || "error",
            ack: parsedData.lora?.ack || "error",
            movThr: parsedData.device?.mowment_threshold || "error",
            adcEnable: parsedData.device.adc_enable || false,
            adcDelay: parsedData.device?.adc_delay || "error",
            deviceTypeOptions: parsedData.deviceTypeOptions || [],
            dataRateOptions: parsedData.dataRateOptions || [],
            frequencyRegionOptions: parsedData.lora?.freq_reg || "error",
            hybridEnableOptions: parsedData.hybridEnableOptions || [],
            hybridMaskOptions:
                parsedData.lora?.mask2_5 !== undefined ? parsedData.lora.mask2_5 : 0,
        };

        const sensor_name = get_sensor_name_from_family_id(common_data.family_id); // lahko undefined

        const custom_data = sensor_name
            ? get_custom_data_from_sensor_name(sensor_name, parsedData)
            : [];

        return {
            sensor_name,
            common_data,
            custom_data,
        };
    };
};

function get_sensor_name_from_family_id(
    family_id: number
): SensorName | undefined {
    switch (family_id) {
        case 1:
            return "SMC30";
        case 2:
            return "SSM40";
        default:
            return undefined;
    }
}

function get_custom_data_from_sensor_name(
    sensor_name: SensorName,
    parsedData: ParsedData
): CustomSensorData[] {
    switch (sensor_name) {
        case "SMC30": {
            const smc30_parsed_data = parsedData as ParsedData<{
                smc30_prop_1: number;
            }>;

            return [
                {
                    name: "smc30_prop_1",
                    value: smc30_parsed_data.smc30_prop_1,
                },
            ];
        }
        default:
            return [];
    }
}

export default PresantateData;
