'use server'
import { auth } from '~/server/auth'
import { signIn, signOut } from "src/server/auth";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { env } from '~/env';


export async function create_spreatsheet() {
  const title = 'My new spreadsheet';
  const { GoogleAuth } = require('google-auth-library');
  const { google } = require('googleapis');
  const session = await auth();
  if (!session?.user?.email) {
    console.log("User is not logged in");
    return;
  }
  const avth = new GoogleAuth({
    email: session?.user?.email,
    key: env.NEXT_PUBLIC_API_KEY,
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const service = google.sheets({ version: 'v4', avth });
  const resource = {
    properties: {
      title,
    },
  };
  try {
    const spreadsheet = await service.spreadsheets.create({
      resource,
      fields: 'spreadsheetId',
    });
    console.log(`Spreadsheet ID: ${spreadsheet.data.spreadsheetId}`);
    return spreadsheet.data.spreadsheetId;
  } catch (err) {
    console.log(err);
    // TODO (developer) - Handle exception
    throw err;
    console.log(err);
  }
}