import { Client, Query, Storage } from "appwrite";

const orbat = "orbat";

export const getImageByName = async (
    client: Client,
    name: string
): Promise<string | null> => {
    try {
        const storage = new Storage(client);
        const search = await storage.listFiles(orbat, [
            Query.contains("name", name)
        ]);
        if (search.files.length === 0) {
            return null;
        }
        return storage.getFilePreview(orbat, search.files[0].$id);
    } catch (error) {
        console.error(error);
        return null;
    }
};
