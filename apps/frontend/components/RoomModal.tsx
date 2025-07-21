import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RoomModal() {
  const [activeTab, setActiveTab] = useState("create");
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const router = useRouter();
  const handleCreateRoom = async () => {
    if (!roomName.trim() || !userName.trim()) return;

    const res = await axios.post(
      "http://localhost:3001/v1/user/create-room",
      roomName,
      {
        withCredentials: true,
      }
    );

    router.push(`/canvas/${roomName}`);

    // Here you would typically navigate to the drawing canvas
  };

  const handleJoinRoom = () => {
    // Here you would typically navigate to the drawing canvas
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-xl shadow-xl border border-neutral-800 p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-neutral-800 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab("create")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "create"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Create Room
          </button>
          <button
            onClick={() => setActiveTab("join")}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              activeTab === "join"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Join Room
          </button>
        </div>

        {/* Create Room Tab */}
        {activeTab === "create" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Create New Room
              </h2>
              <p className="text-neutral-400">
                Start a new collaborative drawing session
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-neutral-400"
                />
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={!roomName.trim() || !userName.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Create Room
            </button>
          </div>
        )}

        {/* Join Room Tab */}
        {activeTab === "join" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Join Existing Room
              </h2>
              <p className="text-neutral-400">
                Enter a room code to join a session
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Room Code
                </label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-digit room code..."
                  maxLength={6}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-center text-lg font-mono tracking-wider text-white placeholder-neutral-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-white placeholder-neutral-400"
                />
              </div>
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={!roomCode.trim() || !userName.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
            >
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
