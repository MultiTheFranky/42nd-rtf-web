import { Client } from "appwrite";

let client: Client;

function initializeClient() {
    const endpoint = import.meta.env.PUBLIC_APPWRITE_ENDPOINT;
    const project = import.meta.env.PUBLIC_APPWRITE_PROJECT;
    if (!endpoint || !project) {
        throw new Error(
            "APPWRITE_ENDPOINT and APPWRITE_PROJECT must be set in the environment"
        );
    }
    client = new Client();
    client.setEndpoint(endpoint).setProject(project);
    return client;
}

export function getClient() {
    if (!client) {
        return initializeClient();
    }
    return client;
}
