import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const { login, isLoading } = useAuth();

  const validate = (): boolean => {
    const newErrors = { username: "", password: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    await login(username, password);
  };

  return (
    <Card className="w-full text-white max-w-md shadow-xl border-0 overflow-hidden bg-white/10 backdrop-blur-lg rounded-2xl animate-fade-in">
      <CardHeader className="space-y-1 bg-primary/5 pb-6">
        <CardTitle className="text-2xl font-semibold text-center">
          CIMS: Customizable Inventory Management System
        </CardTitle>
        <CardDescription className="text-center text-white">
          Enter your credentials
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`input-subtle ${
                errors.username ? "border-destructive" : ""
              }`}
              autoComplete="username"
              disabled={isLoading}
              style={{ color: "black" }}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto font-normal text-xs"
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input-subtle ${
                errors.password ? "border-destructive" : ""
              }`}
              autoComplete="current-password"
              disabled={isLoading}
              style={{ color: "black" }}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full btn-hover-effect"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardFooter>
      </form>
      <div className="p-4 bg-secondary/30 mt-3 text-center text-sm text-white">
        <p>Credentials: Username: demo / Password: demo</p>
      </div>
    </Card>
  );
};

export default LoginForm;
