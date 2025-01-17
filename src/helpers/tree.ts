import { useCallback, useEffect, useRef, useState } from "react";

export const useCenteredTree = (
    defaultTranslate = { x: 950, y: 200 }
): [
    { width: number; height: number },
    { x: number; y: number },
    React.RefObject<HTMLDivElement | null>
] => {
    const [translate, setTranslate] = useState({
        x: window.innerWidth / 2,
        y: window.innerHeight / 5
    });
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
