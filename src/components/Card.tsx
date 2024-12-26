import { Card as CardMUI, CardContent, Typography } from "@mui/material";
import type { Member } from "@customTypes/Orbat";

const Card = (member: Member) => {
    return (
        <CardMUI sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {member.name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    {member.role}
                </Typography>
            </CardContent>
        </CardMUI>
    );
};
