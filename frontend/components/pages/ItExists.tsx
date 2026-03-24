"use client";
import React, { useState } from "react";
import { CanvasText } from "../ui/canvas-text";

export const ItExists = () => {
    const [word, setWord] = useState("");
    const [exists, setExists] = useState<string | null>(null);

    const handleCheck = async () => {
        if (!word) return;
        try {
            const res = await fetch(`https://vectorvisualizer.onrender.com/exists?word=${word}`);
            const data = await res.json();
            setExists(data.exists ? "Yes" : "No");
        } catch (err) {
            setExists("Error checking word");
        }
    };

    return (
        <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center gap-4 w-full">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                Word Exists?
            </h2>

            <div className="w-full max-w-md flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    placeholder="Enter a word"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                    onClick={handleCheck}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                >
                    Check
                </button>
            </div>

            {exists && (
                <div className="mt-4 w-full flex justify-center items-center">
                    <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
                        <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold flex justify-center items-center">
                            <CanvasText
                                text={exists}
                                backgroundClassName="bg-blue-600 dark:bg-blue-700"
                                colors={[
                                    "rgba(0, 153, 255, 1)",
                                    "rgba(0, 153, 255, 0.9)",
                                    "rgba(0, 153, 255, 0.8)",
                                    "rgba(0, 153, 255, 0.7)",
                                    "rgba(0, 153, 255, 0.6)",
                                    "rgba(0, 153, 255, 0.5)",
                                    "rgba(0, 153, 255, 0.4)",
                                    "rgba(0, 153, 255, 0.3)",
                                    "rgba(0, 153, 255, 0.2)",
                                    "rgba(0, 153, 255, 0.1)",
                                ]}
                                lineGap={4}
                                animationDuration={20}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};