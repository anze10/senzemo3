
import PrinterListClient from './components/PrinterList';

export default async function Home() {
    return (
        <div>
            <h1>Printer Management</h1>
            <PrinterListClient />
        </div>
    );
}