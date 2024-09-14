import type {Configuration, InteractiveRequest, SilentFlowRequest} from "@azure/msal-node";
import {InteractionRequiredAuthError, PublicClientApplication} from "@azure/msal-node";
import type {ClientOptions} from "@microsoft/microsoft-graph-client";
import {Client, CustomAuthenticationProvider, ResponseType} from "@microsoft/microsoft-graph-client";
import dotenv from "dotenv";
import {existsSync} from "fs";
import {open, writeFile} from "fs/promises";
import openBrowser from "open";
import {resolve} from "path";

import metadata, {dir} from "./workbook";

dotenv.config({
	path: resolve(dir, ".env")
});

const cachePath = resolve(dir, "onedrive", ".cache.json");

async function getAccessToken() {
	if (process.env.MICROSOFT_CLIENT_ID === undefined) {
		throw new Error("Azure Active Directory Client ID is required.");
	}

	const pcaOptions: Configuration = {
		auth: {
			clientId: process.env.MICROSOFT_CLIENT_ID,
			authority: process.env.MICROSOFT_LOGIN_URL,
		},
	};
	const scopes = ["User.Read", "Files.Read", "offline_access"];

	const pca = new PublicClientApplication(pcaOptions);

	if (!existsSync(cachePath)) {
		await writeFile(cachePath, "{}");
	}
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
			if (credentials !== null) {
				await cacheFile.write(pca.getTokenCache().serialize(), 0);
				await cacheFile.close();
				return credentials.accessToken;
			}
		} catch (e) {
			if (!(e instanceof InteractionRequiredAuthError) && e instanceof Error) {
				console.error("Error occurred while acquiring token from cache:", e.name);
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
	const path = resolve(dir, "src", "content", "spreadsheets", `${key}.xlsx`);
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
