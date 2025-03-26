import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div
            className="relative isolate px-4 bg-gradient-to-tr from-[#A1C4FD] to-[#C2E9FB] min-h-screen"
            style={{
                backgroundImage: "url('/images/wallpaper.jpg')", // Replace with your image path
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="flex flex-col items-center justify-center text-center sm:flex-row sm:text-left gap-6">
                    <div className="text-center sm:text-left">
                        {/* Flex container for image and text */}
                        <h1 className="text-5xl font-semibold tracking-tight text-gray-200 sm:text-7xl flex items-center gap-4 justify-center sm:justify-start">
                            {/* Image in front of text */}
                            <Image
                                src="/images/icon.png" // Path to your image
                                alt="Metasploit Logo"
                                width={100} // Adjust the width of the icon
                                height={100} // Adjust the height of the icon
                                className="rounded-full" // Optional: gives the image a circular shape
                            />
                            MemeSploit
                        </h1>

                        <p className="mt-8 text-lg font-medium text-gray-200 sm:text-xl max-w-prose">
                            Do you have what it takes to stay two steps ahead of the game?
                        </p>

                        console.log(process.env.MONGODB_URI);

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
        </div>
    );
}
