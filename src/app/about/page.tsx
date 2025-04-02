'use client';

import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from "react";

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
        <label className="block text-sm font-medium mb-1 text-green-400">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-green-400 focus:ring-1 focus:ring-green-500 focus:outline-none font-mono placeholder-gray-600"
            placeholder={placeholder}
            aria-label={label}
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

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    label,
    options,
    onSelect,
    isOpen,
    setIsOpen,
    closeOtherDropdowns,
}) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

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

    return (
        <div className="relative w-full mb-4">
            <label className="block text-sm font-medium mb-1 text-green-400">{label}</label>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleFocus}
                className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-green-400 focus:ring-1 focus:ring-green-500 focus:outline-none font-mono placeholder-gray-600"
                placeholder="Search..."
                aria-label={`Search ${label}`}
            />
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute left-0 right-0 bg-gray-800 border border-gray-700 rounded mt-1 max-h-60 overflow-y-auto z-10 shadow-lg">
                    {filteredOptions.map((option, index) => (
                        <div
                            key={index}
                            className="p-2 cursor-pointer hover:bg-gray-700 text-green-400 font-mono text-sm"
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

// Custom Hook for Fetching Exploits
const useFetchExploits = () => {
    const [exploits, setExploits] = useState<Exploit[]>([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const fetchExploits = async () => {
            try {
                const res = await fetch("/api/exploits");
                const data = await res.json();
                if (res.ok) setExploits(data);
                else setMessage("Error fetching exploits");
            } catch (error) {
                setMessage("Error fetching exploits: " + (error as Error).message);
            }
        };
        fetchExploits();
    }, []);

    return { exploits, message, setMessage };
};

// CVE Search Hook
const useCveSearch = () => {
    const [searchResults, setSearchResults] = useState<Exploit | null>(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState("");

    const searchCve = async (cveId: string, exploits: Exploit[]) => {
        setSearching(true);
        setError("");

        try {
            // For demo purposes, we'll simulate an API call by searching the existing exploits
            // In a real app, this would be a backend API call
            const cvePattern = /CVE-\d{4}-\d+/i;
            if (!cvePattern.test(cveId)) {
                setError("Invalid CVE format. Use format: CVE-YYYY-NNNNN");
                setSearchResults(null);
                return null;
            }

            // Search for the exploit that matches the CVE
            const matchingExploit = exploits.find(exploit =>
                exploit.references?.some(ref =>
                    ref.toLowerCase().includes(cveId.toLowerCase())
                )
            );

            if (matchingExploit) {
                setSearchResults(matchingExploit);
                return matchingExploit;
            } else {
                setError(`No exploits found for ${cveId}`);
                setSearchResults(null);
                return null;
            }
        } catch (err) {
            setError(`Error searching for CVE: ${(err as Error).message}`);
            setSearchResults(null);
            return null;
        } finally {
            setSearching(false);
        }
    };

    return { searchCve, searchResults, searching, error };
};

interface Exploit {
    id?: string;
    name: string;
    platform: string;
    fullname: string;
    type?: string;
    rank?: number;
    description?: string;
    author?: string[];
    references?: string[];
    defaultTarget?: number;
    defaultPort?: string;
}

export default function ExploitForm() {
    const { exploits, message, setMessage } = useFetchExploits();
    const { searchCve, searching, error: searchError } = useCveSearch();

    const [selectedExploits, setSelectedExploits] = useState<string[]>([]);
    const [selectedPayloads, setSelectedPayloads] = useState<string[]>([]);
    const [selectedPlatform, setSelectedPlatforms] = useState<string[]>([]);
    const [targets, setTargets] = useState<string[]>([""]); // Initialize with one empty input
    const [threads, setThreads] = useState<number>(1);
    const [cveSearch, setCveSearch] = useState<string>("");
    const [statusMessage, setStatusMessage] = useState<string>("");

    // Additional state for Metasploit configuration
    const [rhost, setRhost] = useState<string>("");
    const [rport, setRport] = useState<string>("");
    const [lhost, setLhost] = useState<string>("");
    const [lport, setLport] = useState<string>("");
    const [ssl, setSsl] = useState<boolean>(false);
    const [verbose, setVerbose] = useState<boolean>(false);

    // Dropdown open/close states
    const [platformDropdownOpen, setPlatformDropdownOpen] = useState<boolean>(false);
    const [exploitDropdownOpen, setExploitDropdownOpen] = useState<boolean>(false);
    const [payloadDropdownOpen, setPayloadDropdownOpen] = useState<boolean>(false);

    const handleCveSearch = async () => {
        setStatusMessage("");
        const result = await searchCve(cveSearch, exploits);

        if (result) {
            // Auto-fill the form with the found exploit details
            if (result.name) {
                setSelectedExploits([result.name]);
            }

            if (result.platform) {
                setSelectedPlatforms([result.platform]);
            }

            if (result.fullname) {
                setSelectedPayloads([result.fullname]);
            }

            if (result.defaultPort) {
                setRport(result.defaultPort);
            }

            setStatusMessage(`[+] Found exploit for ${cveSearch}! Form populated.`);
        } else {
            setStatusMessage(`[-] ${searchError}`);
        }
    };

    const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (selectedExploits.length === 0) {
            setMessage("[-] ERROR: Select at least one exploit");
            return;
        }

        if (targets.length === 0 || targets[0] === "") {
            setMessage("[-] ERROR: Enter at least one target");
            return;
        }

        const exploitData = {
            exploits: selectedExploits,
            targets,
            payloads: selectedPayloads,
            threads,
            rhost,
            rport,
            lhost,
            lport,
            ssl,
            verbose
        };

        setMessage("[*] Launching exploit...");

        try {
            const res = await fetch("/api/exploits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(exploitData),
            });
            const data = await res.json();
            setMessage(res.ok ? "[+] Exploit executed successfully!" : `[-] ERROR: ${data.error}`);
        } catch (error) {
            setMessage("[-] Connection failed: " + (error as Error).message);
        }
    }, [selectedExploits, targets, selectedPayloads, threads, rhost, rport, lhost, lport, ssl, verbose, setMessage]);

    const handleTargetChange = (index: number, value: string) => {
        setTargets(prevTargets => {
            const newTargets = [...prevTargets];
            newTargets[index] = value;
            return newTargets;
        });
    };

    const handleAddTarget = () => {
        setTargets(prevTargets => [...prevTargets, ""]);
    };

    const handleRemoveTarget = (index: number) => {
        setTargets(prevTargets => prevTargets.filter((_, i) => i !== index));
    };

    const clearAllSelections = () => {
        setTargets([""]);
        setSelectedPlatforms([]);
        setSelectedExploits([]);
        setSelectedPayloads([]);
        setThreads(1);
        setRhost("");
        setRport("");
        setLhost("");
        setLport("");
        setSsl(false);
        setVerbose(false);
        setCveSearch("");
        setStatusMessage("");
    };

    const handlePlatformSelect = (value: string) => {
        setSelectedPlatforms([value]); // Only one platform at a time
        setPlatformDropdownOpen(false);
    };

    const handleExploitSelect = (value: string) => {
        if (!selectedExploits.includes(value)) {
            setSelectedExploits(prev => [...prev, value]);
            setExploitDropdownOpen(false);
        }
    };

    const handlePayloadSelect = (value: string) => {
        if (!selectedPayloads.includes(value)) {
            setSelectedPayloads(prev => [...prev, value]);
            setPayloadDropdownOpen(false);
        }
    };

    const closeOtherDropdowns = () => {
        setPlatformDropdownOpen(false);
        setExploitDropdownOpen(false);
        setPayloadDropdownOpen(false);
    };

    const removeExploit = (exploit: string) => {
        setSelectedExploits(prev => prev.filter(e => e !== exploit));
    };

    const removePayload = (payload: string) => {
        setSelectedPayloads(prev => prev.filter(p => p !== payload));
    };

    const currentTime = new Date().toLocaleTimeString();

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono">
            <div className="w-full bg-gray-900 p-2 sticky top-0 z-10 border-b border-green-500">
                <div className="flex items-center justify-between">
                    <div className="text-lg">MSF-X</div>
                    <div className="text-sm">{currentTime}</div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="bg-gray-900 rounded border border-green-500 shadow-lg overflow-hidden mb-6">
                    <div className="bg-black p-2 border-b border-green-500 flex justify-between items-center">
                        <h1 className="text-xl text-green-400">[ Memesploit Exploitation Framework ]</h1>
                        <div className="bg-green-500 text-black px-2 py-0.5 text-xs rounded-sm">PENTEST</div>
                    </div>

                    {/* Terminal-style message display */}
                    {(message || statusMessage) && (
                        <div className="bg-black p-3 font-mono text-sm overflow-x-auto whitespace-pre-wrap border-b border-gray-800">
                            {message && <div className={message.includes("ERROR") || message.includes("failed") ? "text-red-400" : message.includes("success") ? "text-green-400" : "text-yellow-400"}>{message}</div>}
                            {statusMessage && <div className={statusMessage.includes("[-]") ? "text-red-400" : "text-green-400"}>{statusMessage}</div>}
                        </div>
                    )}

                    {/* CVE Search */}
                    <div className="p-4 border-b border-gray-800">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <div className="flex-1">
                                <label className="block text-sm mb-1 text-green-400">CVE Lookup</label>
                                <input
                                    type="text"
                                    value={cveSearch}
                                    onChange={(e) => setCveSearch(e.target.value)}
                                    placeholder="CVE-YYYY-NNNNN"
                                    className="w-full p-2 border border-gray-700 rounded bg-black text-green-400 focus:ring-1 focus:ring-green-500 focus:outline-none font-mono"
                                />
                            </div>
                            <button
                                onClick={handleCveSearch}
                                disabled={searching}
                                className="mt-6 sm:mt-6 whitespace-nowrap px-4 py-2 bg-green-700 hover:bg-green-600 text-black rounded focus:outline-none transition-colors"
                            >
                                {searching ? "SEARCHING..." : "SEARCH CVE"}
                            </button>
                        </div>
                    </div>

                    {/* Current Config Display */}
                    <div className="p-4 bg-black border-b border-gray-800">
                        <h2 className="text-sm uppercase mb-2 text-green-500">[ Current Configuration ]</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div>
                                <div className="mb-2">
                                    <span className="text-gray-500">$</span> <span className="text-green-400">TARGETS:</span>
                                    <span className="ml-2">{targets.length > 0 && targets[0] !== "" ? targets.join(", ") : "<none>"}</span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-gray-500">$</span> <span className="text-green-400">PLATFORM:</span>
                                    <span className="ml-2">{selectedPlatform.length > 0 ? selectedPlatform.join(", ") : "<none>"}</span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-gray-500">$</span> <span className="text-green-400">EXPLOITS:</span>
                                    {selectedExploits.length > 0 ? (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {selectedExploits.map(exploit => (
                                                <span key={exploit} className="bg-gray-800 px-2 py-0.5 rounded text-xs flex items-center border border-gray-700">
                                                    {exploit}
                                                    <button onClick={() => removeExploit(exploit)} className="ml-1 text-red-400 hover:text-red-300">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="ml-2">&lt;none&gt;</span>}
                                </div>

                                <div className="mb-2">
                                    <span className="text-gray-500">$</span> <span className="text-green-400">PAYLOADS:</span>
                                    {selectedPayloads.length > 0 ? (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {selectedPayloads.map(payload => (
                                                <span key={payload} className="bg-gray-800 px-2 py-0.5 rounded text-xs flex items-center border border-gray-700">
                                                    {payload}
                                                    <button onClick={() => removePayload(payload)} className="ml-1 text-red-400 hover:text-red-300">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    ) : <span className="ml-2">&lt;none&gt;</span>}
                                </div>
                            </div>

                            <div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="mb-2">
                                        <span className="text-gray-500">$</span> <span className="text-green-400">RHOST:</span>
                                        <span className="ml-2">{rhost || "<none>"}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-500">$</span> <span className="text-green-400">RPORT:</span>
                                        <span className="ml-2">{rport || "<none>"}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-500">$</span> <span className="text-green-400">LHOST:</span>
                                        <span className="ml-2">{lhost || "<none>"}</span>
                                    </div>
                                    <div className="mb-2">
                                        <span className="text-gray-500">$</span> <span className="text-green-400">LPORT:</span>
                                        <span className="ml-2">{lport || "<none>"}</span>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <span className="text-gray-500">$</span> <span className="text-green-400">THREADS:</span>
                                    <span className="ml-2">{threads}</span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-gray-500">$</span> <span className="text-green-400">OPTIONS:</span>
                                    <span className="ml-2">
                                        {ssl && <span className="bg-gray-800 px-1 py-0.5 rounded mr-1 border border-green-900">SSL</span>}
                                        {verbose && <span className="bg-gray-800 px-1 py-0.5 rounded border border-green-900">VERBOSE</span>}
                                        {!ssl && !verbose && "<none>"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-4 border-b border-gray-800">
                        <button
                            type="button"
                            onClick={() => {
                                setLhost("192.168.1.100");
                                setLport("4444");
                                setRport("445");
                            }}
                            className="flex-1 p-2 text-black bg-yellow-500 rounded hover:bg-yellow-400 focus:outline-none transition-colors text-sm font-bold"
                        >
                            AUTO-FILL
                        </button>

                        <button
                            type="button"
                            className="flex-1 p-2 text-black bg-red-600 rounded hover:bg-red-500 focus:outline-none transition-colors text-sm font-bold"
                            onClick={clearAllSelections}
                        >
                            CLEAR ALL
                        </button>


                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left column */}
                            <div>
                                <SearchableDropdown
                                    label="Platform"
                                    options={exploits.map(exp => exp.platform)}
                                    onSelect={handlePlatformSelect}
                                    isOpen={platformDropdownOpen}
                                    setIsOpen={setPlatformDropdownOpen}
                                    closeOtherDropdowns={closeOtherDropdowns}
                                />

                                <SearchableDropdown
                                    label="Exploit"
                                    options={exploits.map(exp => exp.name)}
                                    onSelect={handleExploitSelect}
                                    isOpen={exploitDropdownOpen}
                                    setIsOpen={setExploitDropdownOpen}
                                    closeOtherDropdowns={closeOtherDropdowns}
                                />

                                <SearchableDropdown
                                    label="Payload"
                                    options={exploits.map(exp => exp.fullname)}
                                    onSelect={handlePayloadSelect}
                                    isOpen={payloadDropdownOpen}
                                    setIsOpen={setPayloadDropdownOpen}
                                    closeOtherDropdowns={closeOtherDropdowns}
                                />

                                <InputFieldComponent
                                    label="Threads"
                                    value={threads.toString()}
                                    onChange={(e) => setThreads(e.target.value ? Number(e.target.value) : 1)}
                                    placeholder="1"
                                    type="number"
                                />
                            </div>

                            {/* Right column */}
                            <div>
                                <InputFieldComponent
                                    label="RHOST"
                                    value={rhost}
                                    onChange={(e) => setRhost(e.target.value)}
                                    placeholder="Target IP"
                                />

                                <InputFieldComponent
                                    label="RPORT"
                                    value={rport}
                                    onChange={(e) => setRport(e.target.value)}
                                    placeholder="Target Port"
                                />

                                <InputFieldComponent
                                    label="LHOST"
                                    value={lhost}
                                    onChange={(e) => setLhost(e.target.value)}
                                    placeholder="Local IP for reverse shell"
                                />

                                <InputFieldComponent
                                    label="LPORT"
                                    value={lport}
                                    onChange={(e) => setLport(e.target.value)}
                                    placeholder="Local Port"
                                />
                            </div>
                        </div>

                        {/* Target Input Fields */}
                        <div className="mt-4">
                            <h3 className="text-sm uppercase mb-2 text-green-500">[ Target IPs/Ranges ]</h3>
                            {targets.map((target, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={target}
                                        onChange={(e) => handleTargetChange(index, e.target.value)}
                                        placeholder="192.168.0.1 or 192.168.0.1-100"
                                        className="flex-1 p-2 border border-gray-700 rounded bg-black text-green-400 focus:ring-1 focus:ring-green-500 focus:outline-none font-mono"
                                    />
                                    {targets.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTarget(index)}
                                            className="ml-2 text-red-500 hover:text-red-400"
                                        >
                                            DEL
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddTarget}
                                className="text-green-500 hover:text-green-400 flex items-center text-sm"
                            >
                                + ADD TARGET
                            </button>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="ssl"
                                    checked={ssl}
                                    onChange={() => setSsl(!ssl)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-700 rounded bg-black"
                                />
                                <label htmlFor="ssl" className="text-green-400">SSL</label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="verbose"
                                    checked={verbose}
                                    onChange={() => setVerbose(!verbose)}
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-700 rounded bg-black"
                                />
                                <label htmlFor="verbose" className="text-green-400">VERBOSE</label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-6 p-3 text-black bg-green-500 rounded hover:bg-green-400 focus:outline-none transition-colors font-bold flex items-center justify-center"
                        >
                            <span>LAUNCH EXPLOIT</span>
                        </button>
                    </form>
                </div>

                <div className="text-xs text-center text-gray-600 mt-2">
                    MSF-X | Advanced Exploitation Framework | v2.5.1
                </div>
            </div>
        </div>
    );
}