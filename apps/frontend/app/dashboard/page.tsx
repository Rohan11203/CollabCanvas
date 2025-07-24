"use client";
import { AuthErrorModal } from "@/components/AuthErrorModal";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { QuickTips } from "@/components/QuickTips";
import { RecentRooms } from "@/components/RecentRooms";
import { RoomModal } from "@/components/RoomModal";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setAuthError(
        "Your session is invalid or has expired. Please sign in again."
      );
    }
  }, [status]);

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (authError) {
    return (
      <>
        <div className="blur-lg">
          <DashboardSkeleton />
        </div>
        <AuthErrorModal
          message={authError}
          onConfirm={() => router.push("/")}
        />
      </>
    );
  }

  if (status == "authenticated") {
    return (
      <div className="min-h-screen relative">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        {/* Header */}
        <header className="bg-neutral-900/70 backdrop-blur-sm border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-semibold text-white">
                    Collab Canva
                  </h1>
                  <p className="text-sm text-neutral-400">
                    Real-time collaborative drawing
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* LOGOUT BUTTON */}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">

                  <span className="text-sm font-medium text-white">
                    {session.user?.name?.substring(0, 2).toUpperCase() || "??"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Create/Join Room */}
            <RoomModal />

            {/* Right Panel - Recent Rooms */}
            <div className="lg:col-span-1">
              <RecentRooms />

              {/* Quick Tips */}
              <QuickTips />
            </div>
          </div>
        </main>
      </div>
    );
  }
  return null;
};

export default Dashboard;
