import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Globe, 
  Cpu, 
  Layers, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Users, 
  Maximize 
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900"></div>
          {/* Background pattern or image could go here */}
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1582408921715-18e7806367c1?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            STAND <span className="text-blue-500">PLANET</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-slate-300">
            La plateforme mondiale de conception de stands d'exposition ultra-réalistes, 
            propulsée par l'IA et conçue pour la fabrication réelle.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/studio">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-xl rounded-full shadow-2xl transition-all hover:scale-105">
                Lancer le Configurateur
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10 px-10 py-7 text-xl rounded-full transition-all">
              Voir la Démo
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Une Technologie de Pointe</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              De la conception collaborative à la fabrication industrielle, Stand Planet 
              révolutionne chaque étape de votre projet événementiel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Collaboration Mondiale",
                desc: "Travaillez en temps réel avec vos clients et designers partout dans le monde via WebSockets.",
                icon: <Globe className="w-10 h-10 text-blue-500" />,
              },
              {
                title: "IA Générative",
                desc: "Générez des concepts de stands complets et éco-responsables à partir d'un simple brief textuel.",
                icon: <Cpu className="w-10 h-10 text-purple-500" />,
              },
              {
                title: "Réalisme PBR & VR",
                desc: "Visualisez vos projets avec une fidélité photographique et immergez-vous en VR à l'échelle 1:1.",
                icon: <Maximize className="w-10 h-10 text-green-500" />,
              },
              {
                title: "Export Industriel",
                desc: "Générez automatiquement nomenclatures (BOM), bilans carbone et plans de découpe CNC.",
                icon: <FileText className="w-10 h-10 text-orange-500" />,
              }
            ].map((feature, i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="mb-6 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Matériaux Certifiés & Durabilité</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Accédez à un catalogue exclusif de matériaux réels certifiés (FSC, PEFC, M1). 
              Chaque choix impacte en temps réel le bilan carbone et le poids logistique de votre stand.
            </p>
            <ul className="space-y-4">
              {[
                "Calcul automatique de l'empreinte CO2",
                "Matériaux ignifugés conformes aux normes de sécurité",
                "Traçabilité complète des matières premières",
                "Optimisation des chutes pour la découpe CNC"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <ShieldCheck className="text-green-500 w-6 h-6" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 bg-slate-100 rounded-3xl p-8 shadow-inner">
            <div className="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center text-white overflow-hidden relative group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60 group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10 text-center">
                 <Zap className="w-16 h-16 mx-auto mb-4 text-yellow-400 fill-yellow-400" />
                 <span className="text-xl font-bold">Aperçu du Catalogue PBR</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Prêt à révolutionner vos expositions ?</h2>
          <Link href="/studio">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-8 text-2xl rounded-full font-bold shadow-xl">
              Commencer Maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center">
          <p className="mb-4">© 2026 Stand Planet - Plateforme Mondiale de Conception 3D</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
