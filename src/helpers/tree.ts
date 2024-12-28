import { useCallback, useEffect, useRef, useState } from "react";

export const useCenteredTree = (
    defaultTranslate = { x: 0, y: 0 }
): [
    { width: number; height: number },
    { x: number; y: number },
    React.RefObject<HTMLDivElement | null>
] => {
    const [translate, setTranslate] = useState(defaultTranslate);
    const [dimensions, setDimensions] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const containerElem = containerRef.current;
        if (containerElem !== null) {
            const { width, height } = containerElem.getBoundingClientRect();
            setDimensions({ width, height });
            setTranslate({ x: width / 2, y: height / 2 - 100 });
        }
    }, []);
    return [dimensions, translate, containerRef];
};
