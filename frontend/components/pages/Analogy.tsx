"use client";
import React, { useState } from "react";
import { CanvasText } from "../ui/canvas-text";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import { motion } from "motion/react";

type ResultItem = {
    word: string;
    score: number;
};

type ApiResponse = {
    results: ResultItem[];
};

export const Analogy = () => {
    const [expression, setExpression] = useState("");
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSolve = async () => {
        if (!expression) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://127.0.0.1:8000/analogy/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ expression }),
            });
            const data: ApiResponse = await res.json();

            // setResult(JSON.stringify(data, null, 2));
            setResult(data);
            console.log(result)
        } catch (err) {
            setError("Error calling API");
            setResult(null);
        }
        setLoading(false);
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h2 className="text-lg font-extrabold">Word Analogy</h2>
            <input
                type="text"
                placeholder="man + king - woman"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="border rounded p-2"
            />
            <button
                onClick={handleSolve}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Solving..." : "Solve Analogy"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {result && (
                <div className="bg-gray-100 dark:bg-neutral-900 p-4 rounded-lg shadow flex flex-col gap-4">

                    {/* Top Result */}
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow">
                        <p className="font-semibold text-sm text-gray-500">
                            Most similar word
                        </p>
                        <p className="text-xl font-bold">
                            <Highlight className="text-black dark:text-white">
                                {result?.results?.[0]?.word}
                            </Highlight>
                        </p>
                    </div>

                    {/* Other Results */}
                    <div className="p-3 bg-white dark:bg-neutral-800 rounded-md shadow">
                        <p className="font-semibold mb-2">More similar words</p>
                        <ul className="flex flex-col gap-1">
                            {result.results.slice(1).map((item, index) => (
                                <li
                                    key={index}
                                    className="flex justify-between border-b border-gray-200 dark:border-neutral-700 pb-1"
                                >
                                    <span>{item.word}</span>
                                    <span className="text-sm text-gray-500">
                                        {item.score.toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            )}
        </div>
    );
};