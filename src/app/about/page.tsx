/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Select from "react-select";

// Reusable Form Field Component
const FormField = ({ label, value, onChange, placeholder }: any) => (
    <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
            required
        />
    </div>
);

export default function ExploitForm() {
    const [isClient, setIsClient] = useState(false);
    const [exploits, setExploits] = useState<any[]>([]);
    const [selectedExploits, setSelectedExploits] = useState<any[]>([]);
    const [rhosts, setRhosts] = useState<string[]>([""]);
    const [rports, setRports] = useState<string[]>(["80"]);
    const [payloads, setPayloads] = useState<string[]>([]);
    const [platform, setPlatform] = useState<string>("Unix");
    const [arch, setArch] = useState<string>("cmd");
    const [autofilterPorts, setAutofilterPorts] = useState<number[]>([80, 443]);
    const [autofilterServices, setAutofilterServices] = useState<string[]>(["http", "https"]);
    const [threads, setThreads] = useState<number>(1);
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Mark component as client-only after mounting
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Fetch exploits once and store in state
    useEffect(() => {
        const fetchExploits = async () => {
            try {
                const res = await fetch("/api/exploits");
                const data = await res.json();
                if (res.ok) {
                    setExploits(data);
                } else {
                    setMessage("Error fetching exploits");
                }
            } catch (error) {
                setMessage("Error fetching exploits");
            }
        };
        fetchExploits();
    }, []);

    // Update form fields based on selected exploit
    useEffect(() => {
        if (selectedExploits.length > 0) {
            const firstExploit = selectedExploits[0];
            setPlatform(firstExploit.platform || "Unix");
            setArch(firstExploit.arch || "cmd");
            setAutofilterPorts([80, 443, 8080, 8443]);
            setAutofilterServices(["http", "https"]);
            setPayloads(selectedExploits.map((exp) => exp.fullname || ""));
        }
    }, [selectedExploits]);

    // Handle form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const exploitData = {
            exploits: selectedExploits.map((exp) => exp.name),
            rhosts: rhosts.map(parseRhost),
            rports,
            payloads,
            platform,
            arch,
            autofilter_ports: autofilterPorts,
            autofilter_services: autofilterServices,
            threads,
        };

        try {
            const res = await fetch("/api/exploits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(exploitData),
            });
            const data = await res.json();
            setLoading(false);
            if (res.ok) {
                setMessage("Exploit successfully added!");
                resetForm();
            } else {
                setMessage(`Error: ${data.error}`);
            }
        } catch (error) {
            setLoading(false);
            setMessage("Submission failed. Please try again.");
        }
    }, [rhosts, rports, payloads, platform, arch, autofilterPorts, autofilterServices, selectedExploits, threads]);

    const resetForm = () => {
        setSelectedExploits([]);
        setRhosts([""]);
        setRports(["80"]);
        setPayloads([]);
        setPlatform("Unix");
        setArch("cmd");
        setAutofilterPorts([80, 443]);
        setAutofilterServices(["http", "https"]);
        setThreads(1);
    };

    // Parse RHOST input into an array of IP addresses
    const parseRhost = (rhost: string) => {
        const ips: string[] = [];
        const ranges = rhost.split(",");
        ranges.forEach((range) => {
            if (range.includes("-")) {
                const [startIp, endIp] = range.split("-");
                const startParts = startIp.split(".").map(Number);
                const endParts = endIp.split(".").map(Number);
                if (startParts.length === 4 && endParts.length === 4) {
                    for (let i = startParts[3]; i <= endParts[3]; i++) {
                        ips.push(`${startParts[0]}.${startParts[1]}.${startParts[2]}.${i}`);
                    }
                }
            } else {
                ips.push(range.trim());
            }
        });
        return ips;
    };

    // Functions to add or remove dynamic input fields
    const addField = (fieldType: "rhosts" | "rports" | "payloads") => {
        if (fieldType === "rhosts") setRhosts(prev => [...prev, ""]);
        if (fieldType === "rports") setRports(prev => [...prev, "80"]);
        if (fieldType === "payloads") setPayloads(prev => [...prev, ""]);
    };

    const removeField = (index: number, fieldType: "rhosts" | "rports" | "payloads") => {
        if (fieldType === "rhosts") setRhosts(prev => prev.filter((_, i) => i !== index));
        if (fieldType === "rports") setRports(prev => prev.filter((_, i) => i !== index));
        if (fieldType === "payloads") setPayloads(prev => prev.filter((_, i) => i !== index));
    };

    // Ensure that the form is not rendered until the component is mounted on the client
    if (!isClient) return null;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-r from-gray-900 to-black text-green-400 font-mono">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold">MemeSploit Exploit Management</h1>
                    <p className="mt-2 text-lg">Configure your exploit details below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Exploit Selection (Multiple) */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Exploits</label>
                        <Select
                            isMulti
                            options={exploits.map((exploit) => ({ label: exploit.name, value: exploit._id }))}
                            value={selectedExploits.map((exploit) => ({ label: exploit.name, value: exploit._id }))}
                            onChange={(selected) => {
                                setSelectedExploits(
                                    selected.map((item) => exploits.find((exp) => exp._id === item.value))
                                );
                            }}
                            className="mt-2 p-4 border border-green-500 rounded-md focus:ring-2 focus:ring-green-500 w-full"
                        />
                    </div>

                    {/* Threads Field */}
                    <div>
                        <label className="block text-sm font-medium text-green-200">No. of Threads (Number of shells running)</label>
                        <input
                            type="number"
                            value={threads}
                            onChange={(e) => setThreads(Number(e.target.value))}
                            className="w-full p-4 border border-green-500 rounded-md shadow-sm focus:ring-2 focus:ring-green-500"
                            min={1}
                        />
                    </div>

                    {/* Dynamic RHOST Fields */}
                    <div>
                        <label className="block text-sm font-medium text-green-200">Target IP Address (RHOST)</label>
                        {rhosts.map((rhost, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={rhost}
                                    onChange={(e) =>
                                        setRhosts(rhosts.map((item, i) => (i === index ? e.target.value : item)))
                                    }
                                    className="p-4 border border-green-500 rounded-md shadow-sm w-full"
                                    placeholder="e.g. 192.168.1.1 or 192.168.1.1-192.168.1.100"
                                    required
                                />
                                {rhosts.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeField(index, "rhosts")}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField("rhosts")}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Add RHOST
                        </button>
                    </div>

                    {/* Dynamic RPORT Fields */}
                    <div>
                        <label className="block text-sm font-medium text-green-200">Target Port (RPORT)</label>
                        {rports.map((rport, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={rport}
                                    onChange={(e) =>
                                        setRports(rports.map((item, i) => (i === index ? e.target.value : item)))
                                    }
                                    className="p-4 border border-green-500 rounded-md shadow-sm w-full"
                                    placeholder="e.g. 80"
                                    required
                                />
                                {rports.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeField(index, "rports")}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField("rports")}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Add RPORT
                        </button>
                    </div>

                    {/* Dynamic Payload Fields */}
                    <div>
                        <label className="block text-sm font-medium text-green-200">Select Payloads</label>
                        {payloads.map((payload, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <input
                                    type="text"
                                    value={payload}
                                    onChange={(e) =>
                                        setPayloads(payloads.map((item, i) => (i === index ? e.target.value : item)))
                                    }
                                    className="p-4 border border-green-500 rounded-md shadow-sm w-full"
                                    placeholder="e.g. windows/meterpreter/reverse_tcp"
                                    required
                                />
                                {payloads.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeField(index, "payloads")}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addField("payloads")}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Add Payload
                        </button>
                    </div>

                    {/* Summary of selected settings */}
                    <div className="mt-4 text-lg font-semibold">
                        <p>Selected Exploits: {selectedExploits.map((exp) => exp.name).join(", ")}</p>
                    </div>

                    {/* Form Submission */}
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-500"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>

                    {/* Error/SUCCESS Message */}
                    {message && (
                        <div className={`mt-4 text-lg font-semibold ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
