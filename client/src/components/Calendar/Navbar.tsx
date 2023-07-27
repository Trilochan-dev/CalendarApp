import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { useContext, useEffect, useState } from 'react';
import { addDays, format, startOfWeek } from "date-fns";
import { CalendarContext } from '../../pages/_app';
import { useRouter } from 'next/router';
import moment from 'moment';

const Navbar = () => {
    const { lastDate, setlastDate, userinfo, totalDays } = useContext(CalendarContext);
    const [date, setDate] = useState() as any;
    const [showUser, setShowUser] = useState(false);
    const router = useRouter();
    useEffect(() => {
        let startofWeek = format(lastDate, "MMM");
        let endofWeek = format(addDays(new Date(lastDate), 6), "MMM");
        if (startofWeek === endofWeek) {
            setDate(`${startofWeek}, ${format(lastDate, "yyyy")}`)
        } else {
            setDate(`${startofWeek} - ${endofWeek}, ${format(lastDate, "yyyy")}`)
        }
    }, [lastDate])
    const handleClick = (value) => {
        let lastdateValue;
        if (value === "prev") {
            lastdateValue = addDays(new Date(lastDate), -totalDays);
        } else if (value === "next") {
            lastdateValue = addDays(new Date(lastDate), totalDays);
        } else if (value === "today") {
            lastdateValue = addDays(startOfWeek(new Date()), 0);
        }
        setlastDate(lastdateValue)
    }

    const handleSignOut = () => {
        localStorage.removeItem("user_info");
        localStorage.removeItem("login_token");
        router.push('/login');
    }

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex gap-12 items-center">
                <div className="flex gap-2 items-center">
                    <div className='hover:bg-gray-200 hover:rounded-full p-3 cursor-pointer text-lg'>
                        <GiHamburgerMenu />
                    </div>
                    <div className="relative">
                        <img src="../../calendar.svg" alt='calendar' className='h-16 w-16' />
                        <p className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-sm font-bold text-cyan-700'>{moment().format('DD')}</p>
                    </div>
                    <p className='text-[#3c4043] font-normal text-[22px] leading-5'>Calendar</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="rounded-md px-4 py-2 text-sm  border border-gray-300 cursor-pointer" onClick={() => {
                        handleClick("today")
                    }}>Today</div>
                    <div className="flex gap-2 items-center">
                        <button className="hover:bg-gray-200 hover:rounded-full p-2 cursor-pointer w-fit" onClick={() => handleClick("prev")}>
                            <AiOutlineLeft />
                        </button>
                        <button className="hover:bg-gray-200 hover:rounded-full p-2 cursor-pointer w-fit" onClick={() => handleClick("next")}>
                            <AiOutlineRight />
                        </button>
                    </div>
                    <p className='text-[#3c4043] font-bold text-[16px] leading-5 '>{date}</p>
                </div>
            </div>
            <div className="flex items-center justify-end relative">
                <div className='text-xl font-extrabold text-white cursor-pointer rounded-full py-1 px-3 bg-black' onClick={(prev) => setShowUser(!showUser)}>
                    {userinfo?.name?.charAt(0)}
                </div>
                {
                    showUser &&
                    <div className='absolute -bottom-[5.5rem] mt-4 bg-calendar-purple px-4 rounded-lg w-60 max:w-96 py-4 text-white font-bold'>
                        <p>Hi, {userinfo?.name}</p>
                        <div className='flex items-center gap-4 font-bold cursor-pointer' onClick={() => handleSignOut()}>
                            <p>Sign out</p>
                            <FiLogOut />
                        </div>
                    </div>
                }

            </div>
        </div>
    )
};

export default Navbar;
