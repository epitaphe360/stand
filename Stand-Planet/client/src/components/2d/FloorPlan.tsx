import { useBooths } from "@/hooks/use-booths";

export function FloorPlan({ eventId }: { eventId: number }) {
  const { data: booths, isLoading } = useBooths(eventId);

  if (isLoading) return <div className="animate-pulse h-64 bg-muted rounded-xl" />;

  // Mock layout for demonstration - in a real app, this would use the booth coordinates
  // Coordinates are normalized 0-100
  
  return (
    <div className="relative w-full aspect-[4/3] bg-white border border-border rounded-xl shadow-sm overflow-hidden p-8">
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="border border-foreground" />
        ))}
      </div>
      
      <div className="relative w-full h-full border-2 border-dashed border-muted-foreground/30 rounded-lg">
        {/* Entrance */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold z-10">
          ENTRANCE
        </div>

        {booths?.map((booth) => {
          // Parse position from JSON if valid, otherwise fallback
          const pos = (booth.position as any) || { x: 10, y: 10 };
          const statusColors = {
            available: "bg-emerald-100 border-emerald-400 text-emerald-700 hover:bg-emerald-200",
            reserved: "bg-amber-100 border-amber-400 text-amber-700 hover:bg-amber-200",
            booked: "bg-red-100 border-red-400 text-red-700 hover:bg-red-200",
          };

          return (
            <div
              key={booth.id}
              className={`
                absolute flex items-center justify-center
                w-16 h-16 border-2 rounded-md transition-all cursor-pointer
                ${statusColors[booth.status as keyof typeof statusColors]}
              `}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
              }}
              title={`Booth ${booth.number}: ${booth.status}`}
            >
              <span className="font-bold text-sm">{booth.number}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
