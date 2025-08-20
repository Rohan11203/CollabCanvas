"use client";
import { Play } from "lucide-react";
import { Button } from "@repo/ui/button";
import AuthModal from "./AuthModal";
import { useState } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(
    mode: "signup" | "signin",
    { username, email, password }: any
  ) {
    if (mode === "signup") {
      // Signup logic still uses axios to create the user first
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user/signup`, {
          username,
          email,
          password,
        });
        // After successful signup, automatically sign them in
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/dashboard",
        });
      } catch (err: any) {
        setErrors(err.response?.data?.errors || ["Signup failed."]);
      }
    } else {
      // For sign-in, use Next-Auth directly
      const result = await signIn("credentials", {
        redirect: false, // Don't redirect, handle result manually
        email,
        password,
      });

      if (result?.error) {
        setErrors(["Invalid email or password."]);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    // Use next-auth's signIn function. It handles the redirect and callback.
    await signIn("google", { callbackUrl: "/dashboard" });
    // No need to set loading to false, as the page will redirect.
  }

  return (
    <>
      <section className="relative h-screen bg-neutral-950 overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Draw. Collaborate.
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Create — Together.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Instantly sketch, brainstorm, and prototype with your team in one
            shared canvas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Button
              onClick={() => { router.push("/dashboard")}}
              variant="primary"
            >
              Create Room
            </Button>
            <Button
              onClick={() => {
                setOpen(true);
              }}
              variant="secondary"
            >
              Login Now
            </Button>
          </div>
        </div>

        <AuthModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onGoogle={handleGoogle}
          onSubmit={handleSubmit}
          error={errors}
          loading={loading}
          googleLoading={googleLoading}
        />
      </section>
    </>
  );
};

export default Hero;
