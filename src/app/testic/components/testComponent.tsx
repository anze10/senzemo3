"use client"
import ipp from 'ipp';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface Printer {
    name: string;
    uri: string;
}

const hardcodedZplCode = `^XA
^FO50,50
^ADN,36,20
^FDHello World!^FS
^XZ`;

export default function PrinterList() {
    const [printers, setPrinters] = useState<Printer[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrinters = async () => {
            try {
                const cupsUri = 'http://localhost:631/printers/';
                const response = await axios.get(cupsUri);

                if (response.data) {
                    const printerList = ipp.parse(response.data) as unknown as Printer[];
                    setPrinters(printerList);
                } else {
                    throw new Error('Invalid response data');
                }
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error('Axios error fetching printers:', err.message);
                    setError('Failed to load printers from the server');
                } else {
                    console.error('Unknown error fetching printers:', err);
                    setError('An unknown error occurred');
                }
            }
        };

        fetchPrinters();
    }, []);

    const printZpl = async () => {
        if (!selectedPrinter) {
            alert('Please select a printer');
            return;
        }

        try {
            const printer = ipp.Printer(selectedPrinter);
            const printJob = {
                "operation-attributes-tag": {
                    "requesting-user-name": "User",
                    "document-format": "application/vnd.zpl",
                },
                "job-attributes-tag": {
                    "job-name": "ZPL Print Job",
                },
                "data": hardcodedZplCode,
            };

            // Send the print job to the selected printer
            await printer.execute('Print-Job', printJob);
            alert('Print job sent successfully!');
        } catch (err) {
            console.error('Error sending print job:', err);
            alert('Failed to send print job');
        }
    };

    return (
        <div>
            <h1>Available Printers</h1>
            {error ? (
                <div>Error: {error}</div>
            ) : (
                <>
                    <ul>
                        {printers.map((printer) => (
                            <li key={printer.uri}>
                                <label>
                                    <input
                                        type="radio"
                                        name="printer"
                                        value={printer.uri}
                                        onChange={() => setSelectedPrinter(printer.uri)}
                                    />
                                    {printer.name} ({printer.uri})
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={printZpl}>Print ZPL</button>
                </>
            )}
        </div>
    );
}
