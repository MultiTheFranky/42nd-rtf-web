import { getClient } from "@appwrite/Client";
import { getOrbat } from "@appwrite/Database";
import {
    mapGroupsToChart,
    orderGroupsMembers,
    type Group
} from "@customTypes/Orbat";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Box, Grid2, Modal, Typography, type Grid2Props } from "@mui/material";
import Tree from "react-d3-tree";
import "@styles/custom-tree.css";
import { useCenteredTree } from "@helpers/tree";
import OrbatModal from "@components/OrbatModal";

const Orbat = () => {
    const [orbat, setOrbat] = useState<Group[]>([]);
    const [groupModal, setGroupModal] = useState<Group | undefined>();

    useEffect(() => {
        const getOrbatAsync = async () => {
            const orbat = await getOrbat(getClient());
            setOrbat(orderGroupsMembers(orbat));
        };
        if (orbat.length === 0) getOrbatAsync();
    });
    const nodeSize = { x: 200, y: 200 };
    const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };

    const renderForeignObjectNode = ({
        nodeDatum,
        toggleNode,
        foreignObjectProps
    }: {
        nodeDatum: any;
        toggleNode: () => void;
        foreignObjectProps: { width: number; height: number; x: number };
    }) => (
        <g>
            <circle
                r={15}
                onClick={() => {
                    setGroupModal(
                        orbat.find((group) => group.name === nodeDatum.name)
                    );
                }}
            ></circle>
            {/* `foreignObject` requires width & height to be explicitly set. */}
            <foreignObject {...foreignObjectProps}>
                <h2>{nodeDatum.name}</h2>
            </foreignObject>
        </g>
    );

    const [dimensions, translate, containerRef] = useCenteredTree();

    const GridWithRef = forwardRef<HTMLDivElement, Grid2Props>((props, ref) => {
        return (
            <Grid2 ref={ref} {...props}>
                {props.children}
            </Grid2>
        );
    });

    return (
        <Grid2 container spacing={2}>
            <Grid2 size={12}>
                <h1 className="text-6xl text-center">Orbat</h1>
            </Grid2>
            <GridWithRef
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
                            ...rd3tProps,
                            foreignObjectProps
                        })
                    }
                    pathFunc={"step"}
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    initialDepth={1}
                    zoom={2}
                    scaleExtent={{ min: 1, max: 1000 }}
                    separation={{ siblings: 2, nonSiblings: 4 }}
                />
            </GridWithRef>
            <OrbatModal group={groupModal} setGroupModal={setGroupModal} />
        </Grid2>
    );
};

export default Orbat;
