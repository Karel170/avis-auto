import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface User { id: string; email: string; name: string; role: string; }
interface Company { id: string; name: string; }
interface AuthContextType {
  user: User | null; company: Company | null; isLoading: boolean;
  login: (data: { email: string; password: string }) => void;
  register: (data: { email: string; password: string; name: string; companyName?: string }) => void;
  logout: () => void;
  isLoggingIn: boolean; isRegistering: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API = "/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("avisauto_user");
    if (stored) {
      const { user, company } = JSON.parse(stored);
      setUser(user); setCompany(company);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: { email: string; password: string }) => {
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur connexion");
      localStorage.setItem("avisauto_user", JSON.stringify({ user: json.user, company: json.company }));
      if (json.token) localStorage.setItem("avisauto_token", json.token);
      setUser(json.user); setCompany(json.company);
      toast({ title: "Connexion réussie", description: "Bienvenue sur AvisAuto!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Erreur de connexion", description: err.message, variant: "destructive" });
    } finally { setIsLoggingIn(false); }
  };

  const register = async (data: any) => {
    setIsRegistering(true);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erreur inscription");
      localStorage.setItem("avisauto_user", JSON.stringify({ user: json.user, company: json.company }));
      if (json.token) localStorage.setItem("avisauto_token", json.token);
      setUser(json.user); setCompany(json.company);
      toast({ title: "Inscription réussie", description: "Compte créé avec succès!" });
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Erreur d inscription", description: err.message, variant: "destructive" });
    } finally { setIsRegistering(false); }
  };

  const logout = () => {
    localStorage.removeItem("avisauto_user");
    localStorage.removeItem("avisauto_token");
    setUser(null); setCompany(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, company, isLoading, login, register, logout, isLoggingIn, isRegistering }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
