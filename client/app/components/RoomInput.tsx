"use client";
import { useState, useEffect, useContext } from "react";
import { API_URL, WEBSOCKET_URL } from "../lib/constants";
import { AuthContext } from "../context/AuthProvider";
import { WebsocketContext } from "../context/WebSocketProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RoomInput() {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const { user } = useContext(AuthContext);
  const { setConn } = useContext(WebsocketContext);

  const router = useRouter();
  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: "GET",
      });

      const data = await res.json();
      if (res.ok) {
        setRooms(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = async (id: string) => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinRoom/${id}?userId=${user?.id}&username=${user?.username}`
    );

    if (ws.OPEN) {
      setConn(ws);

      router.push("/app");
      return;
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  //   const [isConnecting, setIsConnecting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //Ensure room name set to empty
    setRoomName("");
    setIsConnecting(true);
    const id = crypto.randomUUID();
    const res = await fetch(`${API_URL}/ws/createRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ id, name: roomName }),
    });

    if (res.ok) {
      setIsConnecting(false);
      getRooms();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md mb-32">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center w-full rounded-md overflow-hidden">
            <span className="font-mono text-lg px-2 mr-2 bg-black text-white">
              ws://
            </span>
            <input
              type="text"
              placeholder="Enter room name"
              value={roomName}
              className="flex-grow border-none focus:ring-0 focus:outline-none py-2"
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={isConnecting}
            className={`w-full bg-black text-white font-bold py-2 px-4 rounded-md transition-all duration-300 ${
              isConnecting ? "animate-pulse" : "hover:bg-gray-800"
            }`}
          >
            {isConnecting ? (
              <div className="flex items-center justify-center">
                <PlugIcon className="animate-connecting mr-2" />
                Connecting...
              </div>
            ) : (
              "Connect"
            )}
          </button>
        </div>
      </form>
      <div className="mt-6 cursor-plug">
        <div className="font-bold">Available Rooms</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="
               relative overflow-hidden
               bg-white rounded-xl
               transition-all duration-500 transform hover:scale-105 shadow-lg border border-gray-200"
            >
              <div className="p-6 h-46 w-48 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold text-black mb-6">
                  {room.name}
                </h3>

                <div className="bg-black w-full flex justify-center cursor-plug-white">
                  <button
                    onClick={() => joinRoom(room.id)}
                    className="
                   w-18 h-18 
                   flex items-center justify-center
                   transition-all duration-500 hover:bg-white text-zinc-400 bg-zinc-400 hover:text-white cursor-plug-white"
                  >
                    <Image
                      src="/socket.svg"
                      alt="Icon"
                      width={40}
                      height={40}
                      className="object-fill"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlugIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 7V17M6 7V17M6 7H18M6 17H18M6 12H18M9 3V7M15 3V7M9 17V21M15 17V21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
