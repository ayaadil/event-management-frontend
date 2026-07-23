import {
  Search,
  SlidersHorizontal,
  Bell,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between mb-10">

      {/* Left */}
      <div>
        <h1 className="text-4xl font-serif text-slate-900 dark:text-white">
          Hello, Ahmed 👋
        </h1>
        <p className="mt-2 text-purple-600 dark:text-purple-300">
          Discover amazing events happening around you.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="flex items-center w-[420px] px-5 py-3 rounded-2xl bg-white dark:bg-[#24143E] border border-purple-200 dark:border-purple-700/30">
          <Search
            size={20}
            className="text-purple-500 dark:text-purple-400"
          />

          <input
            type="text"
            placeholder="Search events..."
            className="ml-3 flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-purple-400 dark:placeholder:text-purple-400"
          />
        </div>

        {/* Filter */}
        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#24143E] hover:bg-purple-200 dark:hover:bg-purple-700 duration-300">
          <SlidersHorizontal
            size={20}
            className="text-slate-700 dark:text-white"
          />
        </button>

        {/* Notification */}
        <button className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#24143E] hover:bg-purple-200 dark:hover:bg-purple-700 duration-300">
          <Bell
            size={20}
            className="text-slate-700 dark:text-white"
          />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-pink-500"></span>
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="profile"
          className="h-12 w-12 rounded-full border-2 border-purple-500 object-cover"
        />
      </div>

    </header>
  );
}