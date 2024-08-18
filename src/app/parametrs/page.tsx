import Link from "next/link";
import Main from "./components/Main";
import { SensorProvider } from "../components/Contexts";
export default function HomePage() {
    return (
        <div>
            <SensorProvider>
                <Main></Main>
            </SensorProvider>


        </div>

    );
}