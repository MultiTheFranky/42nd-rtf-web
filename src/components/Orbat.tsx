import { getClient } from "@appwrite/Client";
import { getOrbat } from "@appwrite/Database";
import {
    mapGroupsToChart,
    orderGroupsMembers,
    type Group
} from "@customTypes/Orbat";
import { forwardRef, useEffect, useState } from "react";
import { CircularProgress, Grid2, type Grid2Props } from "@mui/material";
import Tree from "react-d3-tree";
import "@styles/custom-tree.css";
import { useCenteredTree } from "@helpers/tree";
import OrbatModal from "@components/OrbatModal";
import logo from "@images/logo.png";
import { getImageByName } from "@appwrite/Storage";
import { error, setError } from "@context/Error";
import { useStore } from "@nanostores/react";
import "@styles/index.css";

const Orbat = () => {
    const [orbat, setOrbat] = useState<Group[]>([]);
    const [groupModal, setGroupModal] = useState<Group | undefined>();
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<
        {
            group: string;
            image: string | null;
        }[]
    >([]);
    const [dimensions, translate, containerRef] = useCenteredTree();
    const $error = useStore(error) as string | "";

    useEffect(() => {
        const getOrbatAsync = async () => {
            const orbat = await getOrbat(getClient());
            setOrbat(orderGroupsMembers(orbat));
            setImages(
                await Promise.all(
                    orbat.map(async (group) => {
                        const image = await getImageByName(
                            getClient(),
                            group.name
                        );
                        return { group: group.name, image };
                    })
                )
            );
            setLoading(false);
        };
        try {
            if (!$error && orbat.length === 0) getOrbatAsync();
        } catch (error) {
            console.error(error);
            setError("Error al cargar la información de la base de datos");
        }
    });

    const renderForeignObjectNode = ({ nodeDatum }: { nodeDatum: any }) => {
        return (
            <g
                onClick={() => {
                    setGroupModal(
                        orbat.find((group) => group.name === nodeDatum.name)
                    );
                }}
            >
                <pattern
                    id={`image-${nodeDatum.name}`}
                    x="0"
                    y="0"
                    width="1"
                    height="1"
                >
                    <image
                        href={
                            images.find(
                                (image) => image.group === nodeDatum.name
                            )?.image || logo.src
                        }
                        x="0"
                        y="0"
                        width="200"
                        height="100"
                    ></image>
                </pattern>
                <rect
                    height={100}
                    width={100 * 2}
                    x={100 * -1}
                    y={nodeDatum.__rd3t.depth === 1 ? 0 : 100 * -1}
                    fill={`url(#image-${nodeDatum.name})`}
                    style={{ stroke: "transparent" }}
                ></rect>
                <text
                    x="0"
                    y={nodeDatum.__rd3t.depth === 1 ? 60 : -40}
                    textAnchor="middle"
                    fontFamily="Arial Black"
                    fontSize={30}
                >
                    {nodeDatum.name}
                </text>
            </g>
        );
    };

    const GridWithRef = forwardRef<HTMLDivElement, Grid2Props>((props, ref) => {
        return (
            <Grid2 ref={ref} {...props}>
                {props.children}
            </Grid2>
        );
    });

    return (
        <Grid2 container spacing={2}>
            <>
                <Grid2 size={12}>
                    <h1 className="text-6xl text-center">Orbat</h1>
                </Grid2>
                {loading && (
                    <Grid2 size={12}>
                        <CircularProgress
                            sx={{
                                display: "block",
                                margin: "auto"
                            }}
                        />
                    </Grid2>
                )}
                {orbat.length !== 0 && !loading && (
                    <GridWithRef
                        container
                        size={12}
                        height={"61vh"}
                        ref={containerRef}
                        spacing={2}
                    >
                        <Tree
                            data={mapGroupsToChart(orbat.slice(2))}
                            orientation="vertical"
                            dimensions={dimensions}
                            translate={translate}
                            renderCustomNodeElement={(rd3tProps) =>
                                renderForeignObjectNode({
                                    ...rd3tProps
                                })
                            }
                            pathFunc={"step"}
                            rootNodeClassName="node__root"
                            branchNodeClassName="node__branch"
                            leafNodeClassName="node__leaf"
                            initialDepth={1}
                            zoom={1.5}
                            scaleExtent={{ min: 1, max: 1000 }}
                            separation={{ siblings: 2, nonSiblings: 4 }}
                            draggable={false}
                        />
                    </GridWithRef>
                )}
                <OrbatModal
                    key={groupModal?.name}
                    group={groupModal}
                    setGroupModal={setGroupModal}
                />
            </>
        </Grid2>
    );
};

export default Orbat;
