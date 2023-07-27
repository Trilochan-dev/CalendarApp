import { useRouter } from "next/router";
import Calendar from "../components/Calendar/Calendar";
import "../styles/globals.css";
import { createContext, useEffect, useRef, useState } from "react";
import { addDays, startOfWeek } from "date-fns";

export const CalendarContext = createContext(null);
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [lastDate, setlastDate] = useState(addDays(startOfWeek(new Date()), 0));
  const [userinfo, setUserinfo] = useState({});
  const [totalDays, setTotalDays] = useState(7);
  const [apiCall, setApiCall] = useState(false)

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("login_token"));
    const userdata = JSON.parse(localStorage && localStorage.getItem("user_info"));
    if (userdata) {
      setUserinfo(userdata);
    }
    if (!token && router.asPath === "/") {
      router.push("/login");
    }
    if (token && ["/login", "/register"].includes(router.asPath)) {
      router.push("/");
    }
  }, [router]);

  const setTotalDaysShown = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      return 7;
    } else if (width >= 768) {
      return 4;
    } else {
      return 1;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setTotalDays(setTotalDaysShown())
    };

    // Add event listener to handle window resize
    window.addEventListener("resize", handleResize);
    setTotalDays(setTotalDaysShown())


    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (
    <>
      {router.pathname === "/login" || router.pathname === "/register" ? (
        <Component {...pageProps} />
      ) : (
        <CalendarContext.Provider value={{ lastDate, setlastDate, userinfo, totalDays, apiCall, setApiCall }}>
          <Calendar />
        </CalendarContext.Provider>
      )}
    </>
  );
}
