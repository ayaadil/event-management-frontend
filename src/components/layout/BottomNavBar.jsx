// src/components/layout/BottomNavBar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Plus, Ticket, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/explore', icon: Search, label: 'Explore' },
];

const navItemsAfterCenter = [
  { to: '/tickets', icon: Ticket, label: 'Tickets' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNavBar() {
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ background: '#150a29' }}
    >
      <div className="flex items-center justify-between px-6 py-3 border-t border-purple-900/40">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                isActive ? 'text-white' : 'text-purple-300/50'
              }`
            }
          >
            <Icon size={22} />
          </NavLink>
        ))}

        {/* الزر الدائري البارز بالنص - Create Event */}
        <button
          onClick={() => navigate('/create-event')}
          className="relative -mt-6"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #9747FF 0%, #E056A0 100%)',
            }}
          >
            <Plus size={26} className="text-white" />
          </motion.div>
        </button>

        {navItemsAfterCenter.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
                isActive ? 'text-white' : 'text-purple-300/50'
              }`
            }
          >
            <Icon size={22} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
}