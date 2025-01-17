"use client";
import { useState, useContext, useEffect } from "react";
import { API_URL } from "../lib/constants";
import { useRouter } from "next/navigation";
import { AuthContext, User } from "../context/AuthProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authenticated } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/");
    }
  });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      console.log("hello world");
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        const user: User = {
          username: data.username,
          id: data.id,
        };

        localStorage.setItem("user", JSON.stringify(user));
        return router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-center items-center min-w-full min-h-screen">
      <form className="flex flex-col md:w-1/5">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSubmit}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
