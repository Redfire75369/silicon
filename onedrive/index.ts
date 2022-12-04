import msal, {
	Configuration,
	InteractionRequiredAuthError,
	InteractiveRequest,
	SilentFlowRequest,
} from "@azure/msal-node";
import {
	Client,
	ClientOptions,
	CustomAuthenticationProvider,
	ResponseType
} from "@microsoft/microsoft-graph-client";
import dotenv from "dotenv";
import {open, writeFile} from "fs/promises";
import openBrowser from "open";
import {resolve} from "path";

import metadata, {dir} from "./workbook.js";

dotenv.config({
	path: resolve(dir, "..", ".env")
});

const cachePath = resolve(dir, ".cache.json");

async function getAccessToken() {
	const pcaOptions: Configuration = {
		auth: {
			clientId: process.env.MICROSOFT_CLIENT_ID,
			authority: process.env.MICROSOFT_LOGIN_URL,
		},
	};
	const scopes = ["User.Read", "Files.Read", "offline_access"];

	const pca = new msal.PublicClientApplication(pcaOptions);

	const cacheFile = await open(cachePath, "r+");

	const cache = pca.getTokenCache();
	cache.deserialize(await cacheFile.readFile({encoding: "utf8"}));
	const accounts = await pca.getTokenCache().getAllAccounts();

	if (accounts.length > 0) {
		const silent: SilentFlowRequest = {
			account: accounts[0],
			scopes,
		};

		try {
			const credentials = await pca.acquireTokenSilent(silent);
			await cacheFile.write(pca.getTokenCache().serialize(), 0);
			await cacheFile.close();
			return credentials.accessToken;
		} catch (e) {
			if (!(e instanceof InteractionRequiredAuthError)) {
				await cacheFile.close();
				throw e;
			}
		}
	}

	const interactive: InteractiveRequest = {
		openBrowser: async function (url) {
			await openBrowser(url);
		},
		scopes,
	};

	const credentials = await pca.acquireTokenInteractive(interactive);
	await cacheFile.write(pca.getTokenCache().serialize(), 0);
	await cacheFile.close();
	return credentials.accessToken;
}

async function syncSpreadsheet(client: Client, key: string) {
	const apiRoute = `/me/drive/root:${metadata[key].path}:/content`;
	const response: ArrayBuffer = await client.api(apiRoute).responseType(ResponseType.ARRAYBUFFER).get();
	const path = resolve(dir, "..", "content", "spreadsheets", `${key}.xlsx`);
	await writeFile(path, new Uint8Array(response, 0, response.byteLength));
	console.info(`[XLSX]: Synced to ${path}`);
}

const accessToken = await getAccessToken();

const options: ClientOptions = {
	authProvider: new CustomAuthenticationProvider(function (callback) {
		callback(null, accessToken);
	}),
};

const client = Client.initWithMiddleware(options);

for (const key in metadata) {
	await syncSpreadsheet(client, key);
}
