import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Logo & About */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              {/* MemeSploit Text */}
              <h2 className="text-2xl font-bold">MemeSploit</h2>
              {/* Icon beside "MemeSploit" */}
              <Image
                src="/images/icon2.png" // Path to your image
                alt="MemeSploit Logo"
                width={40} // Adjust the width of the icon
                height={40} // Adjust the height of the icon
                className="rounded-full" // Optional: gives the image a circular shape
              />
            </div>
            <p className="text-gray-400 mt-2 max-w-sm">
              Elevating digital experiences since 2022. Build something amazing together.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 text-center md:text-left">
            <div>
              <h3 className="font-semibold mb-2">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MemeSploit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
