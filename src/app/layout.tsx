import type { Metadata } from "next";
import './styles/globals.css'; // Relative path from app directory
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
    title: "Pentest Dashboard",
    description: "A penetration testing and security validation tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Navbar />
                <main>{children}</main> {/* Shows the current page */}
                <Footer />
            </body>
        </html>
    );
}
