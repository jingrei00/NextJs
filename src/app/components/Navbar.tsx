"use client";
import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Importing Image component from Next.js
import Link from "next/link"; // Import Link for client-side routing

const Navbar: React.FC = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<nav className="bg-gray-600 text-white shadow-lg relative z-40">
			<div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-50">
				{/* Logo with Image Icon and Header Text */}
				<div className="flex items-center space-x-2 z-50">
					<Image
						src="/images/icon.png" // Path to your image
						alt="Metasploit Logo"
						width={90} // Adjust the width of the icon
						height={90} // Adjust the height of the icon
						className="rounded-full" // Optional: gives the image a circular shape
					/>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex space-x-8 z-50">
					<Link href="/" className="text-white hover:text-gray-400 transition-all duration-200">
						Home
					</Link>
					<Link href="/about" className="text-white hover:text-gray-400 transition-all duration-200">
						About
					</Link>
					<Link href="#services" className="text-white hover:text-gray-400 transition-all duration-200">
						Services
					</Link>
					<Link href="#contact" className="text-white hover:text-gray-400 transition-all duration-200">
						Contact
					</Link>
				</div>

				<button
					onClick={() => setIsOpen(!isOpen)}
					className="md:hidden focus:outline-none transition-all duration-300 z-50"
					aria-label="Toggle Menu"
				>
					{isOpen ? <IoClose size={28} className="text-white" /> : <IoMenu size={28} className="text-white" />}
				</button>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="md:hidden bg-gray-800 text-center py-6 space-y-6 absolute top-16 left-0 w-full shadow-lg z-40"
					>
						<Link href="/" className="block text-white hover:text-gray-400 transition-all duration-200">
							Home
						</Link>
						<Link href="#about" className="block text-white hover:text-gray-400 transition-all duration-200">
							About
						</Link>
						<Link href="#services" className="block text-white hover:text-gray-400 transition-all duration-200">
							Services
						</Link>
						<Link href="#contact" className="block text-white hover:text-gray-400 transition-all duration-200">
							Contact
						</Link>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;
