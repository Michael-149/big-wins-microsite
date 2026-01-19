interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-sil-teal-3/30 md:-ml-px" />

        {/* Timeline Events */}
        <div className="space-y-12">
          {events.map((event, index) => (
            <div
              key={index}
              className="relative flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Year Badge */}
              <div className="absolute left-0 md:left-1/2 flex items-center justify-center md:-ml-10">
                <div className="w-8 h-8 bg-sil-teal-1 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              {/* Content */}
              <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                <div className="bg-white border-2 border-sil-teal-3 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <p className="text-sil-teal-2 font-bold text-sm uppercase tracking-wider mb-2">
                    {event.year}
                  </p>
                  <h4 className="text-xl font-bold text-black mb-2">
                    {event.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Empty space for alternating layout on desktop */}
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
  );
}
