
import dynamic from 'next/dynamic';
const SerialPort = dynamic(() => import('./components/testComponent'), { ssr: false });

export default function Home() {
    return (
        <div>
            <h1>Printer Management</h1>
            <SerialPort />
        </div>
    );
}
