"use client";

import { useState } from 'react';
import Image from "next/image";

interface FormErrors {
    exploit?: string;
    ip?: string;
}

export default function Home() {
    const [selectedExploit, setSelectedExploit] = useState<string>('');
    const [ipAddress, setIpAddress] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});

    const validateForm = () => {
        const newErrors: FormErrors = {};
        if (!selectedExploit) {
            newErrors.exploit = 'Please select an exploit from the list.';
        }

        const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipRegex.test(ipAddress)) {
            newErrors.ip = 'Please enter a valid IP address.';
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

        console.log('Selected Exploit:', selectedExploit);
        console.log('IP Address:', ipAddress);

        setSelectedExploit('');
        setIpAddress('');
        setErrors({});
    };

    return (
        <div
            className="relative isolate px-4 bg-gradient-to-tr from-[#A1C4FD] to-[#C2E9FB] min-h-screen"
            style={{
                backgroundImage: 'url("/images/wallpaper.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
            }}
        >
            <div className="mx-auto max-w-md py-16 sm:py-24 lg:py-32 px-4 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-200 flex items-center justify-center gap-4 mb-6">
                        <Image
                            src="/images/icon.png" // Path to your image
                            alt="Metasploit Logo"
                            width={100} // Adjust the width of the icon
                            height={100} // Adjust the height of the icon
                            className="rounded-full" // Optional: gives the image a circular shape
                        />
                        MemeSploit
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200">
                        Select the exploit and enter the target IP address to proceed.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full p-6 bg-white bg-opacity-80 rounded-xl shadow-lg"
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="exploit" className="text-base sm:text-lg text-gray-800 font-medium">
                                Select Exploit:
                            </label>
                            <select
                                id="exploit"
                                value={selectedExploit}
                                onChange={(e) => setSelectedExploit(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.exploit ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                            >
                                <option value="">--Select Exploit--</option>
                                <option value="ms17_010">MS17-010 EternalBlue</option>
                                <option value="apache_struts">Apache Struts 2 Remote Code Execution</option>
                                <option value="shellshock">Shellshock Bash Vulnerability</option>
                                <option value="bluekeep">BlueKeep RDP Vulnerability</option>
                                <option value="heartbleed">Heartbleed OpenSSL Vulnerability</option>
                                <option value="dirty_cow">Dirty COW Privilege Escalation</option>
                            </select>
                            {errors.exploit && <p className="text-red-500 text-sm">{errors.exploit}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="ip" className="text-base sm:text-lg text-gray-800 font-medium">
                                Enter IP Address:
                            </label>
                            <input
                                type="text"
                                id="ip"
                                value={ipAddress}
                                onChange={(e) => setIpAddress(e.target.value)}
                                className={`p-2 sm:p-3 rounded-md text-gray-900 border ${errors.ip ? 'border-red-500' : 'border-gray-300'
                                    } shadow-sm focus:ring-2 focus:ring-indigo-500 w-full`}
                                placeholder="Enter Target IP Address"
                            />
                            {errors.ip && <p className="text-red-500 text-sm">{errors.ip}</p>}
                        </div>

                        <button
                            type="submit"
                            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 sm:px-6 sm:py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                        >
                            Launch Exploit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
