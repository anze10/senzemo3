import { useRef } from "react";

// Funkcija za vzpostavitev povezave s serijskim portom
const connectToPort = async (): Promise<any> => {
  try {
    console.log("Requesting port...");
    const port = await (navigator as any).serial.requestPort();
    console.log("Port requested:", port);

    console.log("Opening port...");
    await port.open({ baudRate: 4800 });
    console.log("Port opened.");

    return port;
  } catch (error) {
    console.error("Error opening port:", error);
    throw error;
  }
};

// Funkcija za branje podatkov iz serijskega porta
const readDataFromPort = async (port: any, onDataReceived: (data: string) => void) => {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const reader = textDecoder.readable.getReader();

  let receivedData = ""; // Spremenljivka za akumulacijo podatkov
  let isJsonStarted = false; // Zastavica za preverjanje, če se je JSON začel
  let openBracesCount = 0; // Število odprtih zavitih oklepajev
  let closeBracesCount = 0; // Število zaprtih zavitih oklepajev

  console.log("Reading data...");
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("Stream closed.");
        break;
      }
      if (value) {
        console.log("Received raw data chunk:", value);

        // Preveri, če se je JSON začel
        if (value.includes("{")) {
          isJsonStarted = true;
        }

        // Akumulacija podatkov, če je JSON začel
        if (isJsonStarted) {
          receivedData += value;

          // Štetje odprtih in zaprtih zavitih oklepajev
          openBracesCount += (value.match(/{/g) || []).length;
          closeBracesCount += (value.match(/}/g) || []).length;

          // Če se število odprtih in zaprtih oklepajev ujema, je prejet celoten JSON niz
          if (openBracesCount === closeBracesCount && openBracesCount > 0) {
            console.log("Received full JSON string:", receivedData);

            // Pošlji prejete podatke callback funkciji
            onDataReceived(receivedData);

            // Ponastavi števce in receivedData po prejetju celotnega niza
            receivedData = "";
            openBracesCount = 0;
            closeBracesCount = 0;
            isJsonStarted = false;
          }
        }
      }
    }
  } catch (error) {
    console.error("Error reading data:", error);
  } finally {
    reader.releaseLock();
    console.log("Reader lock released.");
  }
};


const portRef = useRef<any>(null); // Ustvarimo referenco za povezavo

const handleClick = async (onDataReceived: (data: string) => void) => {
  try {
    // Preveri, če povezava že obstaja
    if (!portRef.current) {
      portRef.current = await connectToPort();
    } else {
      console.log("Port is already connected.");
    }

    // Beri podatke s povezanega porta
    await readDataFromPort(portRef.current, onDataReceived);
  } catch (error) {
    console.error("Failed to handle click:", error);
  }
};

export default handleClick;
