"use server";
import { auth } from "~/server/auth";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

export async function create_spreatsheet() {
  const session = await auth();
  console.log({ access_token: session?.user.token });
  const client = new OAuth2Client({});

  client.setCredentials({
    access_token: session?.user.token,
  });

  const tokenInfo = await client.getTokenInfo(session?.user.token!);
  console.log(tokenInfo);

  const service = google.sheets({ version: "v4", auth: client as any });
  const resource = {
    properties: {
      title: "New Spreadshit",
    },
  };

  try {
    const spreadsheet = await service.spreadsheets
      .create({
        resource,
        fields: "spreadsheetId",
      })
      .then((response) => {
        console.log(response.data);
      });
  } catch (err) {
    // TODO (developer) - Handle exception
    console.error("Google spreadshit error");
    throw err;
  }
}
