import type { AppwriteGroup, AppwriteMember } from "@customTypes/Orbat";
import { Databases, type Client } from "appwrite";

function getDatabase(client: Client) {
    return new Databases(client);
}

export function listDocuments(
    client: Client,
    databaseId: string,
    collectionId: string
) {
    return getDatabase(client).listDocuments(databaseId, collectionId);
}

const ORBAT_DATABASE_ID = "orbat";
const ORBAT_GROUPS_COLLECTION_ID = "groups";
const ORBAT_MEMBERS_COLLECTION_ID = "members";

export async function getOrbat(client: Client) {
    return (
        await listDocuments(
            client,
            ORBAT_DATABASE_ID,
            ORBAT_GROUPS_COLLECTION_ID
        )
    ).documents as AppwriteGroup[];
}

export async function getMembers(client: Client) {
    return (
        await listDocuments(
            client,
            ORBAT_DATABASE_ID,
            ORBAT_MEMBERS_COLLECTION_ID
        )
    ).documents as AppwriteMember[];
}
