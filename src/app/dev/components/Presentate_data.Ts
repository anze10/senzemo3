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
        adc_delay: number | "error";
        adc_enable: boolean;
        firmware_version: number | "error";
        hardware_version: number | "error";
        mowment_threshold: number | "error";
        status: number | "error";

    };
    lora: {
        ack: number | "error";
        data_rate: number | "error";
        freq_reg: string | "error";
        hybrid_mask: string[] | "error";
        mask2_5: number | "error";
        send_period: number | "error";

    };

};

type ParsedData<T = {}> = CommonSensorData & T;
const initializeSensorData = (data: string): SensorData => {
    const parsedData = parseJsonString(data) as ParsedData;

    const common_data: CommonSensorData = {
        app_key: parsedData.app_key || "error",
        dev_eui: parsedData.dev_eui || "error",
        family_id: parsedData.family_id || 0,
        join_eui: parsedData.join_eui || "error",
        product_id: parsedData.product_id || 0,

        device: {
            adc_delay: parsedData.device?.adc_delay || "error",
            adc_enable: parsedData.device.adc_enable || false,
            firmware_version: parsedData.device?.firmware_version || "error",
            hardware_version: parsedData.device?.hardware_version || "error",
            mowment_threshold: parsedData.device?.mowment_threshold || "error",
            status: parsedData.device?.status !== undefined
                ? (parsedData.device.status, 10)
                : 10,

        },
        lora: {
            ack: parsedData.lora?.ack || "error",
            data_rate: parsedData.lora?.data_rate || "error",
            freq_reg: parsedData.lora?.freq_reg || "error",
            hybrid_mask: parsedData.lora?.hybrid_mask || "error",
            mask2_5:
                parsedData.lora?.mask2_5 !== undefined ? parsedData.lora.mask2_5 : "error",
            send_period: parsedData.lora?.send_period || "error",
        },

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
