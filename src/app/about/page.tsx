"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ExploitForm() {
    const [exploits, setExploits] = useState<{ _id: string; name: string; cve: string }[]>([]);
    const [selectedExploit, setSelectedExploit] = useState("");
    const [ipAddress, setIpAddress] = useState("");
    const [port, setPort] = useState("");
    const [payload, setPayload] = useState("");
    const [lhost, setLhost] = useState("");
    const [lport, setLport] = useState("");
    const [targetOS, setTargetOS] = useState("");
    const [targetArch, setTargetArch] = useState("");
    const [retries, setRetries] = useState("");
    const [message, setMessage] = useState("");
    const [cveInput, setCveInput] = useState(""); // For CVE number input

    useEffect(() => {
        const fetchExploits = async () => {
            const res = await fetch("/api/exploits");
            const data = await res.json();
            if (res.ok) {
                setExploits(data);
            } else {
                setMessage("Error fetching exploits");
            }
        };

        fetchExploits();
    }, []);

    useEffect(() => {
        // Filter the exploits based on the CVE number entered
        if (cveInput) {
            const matchingExploit = exploits.find(exploit => exploit.cve === cveInput);
            if (matchingExploit) {
                setSelectedExploit(matchingExploit.name);
            } else {
                setSelectedExploit(""); // Reset if no match
            }
        }
    }, [cveInput, exploits]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        const exploitData = {
            name: selectedExploit,
            ip_address: ipAddress,
            port,
            payload,
            lhost,
            lport,
            target_os: targetOS,
            target_arch: targetArch,
            retries,
        };

        const res = await fetch("/api/exploits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exploitData),
        });

        const data = await res.json();
        if (res.ok) {
            setMessage("Exploit successfully added!");
            setSelectedExploit("");
            setIpAddress("");
            setPort("");
            setPayload("");
            setLhost("");
            setLport("");
            setTargetOS("");
            setTargetArch("");
            setRetries("");
            setCveInput(""); // Reset CVE input
        } else {
            setMessage(`Error: ${data.error}`);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-6"
            style={{
                backgroundImage: "url('/images/wallpaper.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="bg-white w-full max-w-6xl p-8 rounded-lg shadow-lg">
                <div className="text-center sm:text-left mb-8">
                    <h1 className="text-5xl font-semibold tracking-tight text-gray-800 sm:text-7xl flex items-center gap-4 justify-center sm:justify-start">
                        <Image
                            src="/images/icon.png"
                            alt="Metasploit Logo"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                        MemeSploit
                    </h1>
                </div>

                <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-center mb-6">Add New Exploit</h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {/* CVE Number */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">CVE Number</label>
                            <input
                                type="text"
                                name="cve_number"
                                value={cveInput}
                                onChange={(e) => setCveInput(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter CVE number"
                            />
                        </div>

                        {/* Select Exploit */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">Select Exploit</label>
                            <select
                                name="exploit"
                                value={selectedExploit}
                                onChange={(e) => setSelectedExploit(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select an exploit</option>
                                {exploits.map((exploit) => (
                                    <option key={exploit._id} value={exploit.name}>
                                        {exploit.name}
                                    </option>
                                ))}
                            </select>
                        </div>



                        {/* IP Address */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">IP Address</label>
                            <input
                                type="text"
                                name="ip_address"
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Port */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">Port</label>
                            <input
                                type="text"
                                name="port"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Payload */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">Payload</label>
                            <input
                                type="text"
                                name="payload"
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* LHOST */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">LHOST</label>
                            <input
                                type="text"
                                name="lhost"
                                value={lhost}
                                onChange={(e) => setLhost(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* LPORT */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">LPORT</label>
                            <input
                                type="text"
                                name="lport"
                                value={lport}
                                onChange={(e) => setLport(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Target OS */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">Target OS</label>
                            <select
                                name="target_os"
                                value={targetOS}
                                onChange={(e) => setTargetOS(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select OS</option>
                                <option value="linux">Linux</option>
                                <option value="windows">Windows</option>
                                <option value="mac">Mac OS</option>
                            </select>
                        </div>

                        {/* Target Architecture */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">Target Architecture</label>
                            <select
                                name="target_arch"
                                value={targetArch}
                                onChange={(e) => setTargetArch(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Architecture</option>
                                <option value="x86">x86 (32-bit)</option>
                                <option value="x64">x64 (64-bit)</option>
                            </select>
                        </div>

                        {/* Retries */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium">Retries</label>
                            <input
                                type="text"
                                name="retries"
                                value={retries}
                                onChange={(e) => setRetries(e.target.value)}
                                className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="col-span-1 sm:col-span-2">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                            >
                                Submit Exploit
                            </button>
                        </div>

                        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
}
