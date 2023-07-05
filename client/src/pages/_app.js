import { useRouter } from "next/router";
import Calendar from "../components/Calendar/Calendar";
import "../styles/globals.css";
import { createContext, useEffect, useState } from "react";
import { addDays, startOfWeek } from "date-fns";

export const CalendarContext = createContext();
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [lastDate, setlastDate] = useState(addDays(startOfWeek(new Date()), 0));

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("login_token"));
    if (!token && router.asPath === "/") {
      router.push("/login");
    }
    if (token && ["/login", "/register"].includes(router.asPath)) {
      router.push("/");
    }
  }, [router]);
  return (
    <>
      {router.pathname === "/login" || router.pathname === "/register" ? (
        <Component {...pageProps} />
      ) : (
        <CalendarContext.Provider value={{ lastDate, setlastDate }}>
          <Calendar />
        </CalendarContext.Provider>
      )}
    </>
  );
}
