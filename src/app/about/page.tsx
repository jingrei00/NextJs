/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";

// Input Field Component
const InputFieldComponent = ({ label, value, onChange, placeholder, type = "text" }: any) => (
    <div className="w-full">
        <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
            placeholder={placeholder}
        />
    </div>
);

// Select List Component for Multiple Options
const SelectListComponent = ({ label, options, value, onChange }: any) => (
    <div className="w-full">
        <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
        <select
            multiple
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white focus:ring-2 focus:ring-green-400"
        >
            {options.map((option: any, index: number) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

export default function ExploitForm() {
    const [exploits, setExploits] = useState<any[]>([]);
    const [selectedExploits, setSelectedExploits] = useState<any[]>([]);
    const [selectedPayloads, setSelectedPayloads] = useState<any[]>([]);
    const [targets, setTargets] = useState<string[]>(["192.168.1.1"]);
    const [cve, setCve] = useState("");
    const [threads, setThreads] = useState(1);
    const [message, setMessage] = useState(" ");
    const [loading, setLoading] = useState(false);

    // Fetch Exploits from the API
    useEffect(() => {
        const fetchExploits = async () => {
            try {
                const res = await fetch("/api/exploits");
                const data = await res.json();
                if (res.ok) setExploits(data);
                else setMessage("Error fetching exploits");
            } catch {
                setMessage("Error fetching exploits");
            }
        };
        fetchExploits();
    }, []);

    // Fetch Exploits based on CVE Number
    const fetchCveDetails = async (cveNumber: string) => {
        try {
            const res = await fetch(`/api/exploits/${cveNumber}`);
            const data = await res.json();
            if (res.ok && data) {
                const matchingExploits = exploits.filter(exp =>
                    exp.references?.includes(cveNumber.trim().toUpperCase())
                );
                setSelectedExploits(matchingExploits);
            } else {
                setSelectedExploits([]);
            }
        } catch {
            setSelectedExploits([]);
        }
    };

    // Handle Form Submission
    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        const exploitData = {
            exploits: selectedExploits.map((exp: any) => exp.name),
            cve,
            targets,
            payloads: selectedPayloads.map((payload: any) => payload.name),
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
            setMessage(res.ok ? "Exploits executed successfully!" : `Error: ${data.error}`);
        } catch {
            setLoading(false);
            setMessage("Submission failed. Please try again.");
        }
    }, [cve, threads, selectedExploits, selectedPayloads, targets]);

    // Add a new target input field with unique ports
    const addTarget = () => {
        const newTarget = `192.168.1.1`; // Default port selection
        if (!targets.includes(newTarget)) {
            setTargets([...targets, newTarget]);
        }
    };

    // Handle Target Change with unique ports
    const handleTargetChange = (index: number, value: string) => {
        const newTargets = [...targets];
        if (!newTargets.includes(value)) {
            newTargets[index] = value;
            setTargets(newTargets);
        }
    };

    // Handle Select Exploit Change
    const handleSelectExploitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option =>
            exploits.find((exp: any) => exp.name === option.value)
        );
        // Add only if not already selected
        setSelectedExploits(prevState => [
            ...prevState,
            ...selected.filter(exp => !prevState.some(existingExp => existingExp.name === exp.name)),
        ]);
    };

    // Handle Select Payload Change
    const handleSelectPayloadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = Array.from(e.target.selectedOptions, option => ({
            name: option.value,
        }));
        // Add only if not already selected
        setSelectedPayloads(prevState => [
            ...prevState,
            ...selected.filter(payload => !prevState.some(existingPayload => existingPayload.name === payload.name)),
        ]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-900 text-white">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-8 space-y-6">
                <label className="block text-sm font-medium mb-2 text-gray-300">Summary</label>
                {/* Summary Bar */}
                <div className="bg-gray-700 p-2 rounded-lg mb-6">
                    {selectedExploits.length > 0 && (
                        <div className="text-green-300">Exploit(s): {selectedExploits.map(exp => exp.name).join(", ")}</div>
                    )}
                    {selectedPayloads.length > 0 && (
                        <div className="text-blue-300">Payload(s): {selectedPayloads.map(payload => payload.name).join(", ")}</div>
                    )}
                    {targets.length > 0 && (
                        <div className="text-red-300">Target(s): {targets.join(", ")}</div>
                    )}
                    <div className="text-purple-300">Thread(s): {threads}</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* CVE Input */}
                    <InputFieldComponent label="CVE Number" value={cve} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCve(e.target.value)} placeholder="CVE-2023-XXXX" />
                    <button type="button" onClick={() => fetchCveDetails(cve)} className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto">
                        Fetch Exploit
                    </button>

                    {/* Select Multiple Exploits */}
                    <SelectListComponent
                        label="Select Exploits"
                        options={[...new Set(exploits.map((exp) => exp.name))]} // Remove duplicates in the options
                        value={selectedExploits.map((exp: any) => exp.name)}
                        onChange={handleSelectExploitChange}
                    />

                    {/* Select Multiple Payloads */}
                    <SelectListComponent
                        label="Select Payloads"
                        options={[...new Set(exploits.map(exp => exp.fullname))]} // Remove duplicates in the options
                        value={selectedPayloads.map((payload: any) => payload.name)}
                        onChange={handleSelectPayloadChange}
                    />

                    {/* Targets Input */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium mb-2 text-gray-300">Targets (IP:Port)</label>
                        {targets.map((target, index) => (
                            <div key={index} className="flex space-x-2">
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => handleTargetChange(index, e.target.value)}
                                    className="w-full p-2 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-white"
                                    placeholder={`Target ${index + 1}`}
                                />
                            </div>
                        ))}
                        <button type="button" onClick={addTarget} className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                            Add Target
                        </button>
                    </div>

                    {/* Threads Input */}
                    <InputFieldComponent label="Threads" value={threads} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThreads(Number(e.target.value))} type="number" placeholder="Threads" />

                    {/* Submit Button */}
                    <button type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <div className={`text-center mt-4 ${loading ? 'text-blue-300' : 'text-yellow-400'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
