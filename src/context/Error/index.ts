import { atom } from "nanostores";

export const error = atom("");

export const setError = (errorText: string) => {
    error.set(errorText);
};
