import type { Group, Member } from "@customTypes/Orbat";
import {
    Box,
    Card,
    CardHeader,
    CardMedia,
    Grid2,
    List,
    ListItemButton,
    ListItemText,
    Modal,
    Typography
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { CardModal } from "./CardModal";
import { getImageByName } from "@appwrite/Storage";
import { getClient } from "@appwrite/Client";
import "@styles/index.css";

const OrbatModal = ({
    group,
    setGroupModal
}: {
    group: Group | undefined;
    setGroupModal: (group: Group | undefined) => void;
}): ReactNode => {
    const [member, setMemberModal] = useState<Member | undefined>();
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 1200,
        height: 800,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4
    };
    return (
        <>
            <Modal
                open={!!group}
                onClose={() => setGroupModal(undefined)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <Typography
                        id="modal-title"
                        variant="h2"
                        component="h2"
                        className="text-center"
                    >
                        {group?.name}
                    </Typography>
                    <Grid2 container spacing={2} padding={2}>
                        {group?.members.map((member) => (
                            <Grid2 size={4} key={member.name}>
                                <Card key={member.name}>
                                    <CardHeader
                                        title={`${member.name.split(" ")[0]} "${member.nickname}" ${member.name.split(" ")[1] ? member.name.split(" ")[1] : ""}`}
                                        subheader={member.role}
                                        onClick={() => setMemberModal(member)}
                                    />
                                </Card>
                            </Grid2>
                        ))}
                    </Grid2>
                </Box>
            </Modal>
            {member && (
                <CardModal member={member} setMemberModal={setMemberModal} />
            )}
        </>
    );
};

export default OrbatModal;
