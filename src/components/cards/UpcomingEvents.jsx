import EventCard from "./EventCard";

const events = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
    title: "Music Festival",
    date: "24 May 2026",
    location: "Duhok",
    attendees: "2.3K",
    price: 39,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200",
    title: "Business Summit",
    date: "3 June 2026",
    location: "Erbil",
    attendees: "1.1K",
    price: 55,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200",
    title: "Tech Conference",
    date: "17 June 2026",
    location: "Baghdad",
    attendees: "3.8K",
    price: 75,
  },
];

export default function UpcomingEvents() {
  return (
    <section className="mt-12">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-3xl font-bold text-white">
          Upcoming Events
        </h2>

        <button className="text-purple-400 hover:text-white">
          View All
        </button>

      </div>

      <div className="grid gap-8 lg:grid-cols-3">

        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}

      </div>

    </section>
  );
}