const parseJsonString = (jsonString: string): { [key: string]: any } => {
    try {
        // Parsiramo JSON string v objekt
        const jsonObject = JSON.parse(jsonString);

        // Vrni parsiran objekt (slovar)
        return jsonObject;
    } catch (error) {
        console.error("Error parsing JSON string:", error);
        return {};
    }
};

export default parseJsonString;