'use client';

import { useState, useEffect, useCallback, ChangeEvent, FormEvent, useRef } from "react";

// Input Field Component
interface InputFieldProps {
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type?: string;
}

const InputFieldComponent: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="w-full mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder={placeholder}
        />
    </div>
);

// Custom Searchable Dropdown Component
interface SearchableDropdownProps {
    label: string;
    options: string[];
    onSelect: (option: string) => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    closeOtherDropdowns: () => void;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({ label, options, onSelect, isOpen, setIsOpen, closeOtherDropdowns }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const uniqueOptions = Array.from(new Set(options));

    const filteredOptions = uniqueOptions.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOptionClick = (option: string) => {
        onSelect(option);
        setSearchTerm(""); // Clear input field after selection
        setIsOpen(false); // Close dropdown on selection
    };

    const handleFocus = () => {
        closeOtherDropdowns(); // Close other dropdowns when this one gets focus
        setIsOpen(true); // Open current dropdown
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, [setIsOpen]);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="relative w-full mb-4" ref={dropdownRef}>
            <label className="block text-sm font-medium mb-2 text-gray-700">{label}</label>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleFocus}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Search..."
            />
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className="p-2 cursor-pointer hover:bg-blue-100"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface Exploit {
    name: string;
    platform: string;
    fullname: string;
}

export default function ExploitForm() {
    const [exploits, setExploits] = useState<Exploit[]>([]);
    const [selectedExploits, setSelectedExploits] = useState<string[]>([]);
    const [selectedPayloads, setSelectedPayloads] = useState<string[]>([]);
    const [selectedPlatform, setSelectedPlatforms] = useState<string[]>([]);
    const [targets, setTargets] = useState<string[]>([]);
    const [threads, setThreads] = useState<number>(1);
    const [message, setMessage] = useState<string>("");

    // Dropdown open/close states
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState<boolean>(false);
    const [exploitDropdownOpen, setExploitDropdownOpen] = useState<boolean>(false);
    const [payloadDropdownOpen, setPayloadDropdownOpen] = useState<boolean>(false);

    // Fetch Exploits from the API
    useEffect(() => {
        const fetchExploits = async () => {
            try {
                const res = await fetch("/api/exploits");
                const data = await res.json();
                if (res.ok) setExploits(data);
                else setMessage("Error fetching exploits");
            } catch (error) {
                const typedError = error as Error;
                setMessage("Error fetching exploits: " + typedError.message);
            }
        };
        fetchExploits();
    }, []);

    // Handle Form Submission
    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMessage("");

        const exploitData = {
            exploits: selectedExploits,
            targets,
            payloads: selectedPayloads,
            threads,
        };

        try {
            const res = await fetch("/api/exploits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(exploitData),
            });
            const data = await res.json();
            setMessage(res.ok ? "Exploits executed successfully!" : `Error: ${data.error}`);
        } catch (error) {
            const typedError = error as Error;
            setMessage("Submission failed. Please try again: " + typedError.message);
        }
    }, [threads, selectedExploits, selectedPayloads, targets]);

    // Handle Target Change
    const handleTargetChange = (index: number, value: string) => {
        setTargets(prevTargets => {
            const newTargets = [...prevTargets];
            newTargets[index] = value;
            return newTargets;
        });
    };

    // Clear Individual Selection
    const clearSelection = (type: "platform" | "exploit" | "payload") => {
        if (type === "platform") {
            setSelectedPlatforms([]);
        } else if (type === "exploit") {
            setSelectedExploits([]);
        } else if (type === "payload") {
            setSelectedPayloads([]);
        }
    };

    const clearAllSelections = () => {
        setTargets([]);
        setSelectedPlatforms([]);
        setSelectedExploits([]);
        setSelectedPayloads([]);
        setThreads(1);
    };

    // Handle selection to prevent duplicates
    const handlePlatformSelect = (value: string) => {
        if (!selectedPlatform.includes(value)) {
            setSelectedPlatforms(prev => [...prev, value]);
            setPlatformDropdownOpen(false); // Close the platform dropdown after selection
        }
    };

    const handleExploitSelect = (value: string) => {
        if (!selectedExploits.includes(value)) {
            setSelectedExploits(prev => [...prev, value]);
            setExploitDropdownOpen(false); // Close the exploit dropdown after selection
        }
    };

    const handlePayloadSelect = (value: string) => {
        if (!selectedPayloads.includes(value)) {
            setSelectedPayloads(prev => [...prev, value]);
            setPayloadDropdownOpen(false); // Close the payload dropdown after selection
        }
    };

    const closeOtherDropdowns = () => {
        setPlatformDropdownOpen(false);
        setExploitDropdownOpen(false);
        setPayloadDropdownOpen(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-r from-yellow-300 to-green-400">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-8 space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="text-gray-700">
                        <strong>Targets: </strong>
                        {targets.length > 0 ? (
                            targets.join(", ")
                        ) : (
                            <span>No IP address selected</span>
                        )}
                    </div>
                    <div className="text-gray-700">
                        <strong>Selected Platform: </strong>
                        {selectedPlatform.length > 0 ? (
                            selectedPlatform.map((exp, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{exp}</span>
                                    <button onClick={() => clearSelection("platform")} className="text-red-500 hover:text-red-600">Clear</button>
                                </div>
                            ))
                        ) : (
                            <span>No Platform Selected</span>
                        )}
                    </div>
                    <div className="text-gray-700">
                        <strong>Selected Exploits: </strong>
                        {selectedExploits.length > 0 ? (
                            selectedExploits.map((exp, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{exp}</span>
                                    <button onClick={() => clearSelection("exploit")} className="text-red-500 hover:text-red-600">Clear</button>
                                </div>
                            ))
                        ) : (
                            <span>No Exploits Selected</span>
                        )}
                    </div>
                    <div className="text-gray-700">
                        <strong>Selected Payloads: </strong>
                        {selectedPayloads.length > 0 ? (
                            selectedPayloads.map((payload, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span>{payload}</span>
                                    <button onClick={() => clearSelection("payload")} className="text-red-500 hover:text-red-600">Clear</button>
                                </div>
                            ))
                        ) : (
                            <span>No Payloads Selected</span>
                        )}
                    </div>
                    <div className="text-gray-700">
                        <strong>Threads: </strong>
                        {threads}
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full p-3 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
                    onClick={clearAllSelections}
                >
                    Clear All
                </button>

                <form onSubmit={handleSubmit}>
                    {/* Select Platform */}
                    <SearchableDropdown
                        label="Select Platform"
                        options={exploits.map(exp => exp.platform)}
                        onSelect={handlePlatformSelect}
                        isOpen={platformDropdownOpen}
                        setIsOpen={setPlatformDropdownOpen}
                        closeOtherDropdowns={closeOtherDropdowns}
                    />

                    {/* Select Exploit */}
                    <SearchableDropdown
                        label="Select Exploit"
                        options={exploits.map(exp => exp.name)}
                        onSelect={handleExploitSelect}
                        isOpen={exploitDropdownOpen}
                        setIsOpen={setExploitDropdownOpen}
                        closeOtherDropdowns={closeOtherDropdowns}
                    />

                    {/* Select Payload */}
                    <SearchableDropdown
                        label="Select Payload"
                        options={exploits.map(exp => exp.fullname)}
                        onSelect={handlePayloadSelect}
                        isOpen={payloadDropdownOpen}
                        setIsOpen={setPayloadDropdownOpen}
                        closeOtherDropdowns={closeOtherDropdowns}
                    />

                    {/* Target Input Fields */}
                    {targets.map((target, index) => (
                        <InputFieldComponent
                            key={index}
                            label={`Target ${index + 1}`}
                            value={target}
                            onChange={(e) => handleTargetChange(index, e.target.value)}
                            placeholder="Enter IP or Range (e.g. 192.168.0.1 or 192.168.0.1-192.168.0.100)"
                        />
                    ))}

                    {/* Threads */}
                    <InputFieldComponent
                        label="Threads"
                        value={threads.toString()}
                        onChange={(e) => setThreads(Number(e.target.value))}
                        placeholder="Enter number of threads"
                        type="number"
                    />

                    {/* Submit Button */}
                    <div className="flex items-center justify-between mt-6">
                        <button
                            type="submit"
                            className="w-full p-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
                            disabled={message.includes("Error") || message.includes("failed")}
                        >
                            {message.includes("Error") ? "Try Again" : "Exploit your target"}
                        </button>
                    </div>
                </form>

                {/* Hacking Quote */}
                <div className="text-center text-lg font-semibold text-green-400 mt-6">
                    <p>The best way to predict the future is to hack it - Jing Rei</p>
                </div>

                {/* Error or Success Message */}
                {message && (
                    <div className="mt-6 text-center text-lg font-semibold text-red-500">
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
