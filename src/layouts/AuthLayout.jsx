import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        background: 'linear-gradient(135deg, #1a0f2e 0%, #3a2463 60%, #6b46a8 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md bg-[#F5F1E7] rounded-[2rem] p-10 shadow-2xl"
      >
        <Outlet />
      </motion.div>
    </div>
  );
}