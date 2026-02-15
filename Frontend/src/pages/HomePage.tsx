import React from "react"
import missionImg from "../assets/catgrooming.jpg"


export default function HomePage() {
  const [openUsers, setOpenUsers] = React.useState(false)

  return (
    <div className="min-h-screen bg-[#F6E8D8] text-slate-900">
      {/* Top Navbar */}
      <header className="bg-[#F3CFC3]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold leading-none">Logo</div>
              <div className="mt-1 text-2xl font-extrabold leading-none">
                Animal Shelter
              </div>
            </div>
          </div>

          {/* Right: Users dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenUsers((v) => !v)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-lg font-semibold hover:bg-black/5"
            >
              Users
              <ChevronDown />
            </button>

            {openUsers && (
              <div
                className="absolute right-0 mt-2 w-40 rounded-md bg-[#F6E8D8] p-2 shadow-lg ring-1 ring-black/10"
                onMouseLeave={() => setOpenUsers(false)}
              >
                <a
                  href="#"
                  className="block rounded px-3 py-2 text-right text-lg italic hover:bg-black/5"
                >
                  Employee
                </a>
                <a
                  href="#"
                  className="block rounded px-3 py-2 text-right text-lg italic hover:bg-black/5"
                >
                  Parent
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left column */}
          <div>
            <h2 className="text-2xl font-semibold">Home Page Content</h2>

            <h3 className="mt-14 text-2xl font-extrabold">Mission Statemnt</h3>

            <div className="mt-6 grid gap-6 md:grid-cols-[380px_1fr] md:items-start">
              <div className="overflow-hidden rounded-md bg-white shadow">
  <img
    src={missionImg}
    alt="Mission"
    className="h-48 w-full object-cover"
  />
</div>

              </div>

              {/* Mission text */}
              <p className="text-xl font-extrabold leading-snug">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliq
              </p>
            </div>
          </div>


<div className="mt-6 grid gap-6 md:grid-cols-[380px_1fr] md:items-start">
  {/* Mission Image */}
  <div className="overflow-hidden rounded-md bg-white shadow">
    <img
      src={missionImg}
      alt="Mission"
      className="h-48 w-full object-cover"
    />
  </div>

  {/* Mission text */}
  <p className="text-xl font-extrabold leading-snug">
    Lorem ipsum dolor sit amet...
  </p>
</div>



          {/* Right column: big circle image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative h-[420px] w-[420px] rounded-full bg-white shadow-xl ring-2 ring-black/10 md:h-[480px] md:w-[480px]">
              <img
                src={heroImg}
                alt="Puppy and kitten"
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Contact block (center-ish under hero) */}
        <div className="mt-10 flex justify-center">
          <div className="grid gap-4 text-lg font-semibold">
            <div className="flex items-center gap-4">
              <CircleIcon>
                <HomeIcon />
              </CircleIcon>
              <span>123 north avenue</span>
            </div>

            <div className="flex items-center gap-4">
              <CircleIcon>
                <PhoneIcon />
              </CircleIcon>
              <span>415-555-5555</span>
            </div>

            <div className="flex items-center gap-4">
              <CircleIcon>
                <MailIcon />
              </CircleIcon>
              <span>example@dkteam.com</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#D8BE8B]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row">
          <div className="flex gap-20 text-xl font-bold">
            <a href="#" className="hover:underline">
              About Us
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
          </div>

          <div className="flex items-center gap-6">
            <TikTokIcon className="h-10 w-10" />
            <FacebookIcon className="h-10 w-10" />
            <InstagramIcon className="h-10 w-10" />
          </div>
        </div>
      </footer>
    </div>
  )
}

/* --------------------- Small UI bits (icons) --------------------- */

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function CircleIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-12 w-12 place-items-center rounded-full bg-black text-white">
      {children}
    </span>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3h3l2 5-2 1c1 2 3 4 5 5l1-2 5 2v3c0 1-1 2-2 2-9 0-16-7-16-16 0-1 1-2 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="m4 7 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#000"
        d="M30 6c1.5 6.3 6.3 10.7 12 11v7c-4.7 0-8.6-1.5-12-4v14.7C30 40.6 25.6 45 20.2 45 14.6 45 10 40.4 10 34.8c0-5.5 4.4-10 10-10 1 0 2 .1 3 .4v7.6c-.8-.5-1.8-.8-2.8-.8-2.2 0-4 1.8-4 4 0 2.3 1.8 4 4 4 2.9 0 4.8-2.2 4.8-6.2V6h5.2Z"
      />
      <path
        fill="#00F2EA"
        d="M26 6v28.8c0 4-2.1 6.2-4.8 6.2-1.6 0-3-.9-3.7-2.2 0 .1 0 .2 0 .2 0 2.3 1.8 4 4 4 2.9 0 4.8-2.2 4.8-6.2V6H26Z"
        opacity=".8"
      />
      <path
        fill="#FF004F"
        d="M42 17v7c-4.7 0-8.6-1.5-12-4v-6.7c3.4 2.5 7.3 3.7 12 3.7Z"
        opacity=".8"
      />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#1877F2" />
      <path
        d="M26.7 38V26.1h4l.6-4.6h-4.6v-3c0-1.3.4-2.2 2.3-2.2H31V12c-.5-.1-2-.2-3.8-.2-3.8 0-6.4 2.3-6.4 6.6v3.1h-4.3v4.6h4.3V38h5.9Z"
        fill="#fff"
      />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <rect x="9" y="9" width="30" height="30" rx="9" fill="#000" />
      <rect x="14" y="14" width="20" height="20" rx="7" fill="none" stroke="#fff" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="5.5" fill="none" stroke="#fff" strokeWidth="2.5" />
      <circle cx="31.8" cy="16.2" r="1.6" fill="#fff" />
    </svg>
  )
}
