"use client";
import { useState, useEffect } from "react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Importing Image component from Next.js

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null; // Prevents hydration errors in Next.js

	return (
		<nav className="bg-gray-600 text-white py-4 shadow-lg">
			<div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
				{/* Logo with Image Icon and Header Text */}
				<div className="flex items-center space-x-2">
					<Image
						src="/images/icon2.png" // Path to your image
						alt="Metasploit Logo"
						width={90} // Adjust the width of the icon
						height={10} // Adjust the height of the icon
						className="rounded-full" // Optional: gives the image a circular shape
					/>
				</div>

				{/* Desktop Navigation */}
				<div className="hidden md:flex space-x-8">
					<a href="#" className="text-gray-400 hover:text-white transition-all duration-200">Home</a>
					<a href="#about" className="text-gray-400 hover:text-white transition-all duration-200">About</a>
					<a href="#services" className="text-gray-400 hover:text-white transition-all duration-200">Services</a>
					<a href="#contact" className="text-gray-400 hover:text-white transition-all duration-200">Contact</a>
				</div>

				{/* Social Icons (Desktop) */}
				<div className="hidden md:flex space-x-4">
					<a href="#" className="text-gray-400 hover:text-white transition-all duration-200"><FaFacebook size={20} /></a>
					<a href="#" className="text-gray-400 hover:text-white transition-all duration-200"><FaTwitter size={20} /></a>
					<a href="#" className="text-gray-400 hover:text-white transition-all duration-200"><FaInstagram size={20} /></a>
				</div>

				{/* Mobile Menu Button */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="md:hidden focus:outline-none transition-all duration-300"
					aria-label="Toggle Menu"
				>
					{isOpen ? <IoClose size={28} className="text-white" /> : <IoMenu size={28} className="text-white" />}
				</button>
			</div>

			{/* ✅ Mobile Navigation (Animated & Responsive) */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="md:hidden bg-gray-800 text-center py-6 space-y-6 absolute top-16 left-0 w-full shadow-lg"
					>
						<a href="#" className="block text-gray-400 hover:text-white transition-all duration-200">Home</a>
						<a href="#about" className="block text-gray-400 hover:text-white transition-all duration-200">About</a>
						<a href="#services" className="block text-gray-400 hover:text-white transition-all duration-200">Services</a>
						<a href="#contact" className="block text-gray-400 hover:text-white transition-all duration-200">Contact</a>

						{/* Social Media (Mobile) */}
						<div className="flex justify-center space-x-4 pt-6">
							<a href="#" className="text-gray-400 hover:text-white transition-all duration-200"><FaFacebook size={20} /></a>
							<a href="#" className="text-gray-400 hover:text-white transition-all duration-200"><FaTwitter size={20} /></a>
							<a href="#" className="text-gray-400 hover:text-white transition-all duration-200"><FaInstagram size={20} /></a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav >
	);
}
