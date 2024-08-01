'use server'
import {auth}from '~/server/auth'
import { signIn, signOut } from "src/server/auth";
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { env } from '~/env';


export async function create_spreatsheet() {
  const session = await auth();
  if(!session?.user?.email){
    console.log("vn si")
    return 
}
  const avth = new JWT({
    email: session?.user?.email,
    key: env.NEXT_PUBLIC_API_KEY,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      // note that sharing-related calls require the google drive scope
      'https://www.googleapis.com/auth/drive.file',
    ],
  });
  const newDoc = GoogleSpreadsheet.createNewSpreadsheetDocument(avth, {title: 'test'}).then(console.log).catch(e => console.log('error', e));
  console.log(newDoc)
}