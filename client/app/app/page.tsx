"use client";
import { useRef, useState, useContext, useEffect } from "react";
import Chat from "../components/Chat";
import { WebsocketContext } from "../context/WebSocketProvider";
import { AuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import { API_URL } from "../lib/constants";

export type Message = {
  content: string;
  clientId: string;
  username: string;
  roomId: string;
  type: "sent" | "received";
};
export default function App() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [users, setUsers] = useState<Array<{ username: string }>>([]);

  const { user } = useContext(AuthContext);
  const { conn } = useContext(WebsocketContext);

  const textarea = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  const sendMessage = () => {
    if (!textarea.current?.value) return;
    if (conn == null) {
      console.log("no connection");
      router.push("/");
      return;
    }
    conn.send(textarea.current.value);
    textarea.current.value = "";
  };

  useEffect(() => {
    if (conn == null) {
      router.push("/");
      return;
    }

    const roomId = conn.url.split("/")[5];
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/ws/getClients/${roomId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        setUsers(data);
      } catch (e) {
        console.error(e);
      }
    }
    getUsers();
  }, [conn, router]); //get all clients in the room

  useEffect(() => {
    if (conn == null) {
      router.push("/");
      return;
    }

    conn.onmessage = (message) => {
      const m: Message = JSON.parse(message.data);
      if (m.content == "A new user has joined the room") {
        setUsers([...users, { username: m.username }]);
      }

      if (m.content == "user left the chat") {
        const deleteUser = users.filter((user) => user.username != m.username);
        setUsers([...deleteUser]);
        setMessages([...messages, m]);
        return;
      }

      if (user?.username == m.username) {
        m.type = "sent";
      } else {
        m.type = "received";
      }
      setMessages([...messages, m]);
    };

    conn.onclose = () => {};
    conn.onerror = () => {};
    conn.onopen = () => {};
  }, [textarea, messages, conn, users]); //eslint-disable-line

  return (
    <>
      <div>
        <Chat data={messages} />
      </div>
      <div className="flex flex-col w-full">
        <div className="p-4 md:mx-6 mb-14"></div>
        <div className="fixed bottom-0 mt-4 w-full">
          <div className="flex md:flex-row px-4 py-2 bg-grey md:mx-4 rounded-md">
            <div className="flex w-full mr-4 rounded-md border border-blue">
              <textarea
                ref={textarea}
                placeholder="type your message here"
                className="w-full h-10 p-2 rounded-md focus:outline-none"
                style={{ resize: "none" }}
              />
            </div>
            <div className="flex items-center">
              <button
                className="p-2 rounded-md bg-blue text-white"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
