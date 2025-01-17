"use client";
import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type User = {
  username: string;
  id: string;
};

export const AuthContext = createContext<{
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (value: User) => void;
}>({
  authenticated: false,
  setAuthenticated: () => {},
  user: { username: "", id: "" },
  setUser: () => {},
});
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    if (!userInfo) {
      router.push("/login");
    } else {
      const user = JSON.parse(userInfo);
      setUser({
        username: user.username,
        id: user.id,
      });
      setAuthenticated(true);
    }
  }, [authenticated]); // eslint-disable-line

  return (
    <AuthContext.Provider
      value={{ authenticated, setAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
