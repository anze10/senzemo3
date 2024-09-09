// "use client";

// import { createContext, useEffect, useState } from "react";
// import { GoogleDriveType } from "../parametrs/components/Main";



// export interface GoogleDriveContextType {
//   googleDrive: GoogleDriveType | null;
//   setGoogleDrive: (value: GoogleDriveType) => void;
// }

// export const GoogleDriveContext = createContext<GoogleDriveContextType | null>(
//   null,
// );

// export function GoogleDriveProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [googleDrive, setGoogleDrive] = useState<GoogleDriveType | null>(null);
//   useEffect(() => {console.log("googleDrive", googleDrive)}, [googleDrive]);

//   return (
//     <GoogleDriveContext.Provider value={{ googleDrive, setGoogleDrive }}>
//       {children}
//     </GoogleDriveContext.Provider>
//   );
// }
