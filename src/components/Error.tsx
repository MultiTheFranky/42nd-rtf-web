import { error } from "@context/Error";
import { Alert } from "@mui/material";
import { useStore } from "@nanostores/react";

export const ErrorAlert = () => {
    const $error: string = useStore(error) as string | "";
    return $error && $error !== "" && <Alert severity="error">{$error}</Alert>;
};
