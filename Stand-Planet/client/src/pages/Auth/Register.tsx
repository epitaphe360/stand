import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { Box } from "lucide-react";

// Simplified for demo - connect to actual register endpoint in production
const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["organizer", "exhibitor"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "exhibitor" },
  });

  const onSubmit = (data: RegisterForm) => {
    console.log("Register:", data);
    // Integrate with useAuth().register when ready
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-primary/20" />
        
        <div className="relative z-10">
          <Link href="/">
            <a className="flex items-center gap-2 font-display font-bold text-2xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-xl">
                <Box className="w-6 h-6" />
              </div>
              StandPlanet
            </a>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold font-display tracking-tight mb-4">
            Join the future of <span className="text-gradient">event management</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you're organizing a global summit or showcasing your products, we provide the tools you need to succeed.
          </p>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          © 2024 StandPlanet Global. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground mt-2">
              Start managing your events and exhibitions today
            </p>
          </div>

          <Card className="border-border/50 shadow-xl shadow-black/5">
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Enter your details below to create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am an</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="organizer">Organizer (Manage Events)</SelectItem>
                            <SelectItem value="exhibitor">Exhibitor (Book Booths)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled>
                    Create Account (Demo)
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login">
              <a className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors">
                Sign in
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
