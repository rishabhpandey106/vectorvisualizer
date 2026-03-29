"use client";
import React, { useState } from "react";
import VectorGraph from "./VectorGraph";

export const Visualizer = () => {
    const [words, setWords] = useState("");
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [similarity, setSimilarity] = useState<number | null>(null);

    const handleVisualize = async () => {
        if (!words) return;
        setLoading(true);
        try {
            const wordArray = words.split(",").map((w) => w.trim()).filter(Boolean);
            const res = await fetch("https://vectorvisualizer.onrender.com/visualize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(wordArray),
            });

            const data = await res.json();
            setResult(data);
            setData(data.vectors_2d);
            setSimilarity(data.similarity * 100);
        } catch (err) {
            setResult("Error calling API");
        }
        setLoading(false);
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h2 className="text-lg font-bold">Visualizer</h2>
            <input
                type="text"
                placeholder="man, woman, king, queen"
                value={words}
                onChange={(e) => setWords(e.target.value)}
                className="border rounded p-2"
            />
            <button
                onClick={handleVisualize}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Visualizing..." : "Visualize"}
            </button>
            {similarity !== null && (
                <pre className="mt-2 p-3 bg-gray-50 rounded-lg shadow-inner text-gray-800 font-medium">
                    Similarity: {similarity.toFixed(2)}%
                </pre>
            )}
            {result && (
                <div className="h-full dark:bg-neutral-800 p-2 rounded">
                    <VectorGraph data={data} similarityMap={{ man: 0.8, boy: 0.79 }} />
                    <pre className="mt-2 flex justify-center items-center text-gray-800 text-sm font-heading">
                        {result.note}
                    </pre>
                </div>
            )}
        </div>
    );
};