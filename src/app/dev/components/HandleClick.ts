const handleClick = async (onDataReceived: (data: string) => void) => {
  try {
    console.log("Requesting port...");
    const port = await navigator.serial.requestPort();
    console.log("Port requested:", port);

    console.log("Opening port...");
    await port.open({ baudRate: 4800 });
    console.log("Port opened.");

    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();

    let receivedData = ""; // Variable to accumulate the data
    let isJsonStarted = false; // Flag to check if JSON data has started
    let openBracesCount = 0; // Counter for open braces
    let closeBracesCount = 0; // Counter for close braces

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

          // Check if the JSON data has started
          if (value.includes("{")) {
            isJsonStarted = true;
          }

          // Accumulate data if JSON has started
          if (isJsonStarted) {
            receivedData += value;

            // Count open and close braces
            openBracesCount += (value.match(/{/g) || []).length;
            closeBracesCount += (value.match(/}/g) || []).length;

            // If the number of open and close braces matches, output the full JSON string
            if (openBracesCount === closeBracesCount && openBracesCount > 0) {
              console.log("Received full JSON string:", receivedData);

              // Send the received data to the callback function
              onDataReceived(receivedData);

              // Reset the counters and receivedData after logging the full string
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
  } catch (error) {
    console.error("Error opening port:", error);
  }
};

export default handleClick;
