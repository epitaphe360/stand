import { useParams, Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { StandScene } from "@/components/3d/StandScene";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConfigStore } from "@/store/useConfigStore";
import { useUpdateBoothConfig, useBooth } from "@/hooks/use-booths";
import { Save, ArrowLeft, Sofa, PaintBucket, Layers, MousePointer2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TemplateSelector from "@/components/studio/TemplateSelector";
import { useState } from "react";

export default function BoothConfigurator() {
  const { id } = useParams();
  const { data: booth } = useBooth(Number(id));
  const { mutate: saveConfig, isPending } = useUpdateBoothConfig();
  const { toast } = useToast();
  const [templateOpen, setTemplateOpen] = useState(false);
  
  // Store actions
  const { 
    dimensions, setDimensions, 
    addObject, removeObject, objects,
    setWallColor, setFloorTexture, wallColor
  } = useConfigStore();

  const handleSave = () => {
    saveConfig(
      { id: Number(id), config: { objects, dimensions, wallColor } },
      {
        onSuccess: () => {
          toast({
            title: "Configuration Saved",
            description: "Your booth design has been updated successfully.",
          });
        }
      }
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 border-r border-border bg-card shadow-lg z-10 flex flex-col">
          <div className="p-4 border-b border-border">
            <Link href="/exhibitor">
              <a className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
              </a>
            </Link>
            <h2 className="text-xl font-bold font-display">Booth Configurator</h2>
            <p className="text-sm text-muted-foreground">Booth {booth?.number || "A12"}</p>
            
            {/* Template Selector */}
            <div className="mt-4">
              <TemplateSelector isOpen={templateOpen} onOpenChange={setTemplateOpen} />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              <Tabs defaultValue="objects">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="objects"><Sofa className="w-4 h-4 mr-2" />Objects</TabsTrigger>
                  <TabsTrigger value="style"><PaintBucket className="w-4 h-4 mr-2" />Style</TabsTrigger>
                  <TabsTrigger value="layout"><Layers className="w-4 h-4 mr-2" />Layout</TabsTrigger>
                </TabsList>

                <TabsContent value="objects" className="space-y-4">
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-2">Furniture</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => addObject({ type: 'table', position: [0, 0, 0], rotation: [0, 0, 0] })}>
                      <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center">T</div>
                      Table
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => addObject({ type: 'chair', position: [0, 0, 0], rotation: [0, 0, 0] })}>
                      <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">C</div>
                      Chair
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => addObject({ type: 'banner', position: [0, 0.5, -dimensions.depth/2 + 0.1], rotation: [0, 0, 0] })}>
                      <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center">B</div>
                      Banner
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => addObject({ type: 'plant', position: [0, 0, 0], rotation: [0, 0, 0] })}>
                      <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center">P</div>
                      Plant
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mt-6 mb-2">Placed Items</p>
                  <div className="space-y-2">
                    {objects.map((obj, i) => (
                      <div key={obj.id} className="flex items-center justify-between p-2 rounded border bg-muted/20 text-sm">
                        <span>{obj.type} #{i + 1}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-destructive" onClick={() => removeObject(obj.id)}>
                          &times;
                        </Button>
                      </div>
                    ))}
                    {objects.length === 0 && (
                      <div className="text-center py-4 text-sm text-muted-foreground italic">
                        No objects placed yet.
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Wall Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#ffffff', '#f3f4f6', '#1e293b', '#ef4444', '#3b82f6', '#22c55e'].map(color => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${wallColor === color ? 'border-primary scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setWallColor(color)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Floor Material</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['wood', 'concrete', 'carpet', 'tile'].map(texture => (
                        <Button 
                          key={texture} 
                          variant="outline" 
                          className="capitalize"
                          onClick={() => setFloorTexture(texture)}
                        >
                          {texture}
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Width (m)</label>
                        <span className="text-sm text-muted-foreground">{dimensions.width}m</span>
                      </div>
                      <Slider 
                        value={[dimensions.width]} 
                        min={2} max={10} step={0.5} 
                        onValueChange={([v]) => setDimensions(v, dimensions.depth)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Depth (m)</label>
                        <span className="text-sm text-muted-foreground">{dimensions.depth}m</span>
                      </div>
                      <Slider 
                        value={[dimensions.depth]} 
                        min={2} max={10} step={0.5} 
                        onValueChange={([v]) => setDimensions(dimensions.width, v)} 
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-muted/10">
            <Button className="w-full" onClick={handleSave} disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </aside>

        {/* 3D Canvas */}
        <main className="flex-1 relative bg-slate-100 dark:bg-slate-900">
          <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur rounded-lg p-2 shadow border text-xs">
            <div className="flex items-center gap-2 mb-1">
              <MousePointer2 className="w-3 h-3" />
              <span className="font-semibold">Controls</span>
            </div>
            <ul className="space-y-1 text-muted-foreground">
              <li>Left Click + Drag to Rotate</li>
              <li>Right Click + Drag to Pan</li>
              <li>Scroll to Zoom</li>
            </ul>
          </div>
          <StandScene />
        </main>
      </div>
    </div>
  );
}
