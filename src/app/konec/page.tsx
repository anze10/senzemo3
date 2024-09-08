import { GoogleDriveProvider } from "../_components/google_drive_context";
import { Konec } from "./konec_client";

export default function KonecPage() {
  return (
    <GoogleDriveProvider>
      <Konec />
    </GoogleDriveProvider>
  );
}
