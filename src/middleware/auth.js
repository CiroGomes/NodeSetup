import { google } from "googleapis";
import fs from "fs";
import readline from "readline"

// import key from '../../store/auth.json';
const SCOPES = [
  "https://www.googleapis.com/auth/admin.reports.usage.readonly"
];
// const jwt = new google.auth.JWT(key.client_email, null, key.private_key, scopes);
// const view_id = 'XXXXXXX';

const TOKEN_PATH = "store/token.json";
const CREDENTIALS_PATH = "store/credentials.json";

export default async (req, res, next) => {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), req, res, next);
  });
};

function authorize(credentials, req, res, next) {
  const { client_id, client_secret, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, req, res, next);
    
    oAuth2Client.credentials = JSON.parse(token);
    req.oAuth2Client = oAuth2Client;
    return next();
  });
}

function getAccessToken(oAuth2Client, req, res, next) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);

      // Store the token to disk for later program executions
      console.log(token)
      storeToken(token);
      oAuth2Client.credentials = token;
      req.oAuth2Client = oAuth2Client;
      return next();
    });
  });
}

function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

// process.env.GOOGLE_APPLICATION_CREDENTIALS = '../../store/auth.json';
