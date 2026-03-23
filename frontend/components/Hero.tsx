"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
    IconCarFan,
    IconCarFanFilled,
    IconChartCovariate,
    IconMathSymbols,
    IconMicroscope,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Analogy } from "@/components/pages/Analogy";
import { Visualizer } from "@/components/pages/Visualizer";
import { ItExists } from "@/components/pages/ItExists";

export function SidebarDemo() {
    const links = [
        {
            id: "analogy",
            label: "Analogy",
            href: "/",
            icon: (
                <IconMathSymbols className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            id: "visualizer",
            label: "Visualizer",
            href: "/",
            icon: (
                <IconChartCovariate className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
        {
            id: "itExists",
            label: "It Exists?",
            href: "/",
            icon: (
                <IconMicroscope className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
        },
    ];

    const [open, setOpen] = useState(false);
    const [activePage, setActivePage] = useState("analogy");

    return (
        <div
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
                "h-[60vh]"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    onClick={() => setActivePage(link.id)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Rishabh Kumar Pandey",
                                href: "https://github.com/rishabhpandey106/",
                                icon: (
                                    <img
                                        src="/profile.png"
                                        className="h-7 w-7 shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            {/* Dynamic content */}
            <DashboardContent activePage={activePage} />
        </div>
    );
}

// Logo Components
export const Logo = () => (
    <a
        href="/"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
        <IconCarFan className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium whitespace-pre text-black dark:text-white"
        >
            VectorVisualizer
        </motion.span>
    </a>
);

export const LogoIcon = () => (
    <a
        href="#"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
        <IconCarFanFilled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    </a>
);

// Dynamic dashboard content
const DashboardContent = ({ activePage }: { activePage: string }) => {
    return (
        <div className="flex flex-1">
            <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
                {activePage === "analogy" && <Analogy />}
                {activePage === "visualizer" && <Visualizer />}
                {activePage === "itExists" && <ItExists />}
            </div>
        </div>
    );
};