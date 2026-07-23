import { motion } from "framer-motion";
import { CalendarDays, Users, Ticket } from "lucide-react";

// المكون المعدل للوجو والتدرج بنفس ألوان الصورة
function Logo({ size = "md" }) {
  const sizeMap = { sm: 28, md: 42, lg: 56 };
  const px = sizeMap[size] || 42;

  return (
    <div className="flex items-center gap-3">
      <svg
        width={px}
        height={px}
        viewBox="0 0 448 512"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(216,180,254,0.4)]"
      >
        <defs>
          <linearGradient id="eventlyGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6B21A8" />   {/* بنفسجي غامق في الأسفل */}
            <stop offset="40%" stopColor="#A855F7" />  {/* بنفسجي زاهي */}
            <stop offset="80%" stopColor="#E9D5FF" />  {/* بنفسجي فاتح جداً */}
            <stop offset="100%" stopColor="#FFFFFF" /> {/* بياض مضيء في الطرف */}
          </linearGradient>
        </defs>
        <path
          fill="url(#eventlyGrad)"
          d="M248 106.6c18.9-9 32-28.3 32-50.6c0-30.9-25.1-56-56-56s-56 25.1-56 56c0 22.3 13.1 41.6 32 50.6v98.8c-2.8 1.3-5.5 2.9-8 4.7l-80.1-45.8c1.6-20.8-8.6-41.6-27.9-52.8C57.2 96 23 105.2 7.5 132S1.2 193 28 208.5c1.3.8 2.6 1.5 4 2.1v90.8c-1.3.6-2.7 1.3-4 2.1C1.2 319-8 353.2 7.5 380s49.7 36 76.5 20.5c19.3-11.1 29.4-32 27.8-52.8l50.5-28.9c-11.5-11.2-19.9-25.6-23.8-41.7l-50.5 29c-2.6-1.8-5.2-3.3-8-4.7v-90.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-.1 1.4-.2 2.8-.2 4.3c0 22.3 13.1 41.6 32 50.6v98.8c-18.9 9-32 28.3-32 50.6c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.3-13.1-41.6-32-50.6v-98.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-1.6 20.8 8.6 41.6 27.8 52.8c26.8 15.5 61 6.3 76.5-20.5s6.3-61-20.5-76.5c-1.3-.8-2.7-1.5-4-2.1v-90.8c1.4-.6 2.7-1.3 4-2.1c26.8-15.5 36-49.7 20.5-76.5s-49.5-36-76.3-20.5c-19.3 11.1-29.4 32-27.8 52.8l-50.6 28.9c11.5 11.2 19.9 25.6 23.8 41.7l50.6-29c2.6 1.8 5.2 3.3 8 4.7v90.8c-2.8 1.3-5.5 2.9-8 4.6l-80.1-45.8c.1-1.4.2-2.8.2-4.3c0-22.3-13.1-41.6-32-50.6v-98.8z"
        />
      </svg>
      
      <span className="text-2xl font-serif tracking-wide text-white">
        Evently
      </span>
    </div>
  );
}

const features = [
  {
    icon: <CalendarDays size={24} strokeWidth={2.2} />,
    title: "Discover Events",
    desc: "Find events that match your interests",
  },
  {
    icon: <Users size={24} strokeWidth={2.2} />,
    title: "Connect",
    desc: "Meet people and expand your network",
  },
  {
    icon: <Ticket size={24} strokeWidth={2.2} />,
    title: "Easy Tickets",
    desc: "Book and manage your tickets easily",
  },
];

export default function SplashScreen() {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center flex flex-col items-center justify-center px-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#120A2B]/85 to-[#120A2B]/95" />

      {/* Logo Component (Icon + Text side-by-side) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center"
      >
        <Logo size="lg" />

        <p className="mt-5 text-center text-lg text-white/90 leading-relaxed">
          Where moments turn,
          <br />
          into memories that last.
        </p>
      </motion.div>

      {/* Constellation */}
      <motion.svg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-10"
        width="230"
        height="130"
        viewBox="0 0 230 130"
      >
        <g stroke="#C4B5FD" strokeWidth="1">
          <line x1="115" y1="15" x2="45" y2="55" />
          <line x1="45" y1="55" x2="85" y2="95" />
          <line x1="85" y1="95" x2="145" y2="80" />
          <line x1="145" y1="80" x2="195" y2="50" />
          <line x1="115" y1="15" x2="165" y2="40" />
        </g>

        <circle cx="115" cy="15" r="6" fill="#E9D5FF" />
        <circle cx="45" cy="55" r="4" fill="#A855F7" />
        <circle cx="85" cy="95" r="4" fill="#A855F7" />
        <circle cx="145" cy="80" r="4" fill="#A855F7" />
        <circle cx="195" cy="50" r="4" fill="#A855F7" />
        <circle cx="165" cy="40" r="3" fill="#A855F7" opacity="0.7" />
      </motion.svg>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 mt-16 flex flex-wrap justify-center gap-10"
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex items-center gap-4 max-w-[250px]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-xl shadow-violet-900/40">
              <span className="text-white">{feature.icon}</span>
            </div>

            <div>
              <h3 className="text-white text-lg font-semibold">
                {feature.title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-purple-200">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Glow */}
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />

      {/* Floating circles */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
        className="absolute left-20 top-32 h-5 w-5 rounded-full bg-violet-400/40 blur-sm"
      />

      <motion.div
        animate={{
          y: [0, 18, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute right-24 top-52 h-7 w-7 rounded-full bg-fuchsia-400/30 blur-md"
      />

      <motion.div
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute bottom-40 right-40 h-6 w-6 rounded-full bg-violet-500/30 blur-sm"
      />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-white"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </div>
  );
}