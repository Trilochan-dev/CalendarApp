import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { FaCircleUser } from 'react-icons/fa6';
import { useContext, useEffect, useState } from 'react';
import { addDays, format, startOfWeek } from "date-fns";
import { CalendarContext } from '../../pages/_app';


const Navbar = () => {
    const { lastDate, setlastDate } = useContext(CalendarContext);
    const [date, setDate] = useState() as any;
    
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
            lastdateValue = addDays(new Date(lastDate), -7);
        } else if (value === "next") {
            lastdateValue = addDays(new Date(lastDate), 7);
        } else if (value === "today") {
            lastdateValue = addDays(startOfWeek(new Date()), 0);
        }
        setlastDate(lastdateValue)
    }

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex gap-12 items-center">
                <div className="flex gap-2 items-center">
                    <div className='hover:bg-gray-200 hover:rounded-full p-3 cursor-pointer text-lg'>
                        <GiHamburgerMenu />
                    </div>
                    <img src="../../calender.png" alt='calendar' className='h-9 w-9' />
                    <p className='text-[#3c4043] font-normal text-[22px] leading-5'>Calendar</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="rounded-md px-4 py-2 text-sm  border border-gray-300 cursor-pointer" onClick={() => {
                        handleClick("today")
                    }}>Today</div>
                    <div className="flex gap-2 items-center">
                        <div className="hover:bg-gray-200 hover:rounded-full p-2 cursor-pointer w-fit" onClick={() => handleClick("prev")}>
                            <AiOutlineLeft />
                        </div>
                        <div className="hover:bg-gray-200 hover:rounded-full p-2 cursor-pointer w-fit" onClick={() => handleClick("next")}>
                            <AiOutlineRight />
                        </div>
                    </div>
                    <p className='text-[#3c4043] font-bold text-[16px] leading-5 '>{date}</p>
                </div>
            </div>
            <div className="flex items-center justify-end relative ">
                <div className='text-4xl text-gray-500 cursor-pointer'><FaCircleUser /></div>
            </div>
        </div>
    )
};

export default Navbar;
