import {
    Box,
    CircularProgress,
    Grid2,
    ImageList,
    Modal,
    Typography
} from "@mui/material";
import type { Member } from "@customTypes/Orbat";
import { getClient } from "@appwrite/Client";
import { getImageByName } from "@appwrite/Storage";
import { useEffect, useState, type ReactNode } from "react";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import { animated, useSpring } from "@react-spring/web";
import "@styles/index.css";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
};

export const CardModal = ({
    member,
    setMemberModal
}: {
    member: Member;
    setMemberModal: (member: Member | undefined) => void;
}): ReactNode => {
    const [cardImage, setCardImage] = useState<string | null>(null);
    const [normalImage, setNormalImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [springs, api] = useSpring(() => ({
        from: { x: -200, opacity: 0 }
    }));

    const AnimatedH2 = animated("h2");

    useEffect(() => {
        const getCardImage = async () => {
            const image = await getImageByName(
                getClient(),
                `${member.nickname}_card.png`
            );
            const normalImage = await getImageByName(
                getClient(),
                `${member.nickname}.png`
            );
            setCardImage(image);
            setNormalImage(normalImage);
            setLoading(false);
        };
        if (!cardImage) getCardImage();
        if (isFlipped) {
            api.start({
                from: { x: -200, opacity: 0 },
                to: { x: 25, opacity: 1 }
            });
        }
    });
    return (
        <Modal
            open={!!member}
            onClose={() => setMemberModal(undefined)}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <>
                {loading && <CircularProgress />}
                {!loading && cardImage && normalImage && (
                    <Flippy
                        flipOnHover={false} // default false
                        flipOnClick={true} // default false
                        onClick={() => setIsFlipped(!isFlipped)} // click event to reverse the flip, if it is not controlled
                        flipDirection="horizontal" // horizontal or vertical
                        // if you pass isFlipped prop component will be controlled component.
                        // and other props, which will go to div
                        style={{
                            height: "100%",
                            width: "40%",
                            justifySelf: "center",
                            verticalAlign: "middle",
                            marginTop: "2%",
                            boxShadow: "0px"
                        }} /// these are optional style, it is not necessary
                    >
                        <FrontSide>
                            <>
                                <img
                                    src={cardImage}
                                    alt={member.name}
                                    style={{
                                        height: "90%",
                                        width: "90%",
                                        justifySelf: "center",
                                        verticalAlign: "middle",
                                        marginTop: "2%"
                                    }}
                                />
                                <h2
                                    style={{
                                        color: "white",
                                        textShadow: "2px 2px 4px #000000",
                                        textAlign: "center",
                                        fontSize: "1em"
                                    }}
                                >
                                    Click en la carta para ver más información
                                </h2>
                            </>
                        </FrontSide>
                        <BackSide
                            style={{
                                marginLeft:
                                    member.nickname === "Bit" ? "-30%" : "-20%",
                                boxShadow: "0px"
                            }}
                        >
                            <img
                                src={normalImage}
                                alt={member.name}
                                style={{
                                    height:
                                        member.nickname === "Bit"
                                            ? "40%"
                                            : "90%",
                                    justifySelf: "center",
                                    verticalAlign: "middle",
                                    marginTop:
                                        member.nickname === "Bit" ? "30%" : "1%"
                                }}
                            />
                        </BackSide>
                    </Flippy>
                )}
                {isFlipped && (
                    <AnimatedH2
                        style={{
                            ...springs,
                            fontSize: "2em",
                            position: "absolute",
                            top: "50%",
                            left: "67%",
                            transform: "translate(-50%, -50%)",
                            animation: "linear 2s",
                            animationDirection: "alternate",
                            width: "30%",
                            height: "30%"
                        }}
                    >
                        <h2
                            className="text-center"
                            style={{
                                color: "white",
                                textShadow: "2px 2px 4px #000000",
                                textAlign: "left"
                            }}
                        >
                            Nombre: {member.name}
                            <br />
                            Apodo: {member.nickname}
                            <br />
                            Rol: {member.role}
                        </h2>
                        <h2
                            className="text-center"
                            style={{
                                color: "white",
                                textShadow: "2px 2px 4px #000000",
                                textAlign: "left",
                                fontSize: "0.75em"
                            }}
                        >
                            {member.Destiny}
                        </h2>
                    </AnimatedH2>
                )}
            </>
        </Modal>
    );
};
