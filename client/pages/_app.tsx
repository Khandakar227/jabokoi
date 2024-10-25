import { useUser } from "@/hooks/use-user";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useUser();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) return;
    fetch('/api/auth', {headers: {authorization: 'Bearer ' + token}})
    .then(res => res.json())
    .then(data => {
      setUser(data?.user || null);
    })
  }, []);

  return <Component {...pageProps} />;
}
