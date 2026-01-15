import { useEvents } from "@/hooks/use-events";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowRight, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";

export default function Dashboard() {
  const { data: events, isLoading } = useEvents();

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Organizer Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your upcoming exhibitions and events.</p>
          </div>
          <Link href="/organizer/events/new">
            <Button className="shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Total Events", value: events?.length || 0, icon: Calendar, color: "text-blue-500" },
            { label: "Active Booths", value: "124", icon: MapPin, color: "text-emerald-500" },
            { label: "Total Exhibitors", value: "85", icon: Users, color: "text-purple-500" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-background shadow-sm ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold font-display">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Events List */}
        <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : events?.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-muted-foreground mt-1 mb-6">Get started by creating your first event.</p>
            <Link href="/organizer/events/new">
              <Button>Create Event</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {events?.map((event) => (
              <Card key={event.id} className="group hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-full md:w-48 h-32 md:h-24 rounded-lg bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground font-display font-bold text-xl uppercase tracking-wider shrink-0">
                    {event.name.substring(0, 2)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {event.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Link href={`/organizer/events/${event.id}`}>
                      <Button variant="outline" className="w-full md:w-auto">Manage</Button>
                    </Link>
                    <Link href={`/organizer/events/${event.id}/floorplan`}>
                      <Button variant="secondary" className="w-full md:w-auto">Floor Plan</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
