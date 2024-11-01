"use client"
import React, { useTransition } from 'react';
import { getPrinterUrls, handlePrintRequest } from './printer_server_side'; // Ensure the path to handlePrintRequest is correct
import type {Tiskalnik} from './printer_server_side'; // Ensure the path to Tiskalnik is correct
import  { useEffect, useState } from 'react';



interface PrinterButtonProps {
    printerUri: string;
    printerName: string;
    handlePrintRequest: (printerUri: string) => Promise<{ success: boolean; message: string }>; // The server action function
}

export function PrinterButton({ printerUri, printerName, handlePrintRequest }: PrinterButtonProps) {
    const [isPending, startTransition] = useTransition();

    // Function to handle the print action
    const handlePrintClick = async () => {
        if (!printerUri) {
            alert('Please select a printer');
            return;
        }

        startTransition(async () => {
            try {
                // Call the server-side print handler via server action
                const result = await handlePrintRequest(printerUri);

                if (result.success) {
                    alert(result.message);
                } else {
                    alert(result.message);
                }
            } catch (err) {
                alert('Failed to send print job');
                console.error('Error sending print job:', err);
            }
        });
    };

    return (
        <button onClick={handlePrintClick} disabled={isPending}>
            {isPending ? 'Printing...' : `Print on ${printerName}`}
        </button>
    );
}


const PrinterListClient = () => {
    const [printers, setPrinters] = useState<Tiskalnik[]>([]);

    // Function to fetch printers and update state
    const fetchPrinters = async () => {
        try {
            const fetchedPrinters: Tiskalnik[] = await getPrinterUrls();
            setPrinters(fetchedPrinters);
        } catch (error) {
            console.error("Error fetching printers:", error);
        }
    };

    // Fetch printers when the component mounts
    useEffect(() => {
        fetchPrinters().catch(error => console.error("Error fetching printers:", error));
    }, []); // Empty dependency array to run only on mount

    return (
        <div>
            <h1>Printer List</h1>
            <button onClick={fetchPrinters}>klikni</button>
            
            {printers.map((printer) => (
                <PrinterButton
                    key={printer.url}
                    printerUri={printer.url}
                    printerName={printer.name}
                    handlePrintRequest={handlePrintRequest}
                />
            ))}
        </div>
    );
};

export default PrinterListClient;


