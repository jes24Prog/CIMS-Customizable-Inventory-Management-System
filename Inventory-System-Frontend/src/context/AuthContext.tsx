"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: (User & { password: string })[] = [
  {
    username: "demo",
    password: "demo",
    name: "Demo",
    role: "Administrator",
    avatar:
      "https://ui-avatars.com/api/?name=Admin&background=0061ff&color=fff",
    email: "demo@inventory.com", // Added email
  },
  {
    username: "manager",
    password: "manager",
    name: "Inventory Manager",
    role: "Manager",
    avatar:
      "https://ui-avatars.com/api/?name=Inventory+Manager&background=0061ff&color=fff",
    email: "manager@inventory.com", // Added email
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("inventoryUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("inventoryUser");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const foundUser = MOCK_USERS.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
      // Remove password from user object
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "inventoryUser",
        JSON.stringify(userWithoutPassword)
      );
      setIsLoading(false);
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      router.push("/dashboard");
      return true;
    } else {
      setIsLoading(false);
      toast.error("Invalid username or password");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("inventoryUser");
    router.push("/");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
