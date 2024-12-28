/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly APPWRITE_ENDPOINT: string;
    readonly APPWRITE_PROJECT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
