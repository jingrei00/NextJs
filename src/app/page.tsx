import Link from "next/link";
import Image from "next/image"; // Importing Image component from Next.js

export default function Home() {
    return (
        <div className="relative isolate px-6 bg-gradient-to-tr from-[#A1C4FD] to-[#C2E9FB]"> {/* Lighter gradient */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#A1C4FD] to-[#C2E9FB] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{}} />
            </div>
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:text-left gap-6">
                    <div className="text-center sm:text-left">
                        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl flex items-center gap-4 justify-center sm:justify-start">
                            {/* Metasploit Text */}
                            MemeSploit
                            {/* Icon beside "GUI" */}
                            <span className="flex items-center gap-2">
                                <Image
                                    src="/images/icon.png" // Path to your image
                                    alt="Metasploit Logo"
                                    width={100} // Adjust the width of the icon
                                    height={100} // Adjust the height of the icon
                                    className="rounded-full" // Optional: gives the image a circular shape
                                />
                            </span>
                        </h1>

                        {/* Paragraph beneath "Metasploit GUI" */}
                        <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl max-w-prose">
                            Company’s most used penetration testing framework. Knowledge is power, especially when it’s shared. A collaboration between the open source community and Rapid7, MemeSploit helps security teams do more than just verify vulnerabilities, manage security assessments, and improve security awareness; it empowers and arms defenders to always stay one step (or two) ahead of the game.
                        </p>

                        <div className="mt-10 flex items-center justify-center sm:justify-start gap-x-6">
                            <Link
                                href="/about"
                                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Get started
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background (same as header) */}
            <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                <div className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#A1C4FD] to-[#C2E9FB] opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{}} />
            </div>
        </div>
    );
}
