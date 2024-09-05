"use client";

import { createContext, useState } from "react";

export interface GoogleDriveType {
  folderId: string;
  spreadsheetId: string;
  fileId: string;
}

export interface GoogleDriveContextType {
  googleDrive: GoogleDriveType | null;
  setGoogleDrive: (value: GoogleDriveType) => void;
}

export const GoogleDriveContext = createContext<GoogleDriveContextType | null>(
  null,
);

export function GoogleDriveProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [googleDrive, setGoogleDrive] = useState<GoogleDriveType | null>(null);

  return (
    <GoogleDriveContext.Provider value={{ googleDrive, setGoogleDrive }}>
      {children}
    </GoogleDriveContext.Provider>
  );
}
