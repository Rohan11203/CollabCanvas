"use client"
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RecentRooms() {
  const [recentRooms, setRecentRooms] = useState([]);
  const router = useRouter();

  const fetchRooms = async () => {
    const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
      withCredentials: true,
    });
    const rooms = response.data.rooms
    setRecentRooms(rooms)
  };
  useEffect(() => {
    fetchRooms();
  }, []);


  const handleJoinRecentRoom = (room: any) => {
    router.push(`/canvas/${room.id}`)
  };
  return (
    <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-800 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Rooms</h3>

      {recentRooms.length > 0 ? (
        <div className="space-y-3">
          {recentRooms.map((room: any) => (
            <div
              key={room.id}
              className="p-4 border border-neutral-700 rounded-lg hover:bg-neutral-800/50 cursor-pointer transition-colors"
              onClick={() => handleJoinRecentRoom(room)}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-white truncate">{room.slug}</h4>
                <span className="text-xs text-neutral-400 whitespace-nowrap ml-2">
                  {room.lastAccessed}
                </span>
              </div>
              <div className="flex items-center text-sm text-neutral-400">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.197a2.5 2.5 0 01-3.75 3.75M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {room.createdAt} created at
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-neutral-400">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p>No recent rooms</p>
        </div>
      )}
    </div>
  );
}
