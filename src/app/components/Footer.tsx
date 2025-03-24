import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold">MemeSploit</h2>
              <Image
                src="/images/icon.png"
                alt="MemeSploit Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <p className="text-gray-400 mt-2 max-w-sm">
              Elevating digital experiences since 2022. Build something amazing together.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} MemeSploit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
