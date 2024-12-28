import {
    Card as CardMUI,
    CardContent,
    Typography,
    CardHeader,
    CardMedia,
    CircularProgress
} from "@mui/material";
import type { Member } from "@customTypes/Orbat";
import logo from "@images/logo.png";
import { getClient } from "@appwrite/Client";
import { getImageByName } from "@appwrite/Storage";
import { useEffect, useState } from "react";

export const Card = (member: Member) => {
    const [cardImage, setCardImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCardImage = async () => {
            const image = await getImageByName(getClient(), member.name);
            setCardImage(image);
            setLoading(false);
        };
        if (!cardImage) getCardImage();
    });
    return (
        <CardMUI sx={{ minWidth: 275 }}>
            <CardHeader title={member.name} subheader={member.role} />
            {/* {!loading && (
                <CardMedia
                    component="img"
                    className="h-64"
                    image={cardImage || logo.src}
                    alt={`Foto de ${member.name}`}
                />
            )}
            {loading && (
                <div className="h-64 flex justify-center items-center">
                    <CircularProgress />
                </div>
            )} */}
        </CardMUI>
    );
};
