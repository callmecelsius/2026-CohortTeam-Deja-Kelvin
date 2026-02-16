import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { FaHome, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

import heroImg from '../assets/hero.jpg';
import missionImg from '../assets/mission.jpg';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F5ECD5] text-black">
      <NavBar />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Smarter Foster Management for Safer Animal Care
            </h1>

            <p className="mt-5 text-xl font-semibold leading-relaxed text-black/80">
              Track supplies, preserve medical histories, and keep every foster
              animal's information in one secure place; reducing loss, risk, and
              administrative stress for shelters.
            </p>
          </div>

          {/* Right Hero Image (Circle) */}
          <div className="flex justify-center">
            <div className="w-[450px] h-[450px] rounded-full overflow-hidden shadow-lg">
              <img
                src={heroImg}
                alt="Dog and cat"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <section className="mt-20">
          <h2 className="text-2xl font-extrabold tracking-wide mb-6">
            MISSION
          </h2>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Mission Image */}
            <img
              src={missionImg}
              alt="Mission animals"
              className="w-[370px] h-[210px] object-cover border border-black/20"
            />

            {/* Mission Text */}
            <p className="text-xl font-semibold leading-relaxed text-black/80 max-w-2xl">
              Empowering animal shelters and foster families with simple,
              reliable tools that protect animals, preserve resources, and
              strengthen lifesaving care. We eliminate inventory loss, prevent
              medical gaps, and ensure every animal's journey is supported by
              accurate records, responsible stewardship, and compassionate
              collaboration.
            </p>
          </div>
        </section>

        {/*CONTACT SECTION  */}
        <section className="mt-20">
          <div className="max-w-md mx-auto space-y-6">
            {/* Address */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl">
                <FaHome />
              </div>
              <span className="text-2xl font-extrabold">123 North Avenue</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl">
                <FaPhoneAlt />
              </div>
              <span className="text-2xl font-extrabold">415-555-5555</span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl">
                <FaEnvelope />
              </div>
              <span className="text-2xl font-extrabold">
                info@animalshelter.com
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
