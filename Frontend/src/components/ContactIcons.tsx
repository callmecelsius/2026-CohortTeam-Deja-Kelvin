import { FaHome, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

type ContactItem = {
  icon: React.ReactNode;
  text: string;
};

const items: ContactItem[] = [
  { icon: <FaHome />, text: "123 north avenue" },
  { icon: <FaPhoneAlt />, text: "415-555-5555" },
  { icon: <FaEnvelope />, text: "example@dkteam.com" },
];

export default function ContactIcons() {
  return (
    <div className="mx-auto mt-10 grid max-w-md gap-4">
      {items.map((item) => (
        <div key={item.text} className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-black text-white text-2xl">
            {item.icon}
          </div>
          <div className="text-2xl font-extrabold">{item.text}</div>
        </div>
      ))}
    </div>
  );
}
