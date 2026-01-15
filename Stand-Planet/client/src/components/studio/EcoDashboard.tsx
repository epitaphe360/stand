import { useStudioStore } from '@/store/useStudioStore';
import { generateBOM } from '@/lib/3d/export';
import { Card, CardContent } from '@/components/ui/card';
import { Weight, Leaf, Euro, Package } from 'lucide-react';

export default function EcoDashboard() {
  const { currentConfiguration } = useStudioStore();
  const bom = generateBOM(currentConfiguration);

  const totals = bom.reduce((acc, item) => ({
    weight: acc.weight + item.weight,
    carbon: acc.carbon + item.carbon,
    price: acc.price + item.total,
    count: acc.count + item.count
  }), { weight: 0, carbon: 0, price: 0, count: 0 });

  return (
    <div className="absolute top-20 right-4 z-10 flex flex-col gap-2 w-48">
      <Card className="bg-white/90 backdrop-blur-sm border-none shadow-lg overflow-hidden">
        <div className="bg-slate-800 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Package className="w-3 h-3" />
          Eco-Logistique
        </div>
        <CardContent className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Weight className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs text-gray-600">Poids</span>
            </div>
            <span className="text-xs font-bold">{totals.weight.toFixed(1)} kg</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-xs text-gray-600">Carbone</span>
            </div>
            <span className="text-xs font-bold text-emerald-700">{totals.carbon.toFixed(1)} kgCO2</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Euro className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs text-gray-600">Budget</span>
            </div>
            <span className="text-xs font-bold">{totals.price.toLocaleString()} €</span>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${totals.carbon < 50 ? 'bg-emerald-500' : totals.carbon < 150 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (totals.carbon / 300) * 100)}%` }}
              />
            </div>
            <p className="text-[9px] text-gray-400 mt-1 text-center uppercase">Score Éco-Responsable</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
