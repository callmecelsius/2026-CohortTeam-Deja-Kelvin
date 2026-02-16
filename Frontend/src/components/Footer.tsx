import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#D9BF86] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between">

        {/* Left Links */}
        <div className="flex gap-12 text-2xl font-extrabold">
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-6 mt-6 md:mt-0">
          <a
            href="#"
            className="text-3xl hover:scale-110 transition"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>

          <a
            href="#"
            className="bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full hover:scale-110 transition"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            className="text-3xl hover:scale-110 transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>

      </div>
    </footer>
  );
}
