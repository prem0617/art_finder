"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Key,
  Globe,
  FileText,
  ArrowRight,
  Check,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import toast from "react-hot-toast";

interface SignupFormData {
  companyName: string;
  password: string;
  description: string;
  domain: string;
}

const strengthColors = {
  weak: "bg-red-500",
  medium: "bg-yellow-500",
  strong: "bg-green-500",
};

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState("weak");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<SignupFormData>({
    companyName: "",
    password: "",
    description: "",
    domain: "",
  });

  const calculatePasswordStrength = (password: string) => {
    if (password.length < 8) return "weak";
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
    ].filter(Boolean).length;
    return strength <= 2 ? "weak" : strength === 3 ? "medium" : "strong";
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/signup", formData);
      if (response.status === 200) {
        setSuccess(true);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => router.push("/"), 1500);
        toast.success("Signup Success");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const progressPercentage = ((formStep + 1) / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 transition-all duration-500">
      <div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
        <Card className="w-full max-w-md shadow-xl transition-all duration-500 hover:shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-500">
              Join thousands of companies using our platform
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="animate-shake">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                {formStep === 0 && (
                  <div className="space-y-2 transition-all duration-300">
                    <Label
                      htmlFor="companyName"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      required
                      className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your company name"
                      onChange={handleChange}
                      value={formData.companyName}
                    />
                  </div>
                )}

                {formStep === 1 && (
                  <div className="space-y-2 transition-all duration-300">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="transition-all duration-300"
                      placeholder="Create a strong password"
                      onChange={handleChange}
                      value={formData.password}
                    />
                    <div className="h-1 mt-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 `}
                        style={{
                          width:
                            passwordStrength === "weak"
                              ? "33%"
                              : passwordStrength === "medium"
                              ? "66%"
                              : "100%",
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Password strength: {passwordStrength}
                    </p>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-2 transition-all duration-300">
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      required
                      className="min-h-[100px] transition-all duration-300"
                      placeholder="Tell us about your company"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      value={formData.description}
                    />
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-2 transition-all duration-300">
                    <Label htmlFor="domain" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Domain
                    </Label>
                    <Input
                      id="domain"
                      name="domain"
                      required
                      className="transition-all duration-300"
                      placeholder="yourdomain.com"
                      onChange={handleChange}
                      value={formData.domain}
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {formStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormStep((step) => step - 1)}
                  className="transition-all duration-300"
                >
                  Back
                </Button>
              )}
              {formStep < 3 ? (
                <Button
                  type="button"
                  className="ml-auto transition-all duration-300"
                  onClick={() => setFormStep((step) => step + 1)}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className={`ml-auto transition-all duration-300 ${
                    success ? "bg-green-500 hover:bg-green-600" : ""
                  }`}
                  disabled={loading || success}
                >
                  {loading ? (
                    "Creating Account..."
                  ) : success ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Success!
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
