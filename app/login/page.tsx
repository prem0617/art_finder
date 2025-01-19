"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertCircle,
  Building2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
} from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import toast from "react-hot-toast";

interface LoginFormData {
  companyName: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    companyName: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    if (error) setError(null);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/login", formData);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful!");
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (error) {
      // Check if the error is from the response
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || "Login failed!";
        toast.error(errorMessage); // Display the error message as a toast
        setError(errorMessage); // Optionally, you can show it as an alert too
      } else {
        toast.error("An unexpected error occurred.");
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-2rem)]">
        <div className="w-full max-w-md space-y-4">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Sign in to access your company dashboard
            </p>
          </div>

          <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert> */}
                {/* )} */}

                <div className="space-y-2">
                  <Label
                    htmlFor="companyName"
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Building2 className="h-4 w-4" />
                    Company Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="companyName"
                      name="companyName"
                      required
                      className="pl-3 h-11 transition-all duration-300 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter your company name"
                      onChange={handleChange}
                      value={formData.companyName}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="flex items-center gap-2 text-gray-700"
                  >
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="pl-3 h-11 pr-10 transition-all duration-300 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      value={formData.password}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    className={`w-full h-11 transition-all duration-300 ${
                      success
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    disabled={loading || success}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing In...
                      </div>
                    ) : success ? (
                      <div className="flex items-center gap-2 justify-center">
                        <Check className="h-4 w-4" />
                        Success!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        Sign In
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
            >
              Sign up now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
