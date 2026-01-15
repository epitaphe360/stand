import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { ArrowRight, Box, Layers, ShieldCheck } from "lucide-react";
import { StandTemplatesShowcase } from "@/components/studio/StandTemplatesShowcase";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/20 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-8">
            Now in Beta 🚀
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            The Future of <span className="text-gradient">Event Management</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            StandPlanet empowers organizers to create stunning floor plans and exhibitors to design immersive 3D booths—all in one seamless platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" className="h-12 px-8 text-base">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Box className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">3D Booth Configurator</h3>
              <p className="text-muted-foreground leading-relaxed">
                Allow exhibitors to visualize and customize their stands in real-time 3D before the event starts.
              </p>
            </div>
            
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Dynamic Floor Plans</h3>
              <p className="text-muted-foreground leading-relaxed">
                Create and manage interactive floor plans. Update booth availability and status instantly.
              </p>
            </div>
            
            <div className="bg-background border rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Bookings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Streamlined booking and payment processing integrated directly into the exhibition workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <StandTemplatesShowcase />

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-primary rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 relative z-10">
              Ready to transform your exhibitions?
            </h2>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="font-semibold shadow-xl">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 StandPlanet Global. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
