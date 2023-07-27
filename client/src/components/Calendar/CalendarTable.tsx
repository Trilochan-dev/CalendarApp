import { addDays, format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import AddTask from './AddTask';
import { getAllEvents, createEvent, updateSingleEvent } from "../services/EventService"
import moment from "moment-timezone"
import { deleteSingleEvent } from '../services/EventService';
import { CalendarContext } from '../../pages/_app';
import Toastify from '../Toastify/toast';
const Calendartable = () => {
    const { lastDate, userinfo, totalDays, apiCall, setApiCall } = useContext(CalendarContext);
    const [dates, setDates] = useState([]);
    const [myEventsData, setMyEventsData] = useState([]);
    const [clickEvent, setClickEvent] = useState("");
    const [clickObj, setClickObj] = useState({}) as any;

    function createTimeArray() {
        const hoursArray = [];
        for (let i = 0; i <= 24; i++) {
            const hour = (![0, 12].includes(i) ? i % 12 : 12).toString().padStart(2, '0');
            const ampm = i < 12 ? 'AM' : 'PM';
            const formattedHour = `${hour} ${ampm}`;
            hoursArray.push(formattedHour);
        }
        return hoursArray;
    }
    const timeIntervals = createTimeArray();

    const handleClick = (e, check, id, eventdata, eventdate, time) => {
        e?.stopPropagation();
        setClickEvent(id);
        if (check === "yes") {
            setClickObj(eventdata)
        } else {
            const obj = {
                "date": eventdate,
                "duration": "60",
                "start_time": (time.split(" ")[1] === "PM" && time.split(" ")[0] !== "12" ? parseInt(time.split(" ")[0]) + 12 : time.split(" ")[1] === "AM" && time.split(" ")[0] === "12" ? "00" : time.split(" ")[0]) + ":" + "00"
            }
            setClickObj(obj)
        }
    }

    const getApiEventDate = () => {
        getAllEvents(`${process.env.NEXT_PUBLIC_HOST}/api/event/get-events`)
            .then(function (data: any) {
                setMyEventsData(data.events.map((ev) => (
                    {
                        date: moment(ev.date).format('YYYY-MM-DD'),
                        value: ev.title,
                        time: `${moment(ev.start_time, "HH:mm").format("hh:mm A")} - ${moment(ev.start_time, "HH:mm").clone().add(ev?.duration, "minutes").format("hh:mm A")}`,
                        id: ev._id,
                        duration: ev.duration,
                        start_time: ev?.start_time
                    })
                ));
                setApiCall(false);
            }).catch(function (error) {
                console.log("error while getting events")
            })
    }
    const handleSave = (eventValue) => {
        const newObj = {
            date: new Date(clickObj.date),
            timezone: moment.tz?.guess(),
            title: eventValue,
            start_time: clickObj?.start_time,
            duration: clickObj?.duration,
        }
        if (!clickObj.id) {
            addEvent(newObj);
        } else {
            const updateObj = { ...newObj, id: clickObj.id }
            updateEvent(updateObj);
        }
    }

    const addEvent = (obj) => {
        createEvent(`${process.env.NEXT_PUBLIC_HOST}/api/event/create`, obj)
            .then(function (data) {
                getApiEventDate();
                Toastify({ title: "Event created succesfully" });
                setClickEvent("");
            }).catch(function (error) {
                Toastify({ showIcon: true, title: error });
                setClickEvent("");
                setClickObj({})
            })
    }
    const updateEvent = (obj) => {
        updateSingleEvent(`${process.env.NEXT_PUBLIC_HOST}/api/event/${obj.id}/update`, obj)
            .then(function (data) {
                Toastify({ title: "Event updated succesfully" });
                getApiEventDate();
                setClickEvent("");
                setClickObj({})
            }).catch(function (error) {
                Toastify({ showIcon: true, title: "Error while updating event" });
            })
    }
    const handleCancel = () => setClickEvent("");
    const handleRemove = () => {
        if (clickObj.id) {
            deleteSingleEvent(`${process.env.NEXT_PUBLIC_HOST}/api/event/${clickObj.id}/delete`)
                .then(function () {
                    Toastify({ title: "Event deleted succesfully" });
                    getApiEventDate();
                    setClickEvent("");
                    setClickObj({})
                }).catch(function (error) {
                    Toastify({ showIcon: true, title: "Error while deleting event" });
                })
        } else {

        }
    };


    useEffect(() => {

        setDates([...Array(totalDays)].map((_, index) => ({
            date: format(addDays(lastDate, index), "yyyy-MM-dd")
        })));
        getApiEventDate();
    }, [lastDate, apiCall, totalDays])




    return (
        <>
            <div className='w-full py-8 '>
                <table className='w-full '>
                    <thead className=''>
                        <tr className=''>
                            <th className='w-20'></th>
                            {dates.map((d, index) => (
                                <th key={index}>
                                    <div className={`w-fit m-auto py-2 px-5 ${parseInt(moment().format("DD")) === moment(d.date).date() ? "bg-calendar-purple rounded-full  " : "bg-none "}`}>
                                        <p className={` text-[12px] ${parseInt(moment().format("DD")) === moment(d.date).date() ? "text-white" : "text-gray-500"}`}>{moment(d.date).format('ddd')}</p>
                                        <p className={`text-[18px] ${parseInt(moment().format("DD")) === moment(d.date).date() ? "text-yellow-300" : "text-black"}`}>{moment(d.date).date()}</p>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='overflow-auto h-screen '>
                        {timeIntervals.map((ti, hourIndex) => hourIndex !== timeIntervals.length - 1 && (
                            <tr key={hourIndex} className='text-center divide-x-2 divide-y-2'>
                                <td className='text-xs pr-2 w-20 h-12 text-right flex justify-end text-gray-500 font-bold'>{ti}</td>
                                {dates.map((date, dateIndex) => (
                                    <td key={dateIndex} className={`relative cursor-pointer md:w-36`} onClick={(e) => {
                                        if (!myEventsData.some((obj, i) => date.date === obj.date && ti.split(" ")[0] === obj.time.split("-")[0].split(":")[0] && ti.split(" ")[1] === obj.time.split("-")[0].split(":")[1].split(" ")[1])) {
                                            handleClick(e, "no", String(hourIndex) + dateIndex, [], date?.date, ti)
                                        }
                                    }} >
                                        <div className={`grid grid-cols-${document.getElementById(`parentDiv${String(hourIndex) + dateIndex}`)?.childElementCount} gap-1 overflow-auto h-12`} id={`parentDiv${String(hourIndex) + dateIndex}`}>
                                            {
                                                myEventsData.map((obj, i) => date.date === obj.date && ti.split(" ")[0] === obj.time.split("-")[0].split(":")[0] && ti.split(" ")[1] === obj.time.split("-")[0].split(":")[1].split(" ")[1] && (
                                                    <div className={` flex flex-nowrap items-start p-2 font-semibold flex-col justify-start text-[10px] text-white gap-0.5 bg-calendar-purple`} key={i} onClick={(e) =>
                                                        handleClick(e, "yes", String(hourIndex) + dateIndex, obj, date?.date, ti)}>
                                                        <p className=''>{obj?.value || "(No title)"}</p>
                                                        <p className=''>{obj?.time}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {
                            clickEvent && (
                                <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                                    <AddTask
                                        clickObj={clickObj}
                                        setClickObj={setClickObj}
                                        username={userinfo?.name}
                                        handleCancel={handleCancel}
                                        handleSave={handleSave}
                                        handleRemove={handleRemove}
                                    />
                                </div>
                            )
                        }
                    </tbody>
                </table>
            </div >
        </>
    )
};

export default Calendartable;
