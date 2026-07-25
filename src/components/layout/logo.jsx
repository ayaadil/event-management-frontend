// src/components/layout/logo.jsx
import { motion } from 'framer-motion';

const sizeMap = {
  sm: 24,
  md: 28,
  lg: 56,
};

function Logo({ showText = true, size = 'md' }) {
  const px = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <motion.svg
        width={px}
        height={px}
        viewBox="0 0 448 512"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: -15, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{ rotate: 12, scale: 1.1 }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="15%" stopColor="#891385" />
            <stop offset="53%" stopColor="#CEA3FE" />
            <stop offset="88%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#logoGradient)"
          animate={{
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: 'center' }}
          d="M248 106.6c18.9-9 32-28.3 32-50.6c0-30.9-25.1-56-56-56s-56 25.1-56 56c0 22.3 13.1 41.6 32 50.6v98.8c-2.8 1.3-5.5 2.9-8 4.7l-80.1-45.8c1.6-20.8-8.6-41.6-27.9-52.8C57.2 96 23 105.2 7.5 132S1.2 193 28 208.5c1.3.8 2.6 1.5 4 2.1v90.8c-1.3.6-2.7 1.3-4 2.1C1.2 319-8 353.2 7.5 380s49.7 36 76.5 20.5c19.3-11.1 29.4-32 27.8-52.8l50.5-28.9c-11.5-11.2-19.9-25.6-23.8-41.7l-50.5 29c-2.6-1.8-5.2-3.3-8-4.7v-90.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-.1 1.4-.2 2.8-.2 4.3c0 22.3 13.1 41.6 32 50.6v98.8c-18.9 9-32 28.3-32 50.6c0 30.9 25.1 56 56 56s56-25.1 56-56c0-22.3-13.1-41.6-32-50.6v-98.8c2.8-1.3 5.5-2.9 8-4.7l80.1 45.8c-1.6 20.8 8.6 41.6 27.8 52.8c26.8 15.5 61 6.3 76.5-20.5s6.3-61-20.5-76.5c-1.3-.8-2.7-1.5-4-2.1v-90.8c1.4-.6 2.7-1.3 4-2.1c26.8-15.5 36-49.7 20.5-76.5s-49.5-36-76.3-20.5c-19.3 11.1-29.4 32-27.8 52.8l-50.6 28.9c11.5 11.2 19.9 25.6 23.8 41.7l50.6-29c2.6 1.8 5.2 3.3 8 4.7v90.8c-2.8 1.3-5.5 2.9-8 4.6l-80.1-45.8c.1-1.4.2-2.8.2-4.3c0-22.3-13.1-41.6-32-50.6v-98.8z"
        />
      </motion.svg>
      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-xl font-serif tracking-wide text-slate-900 dark:text-white transition-colors duration-200"
        >
          Evently<span></span>
        </motion.span>
      )}
    </div>
  );
}

export default Logo;