import {
  Calendar,
  MapPin,
  Heart,
  Users,
} from "lucide-react";

export default function EventCard({
  image,
  title,
  date,
  location,
  attendees,
  price,
}) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-[#1D1236] border border-purple-900/30 transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-900/30">

      {/* Image */}

      <div className="relative h-60 overflow-hidden">

        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <button className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md">

          <Heart size={20} className="text-white" />

        </button>

      </div>

      {/* Content */}

      <div className="p-6">

        <div className="flex items-center gap-2 text-sm text-purple-300">

          <Calendar size={16} />

          {date}

        </div>

        <h2 className="mt-3 text-2xl font-bold text-white">
          {title}
        </h2>

        <div className="mt-4 flex items-center gap-2 text-gray-300">

          <MapPin size={16} />

          {location}

        </div>

        <div className="mt-3 flex items-center gap-2 text-gray-300">

          <Users size={16} />

          {attendees} Going

        </div>

        <div className="mt-6 flex items-center justify-between">

          <div>

            <p className="text-gray-400 text-sm">
              From
            </p>

            <h3 className="text-2xl font-bold text-white">
              ${price}
            </h3>

          </div>

          <button className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-700 px-6 py-3 font-semibold text-white transition hover:scale-105">

            Get Ticket

          </button>

        </div>

      </div>

    </div>
  );
}