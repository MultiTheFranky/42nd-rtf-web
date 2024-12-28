import type { Group } from "@customTypes/Orbat";
import { Box, Modal, Typography } from "@mui/material";
import type { ReactNode } from "react";

const OrbitModal = ({
    group,
    setGroupModal
}: {
    group: Group | undefined;
    setGroupModal: (group: Group | undefined) => void;
}): ReactNode => {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4
    };
    return (
        <Modal
            open={!!group}
            onClose={() => setGroupModal(undefined)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-title" variant="h6" component="h2">
                    {group?.name}
                </Typography>
                {group?.members.map((member) => (
                    <Typography key={member.name}>{member.name}</Typography>
                ))}
            </Box>
        </Modal>
    );
};

export default OrbitModal;
