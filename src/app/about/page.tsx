"use client";

import { useState } from "react";
import Image from "next/image";

interface FormErrors {
    exploit?: string;
    ip?: string;
    port?: string;
    payload?: string;
    lhost?: string;
    lport?: string;
    os?: string;
    arch?: string;
    retries?: string;
}

export default function Home() {
    const [selectedExploit, setSelectedExploit] = useState<string>("");
    const [ipAddress, setIpAddress] = useState<string>("");
    const [port, setPort] = useState<string>("");
    const [payload, setPayload] = useState<string>("");
    const [lhost, setLhost] = useState<string>("");
    const [lport, setLport] = useState<string>("");
    const [targetOS, setTargetOS] = useState<string>("");
    const [targetArch, setTargetArch] = useState<string>("");
    const [retries, setRetries] = useState<string>("");
    const [errors, setErrors] = useState<FormErrors>({});

    // Example exploit options
    const exploits = [
        { value: "ms17_010", label: "MS17-010 EternalBlue" },
        { value: "apache_struts", label: "Apache Struts 2 RCE" },
        { value: "shellshock", label: "Shellshock Bash Vulnerability" },
        { value: "bluekeep", label: "BlueKeep RDP Vulnerability" },
        { value: "heartbleed", label: "Heartbleed OpenSSL Vulnerability" },
        { value: "dirty_cow", label: "Dirty COW Privilege Escalation" },
        { value: "poodle", label: "POODLE SSL Vulnerability" },
        { value: "sql_injection", label: "SQL Injection Vulnerability" },
    ];

    // Example payload options
    const payloads = [
        { value: "reverse_tcp", label: "Reverse TCP Shell" },
        { value: "meterpreter", label: "Meterpreter Shell" },
        { value: "cmd_shell", label: "Command Shell" },
        { value: "bind_tcp", label: "Bind TCP Shell" },
    ];

    // Example OS and architecture options
    const operatingSystems = [
        { value: "linux", label: "Linux" },
        { value: "windows", label: "Windows" },
        { value: "mac", label: "Mac OS" },
    ];

    const architectures = [
        { value: "x86", label: "x86 (32-bit)" },
        { value: "x64", label: "x64 (64-bit)" },
    ];

    // Validate form inputs
    const validateForm = () => {
        const newErrors: FormErrors = {};
        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!selectedExploit) {
            newErrors.exploit = "Please select an exploit from the list.";
        }
        if (!ipRegex.test(ipAddress)) {
            newErrors.ip = "Please enter a valid IP address.";
        }
        if (!port || isNaN(Number(port)) || Number(port) <= 0 || Number(port) > 65535) {
            newErrors.port = "Please enter a valid port number (1-65535).";
        }
        if (!payload) {
            newErrors.payload = "Please select a payload.";
        }
        if (!lhost) {
            newErrors.lhost = "Please enter a valid LHOST.";
        }
        if (!lport || isNaN(Number(lport)) || Number(lport) <= 0 || Number(lport) > 65535) {
            newErrors.lport = "Please enter a valid LPORT number (1-65535).";
        }
        if (!targetOS) {
            newErrors.os = "Please select a target OS.";
        }
        if (!targetArch) {
            newErrors.arch = "Please select the target architecture.";
        }
        if (!retries || isNaN(Number(retries)) || Number(retries) < 1) {
            newErrors.retries = "Please enter a valid number of retries.";
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        console.log("Exploit:", selectedExploit);
        console.log("IP Address:", ipAddress);
        console.log("Port:", port);
        console.log("Payload:", payload);
        console.log("LHOST:", lhost);
        console.log("LPORT:", lport);
        console.log("Target OS:", targetOS);
        console.log("Target Arch:", targetArch);
        console.log("Retries:", retries);

        // Reset form
        setSelectedExploit("");
        setIpAddress("");
        setPort("");
        setPayload("");
        setLhost("");
        setLport("");
        setTargetOS("");
        setTargetArch("");
        setRetries("");
        setErrors({});
    };

    return (
        <div
            className="relative isolate px-4 bg-gradient-to-tr from-[#A1C4FD] to-[#C2E9FB] min-h-screen"
            style={{
                backgroundImage: "url('/images/wallpaper.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="mx-auto max-w-4xl py-16 sm:py-24 lg:py-32 px-4 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-200 flex items-center justify-center gap-4 mb-6">
                        <Image
                            src="/images/icon.png"
                            alt="Metasploit Logo"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                        MemeSploit
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200">
                        Select the exploit and configure the parameters to launch the attack.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full p-6 bg-white bg-opacity-80 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {/* Exploit Selection */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="exploit" className="text-base sm:text-lg text-gray-800 font-medium">
                                Select Exploit:
                            </label>
                            <select
                                id="exploit"
                                value={selectedExploit}
                                onChange={(e) => setSelectedExploit(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.exploit ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                            >
                                <option value="">--Select Exploit--</option>
                                {exploits.map((exploit) => (
                                    <option key={exploit.value} value={exploit.value}>
                                        {exploit.label}
                                    </option>
                                ))}
                            </select>
                            {errors.exploit && <p className="text-red-500 text-sm">{errors.exploit}</p>}
                        </div>

                        {/* IP Address */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="ip" className="text-base sm:text-lg text-gray-800 font-medium">
                                Enter IP Address:
                            </label>
                            <input
                                type="text"
                                id="ip"
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.ip ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                                placeholder="Enter Target IP Address"
                            />
                            {errors.ip && <p className="text-red-500 text-sm">{errors.ip}</p>}
                        </div>

                        {/* Port Number */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="port" className="text-base sm:text-lg text-gray-800 font-medium">
                                Enter Port Number:
                            </label>
                            <input
                                type="text"
                                id="port"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.port ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                                placeholder="Enter Port Number"
                            />
                            {errors.port && <p className="text-red-500 text-sm">{errors.port}</p>}
                        </div>

                        {/* Payload Selection */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="payload" className="text-base sm:text-lg text-gray-800 font-medium">
                                Select Payload:
                            </label>
                            <select
                                id="payload"
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.payload ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                            >
                                <option value="">--Select Payload--</option>
                                {payloads.map((payloadOption) => (
                                    <option key={payloadOption.value} value={payloadOption.value}>
                                        {payloadOption.label}
                                    </option>
                                ))}
                            </select>
                            {errors.payload && <p className="text-red-500 text-sm">{errors.payload}</p>}
                        </div>

                        {/* LHOST */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lhost" className="text-base sm:text-lg text-gray-800 font-medium">
                                Enter LHOST:
                            </label>
                            <input
                                type="text"
                                id="lhost"
                                value={lhost}
                                onChange={(e) => setLhost(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.lhost ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                                placeholder="Enter LHOST for reverse shell"
                            />
                            {errors.lhost && <p className="text-red-500 text-sm">{errors.lhost}</p>}
                        </div>

                        {/* LPORT */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="lport" className="text-base sm:text-lg text-gray-800 font-medium">
                                Enter LPORT:
                            </label>
                            <input
                                type="text"
                                id="lport"
                                value={lport}
                                onChange={(e) => setLport(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.lport ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                                placeholder="Enter LPORT for reverse shell"
                            />
                            {errors.lport && <p className="text-red-500 text-sm">{errors.lport}</p>}
                        </div>

                        {/* Target OS */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="os" className="text-base sm:text-lg text-gray-800 font-medium">
                                Target OS:
                            </label>
                            <select
                                id="os"
                                value={targetOS}
                                onChange={(e) => setTargetOS(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.os ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                            >
                                <option value="">--Select OS--</option>
                                {operatingSystems.map((os) => (
                                    <option key={os.value} value={os.value}>
                                        {os.label}
                                    </option>
                                ))}
                            </select>
                            {errors.os && <p className="text-red-500 text-sm">{errors.os}</p>}
                        </div>

                        {/* Target Architecture */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="arch" className="text-base sm:text-lg text-gray-800 font-medium">
                                Target Architecture:
                            </label>
                            <select
                                id="arch"
                                value={targetArch}
                                onChange={(e) => setTargetArch(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.arch ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                            >
                                <option value="">--Select Architecture--</option>
                                {architectures.map((arch) => (
                                    <option key={arch.value} value={arch.value}>
                                        {arch.label}
                                    </option>
                                ))}
                            </select>
                            {errors.arch && <p className="text-red-500 text-sm">{errors.arch}</p>}
                        </div>

                        {/* Retry Count */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="retries" className="text-base sm:text-lg text-gray-800 font-medium">
                                Enter Retry Count:
                            </label>
                            <input
                                type="text"
                                id="retries"
                                value={retries}
                                onChange={(e) => setRetries(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.retries ? "border-red-500" : "border-gray-300"
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                                placeholder="Enter Retry Count for Attack"
                            />
                            {errors.retries && <p className="text-red-500 text-sm">{errors.retries}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        >
                            Launch Exploit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
