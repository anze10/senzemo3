"use server"
import { auth } from "~/server/auth";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

// Funkcija za ustvarjanje mape
async function createFolder(client: OAuth2Client) {
    const service = google.drive({ version: 'v3', auth: client as any });
    const fileMetadata = {
        name: 'Invoices',
        mimeType: 'application/vnd.google-apps.folder',
    };
    try {
        const file = await service.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });
        console.log('Folder Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Funkcija za ustvarjanje preglednice znotraj določene mape
async function createSpreadsheet(client: OAuth2Client, folderId: string | null | undefined) {
    const service = google.drive({ version: 'v3', auth: client as any });
    const fileMetadata = {
        name: 'New Spreadsheet',
        parents: folderId ? [folderId] : undefined,
        mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    try {
        const file = await service.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });
        console.log('Spreadsheet Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        console.error("Google spreadsheet error");
        throw err;
    }
}

async function createSpreadsheetCsv(client: OAuth2Client, folderId: string | null | undefined) {
    const service = google.drive({ version: 'v3', auth: client as any });
    const fileMetadata = {
        name: 'New Spreadsheet CSV',
        parents: folderId ? [folderId] : undefined,
        mimeType: 'application/vnd.google-apps.spreadsheet',
    };

    try {
        const file = await service.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });
        console.log('Spreadsheet Id:', file.data.id);
        return file.data.id;
    } catch (err) {
        console.error("Google spreadsheet error");
        throw err;
    }
}

// Glavna funkcija za izvajanje zgornjih korakov
export async function createFolderAndSpreadsheet() {
    const session = await auth();
    console.log({ access_token: session?.user.token });
    const client = new OAuth2Client({});

    client.setCredentials({
        access_token: session?.user.token,
    });

    const tokenInfo = await client.getTokenInfo(session?.user.token!);
    console.log(tokenInfo);

    try {
        // Ustvarimo mapo
        const folderId = await createFolder(client);

        // Ustvarimo preglednico znotraj te mape
        const spreadsheetId = await createSpreadsheet(client, folderId);

        await createSpreadsheetCsv(client, folderId);

        return { folderId, spreadsheetId };
    } catch (err) {
        console.error(err);
        throw err;
    }
}
