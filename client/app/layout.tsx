import AuthContextProvider from "./context/AuthProvider";
import WebSocketProvider from "./context/WebSocketProvider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <WebSocketProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </WebSocketProvider>
      </body>
    </html>
  );
}
