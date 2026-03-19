import React, { createContext, useContext, ReactNode } from "react";
import { useLocation } from "wouter";
import {
  useGetMe,
  useLogin,
  useLogout,
  useRegister,
  User,
  Company,
  LoginRequest,
  RegisterRequest
} from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  company: Company | null;
  isLoading: boolean;
  login: (data: LoginRequest) => void;
  register: (data: RegisterRequest) => void;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetMe({
    query: {
      retry: false,
      staleTime: 1000 * 60 * 5,
    }
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data: any) => {
        if (data.token) {
          localStorage.setItem("avisauto_token", data.token);
        }
        queryClient.setQueryData(["/api/auth/me"], data);
        toast({ title: "Connexion réussie", description: "Bienvenue sur AvisAuto!" });
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({
          title: "Erreur de connexion",
          description: error?.message || "Identifiants incorrects",
          variant: "destructive"
        });
      }
    }
  });

  const registerMutation = useRegister({
    mutation: {
      onSuccess: (data: any) => {
        if (data.token) {
          localStorage.setItem("avisauto_token", data.token);
        }
        queryClient.setQueryData(["/api/auth/me"], data);
        toast({ title: "Inscription réussie", description: "Votre compte a été créé avec succès." });
        setLocation("/dashboard");
      },
      onError: (error: any) => {
        toast({
          title: "Erreur d'inscription",
          description: error?.message || "Une erreur est survenue",
          variant: "destructive"
        });
      }
    }
  });

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        localStorage.removeItem("avisauto_token");
        queryClient.setQueryData(["/api/auth/me"], null);
        queryClient.clear();
        setLocation("/login");
      }
    }
  });

  const value = {
    user: data?.user || null,
    company: data?.company || null,
    isLoading,
    login: loginMutation.mutate,
    register: (values: any) => registerMutation.mutate({ data: values }),
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}