import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Box, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
        
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
            Design your perfect <span className="text-gradient">exhibition space</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage events, configure 3D booths, and streamline your exhibition process all in one platform.
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
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <Card className="border-border/50 shadow-xl shadow-black/5">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Use 'admin' / 'password' for demo access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username or Email</FormLabel>
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
                  
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/register">
              <a className="font-semibold text-primary hover:text-primary/80 hover:underline transition-colors">
                Create account
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
