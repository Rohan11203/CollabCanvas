"use client";
import { Play } from "lucide-react";
import { Button } from "@repo/ui/button";
import AuthModal from "./AuthModal";
import { useState } from "react";
import axios from "axios";
import { NEXT_PUBLIC_API_BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

const Hero = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [googleLoading, setGoogleLoding] = useState(false);
  const router = useRouter();

  async function handleSubmit(
    mode: String,
    { username, email, password }: any
  ) {
    if (mode === "signup") {
      try {
        setLoading(true);
        console.log("Signup payload:", { username, email, password });
        const res = await axios.post(
          `${NEXT_PUBLIC_API_BASE_URL}/signup`,
          {
            username,
            email,
            password,
          },
          { withCredentials: true }
        );
        console.log("Signup success:", res);
        console.log("Token:", res.data.token);
        localStorage.setItem("token", res.data.token);
        setErrors([]);
        router.push("/dashboard");
      } catch (err: any) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Something went wrong. Please try again."]);
          console.log(err);
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        console.log("Signup payload:", { email, password });
        const res = await axios.post(
          `${NEXT_PUBLIC_API_BASE_URL}/signin`,
          {
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        console.log("Signin success:", res);
        console.log("Token:", res.data.token);
        localStorage.setItem("token", res.data.token);
        setErrors([]);
        router.push("/dashboard");
      } catch (err: any) {
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setErrors([err.response.data.message]);
        } else {
          setErrors(["Something went wrong. Please try again."]);
        }
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleGoogle() {
    try {
      setGoogleLoding(true);
      window.location.href =
        "https://smartclip-ai.onrender.com/api/v1/users/google";
      localStorage.setItem("isAuth", "true");
    } catch (error) {
      console.error("Google Login Error : ", error);
    } finally {
      setGoogleLoding(false);
    }
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
              onClick={() => {
                setOpen(true);
              }}
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
              Join Room
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
