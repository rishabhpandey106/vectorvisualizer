"use client";

import React from "react";
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    ReferenceDot,
    LabelList,
    Layer,
} from "recharts";

// Utility to map similarity to color intensity
const getLineColor = (similarity: number) => {
    const intensity = Math.floor(similarity * 255);
    return `rgb(${intensity}, 50, ${255 - intensity})`;
};

interface VectorGraphProps {
    data: { word: string; x: number; y: number }[];
    similarityMap?: Record<string, number>;
}

export default function VectorGraph({ data, similarityMap }: VectorGraphProps) {
    if (!data || data.length === 0) return null;

    const maxVal = Math.max(
        ...data.flatMap((d) => [Math.abs(d.x), Math.abs(d.y)])
    );

    // Zoom & pan state
    const [zoom, setZoom] = React.useState(1);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    const [isDragging, setIsDragging] = React.useState(false);
    const [start, setStart] = React.useState({ x: 0, y: 0 });

    const zoomedMax = maxVal / zoom;

    const domain: [number, number] = [
        -zoomedMax + offset.x,
        zoomedMax + offset.x,
    ];

    // Lines from origin
    const LinesFromOrigin = () => (
        <Layer>
            {data.map((point, idx) => {
                const sim = similarityMap?.[point.word] ?? 0.5;
                return (
                    <line
                        key={idx}
                        x1={0}
                        y1={0}
                        x2={point.x}
                        y2={point.y}
                        stroke={getLineColor(sim)}
                        strokeWidth={2}
                        strokeOpacity={0.7}
                    />
                );
            })}
        </Layer>
    );

    // Mouse wheel zoom
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();

        const delta = e.deltaY;

        setZoom((prev) => {
            const newZoom = delta > 0 ? prev * 1.1 : prev / 1.1;
            return Math.max(0.5, Math.min(newZoom, 5));
        });
    };

    // Drag start
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStart({ x: e.clientX, y: e.clientY });
    };

    // Drag move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;

        const scale = maxVal / zoom / 200;

        setOffset((prev) => ({
            x: prev.x - dx * scale,
            y: prev.y + dy * scale,
        }));

        setStart({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div
            className="w-full h-[500px] cursor-grab"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <ResponsiveContainer>
                <ScatterChart style={{ background: "white" }} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 2" />

                    {/* Axes */}
                    <XAxis type="number" dataKey="x" domain={domain} allowDataOverflow axisLine={false} />
                    <YAxis type="number" dataKey="y" domain={domain} allowDataOverflow axisLine={false} />

                    {/* Origin cross */}
                    <ReferenceLine x={0} stroke="black" strokeWidth={2} />
                    <ReferenceLine y={0} stroke="black" strokeWidth={2} />

                    {/* Quadrant labels */}
                    <ReferenceDot x={maxVal * 0.7} y={maxVal * 0.7} r={0} label="Q1" />
                    <ReferenceDot x={-maxVal * 0.7} y={maxVal * 0.7} r={0} label="Q2" />
                    <ReferenceDot x={-maxVal * 0.7} y={-maxVal * 0.7} r={0} label="Q3" />
                    <ReferenceDot x={maxVal * 0.7} y={-maxVal * 0.7} r={0} label="Q4" />

                    {/* Tooltip */}
                    <Tooltip
                        formatter={(_, __, props: any) => {
                            const d = props.payload;
                            const simVal = similarityMap?.[d.word];
                            const simText =
                                typeof simVal === "number" ? simVal.toFixed(2) : "N/A";
                            return `${d.word} (${d.x.toFixed(2)}, ${d.y.toFixed(2)}), sim: ${simText}`;
                        }}
                    />

                    {/* Points */}
                    <Scatter data={data} fill="#3b82f6">
                        <LabelList dataKey="word" position="top" />
                    </Scatter>

                    {/* Lines from origin */}
                    <LinesFromOrigin />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}