import { addDays, format, startOfWeek } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import AddTask from './AddTask';
import { getAllEvents, createEvent, updateSingleEvent } from "../services/EventService"
import moment from "moment-timezone"
import { deleteSingleEvent } from '../services/EventService';
import { CalendarContext } from '../../pages/_app';
import Toastify from '../Toastify/toast';
const Calendartable = () => {
    const { lastDate, userinfo } = useContext(CalendarContext);
    const [myEventsData, setMyEventsData] = useState([])
    const [clickEvent, setClickEvent] = useState("");
    const [clickObj, setClickObj] = useState({}) as any;
    const [dates, setDates] = useState([...Array(7)].map((_, index) => ({
        date: format(addDays(startOfWeek(new Date()), index), "yyyy-MM-dd"),
        value: "",
        time: ""
    })));
    const timeIntervals = [];
    for (let hour = 0; hour <= 23; hour++) {
        const date = moment().hour(hour);
        const formattedTime = date.format('h A');
        timeIntervals.push(formattedTime);
    }
    timeIntervals.push('12 AM');

    const handleClick = (id, eventdata, eventdate, time) => {
        setClickEvent(id);
        if (eventdata) {
            setClickObj({ id: eventdata.id, date: eventdata.date, value: eventdata.value, time: time })
        } else {
            setClickObj({ id: null, date: eventdate, value: "", time: time })
        }
    }
    const getApiEventDate = () => {
        getAllEvents(`${process.env.NEXT_PUBLIC_HOST}/api/event/get-events`)
            .then(function (data: any) {
                let newDate = data.events.map((ev, index) => ({
                    date: moment(ev.dateTime).format('YYYY-MM-DD'),
                    value: ev.title,
                    time: `${moment(ev.dateTime).format('h A')} - ${moment(ev.dateTime).clone().add(1, 'hour').format('h A')}`,
                    id: ev._id
                }))
                setMyEventsData(newDate);
            }).catch(function (error) {
                console.log("error while getting events", error)
            })
    }
    const handleSave = (eventValue) => {
        var date = new Date(clickObj.date);
        const time = clickObj.time.split('-')[0].trim();
        const parsedTime = moment(time, 'h A');
        const convertedTime = parsedTime.format('HH');
        date.setHours(parseInt(convertedTime), 0, 0);
        const newObj = {
            dateTime: date.getTime(),
            timezone: moment.tz?.guess(),
            title: eventValue
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
                Toastify({ showIcon: true, title: "Error while creating event" });
            })
    }
    const updateEvent = (obj) => {
        updateSingleEvent(`${process.env.NEXT_PUBLIC_HOST}/api/event/${obj.id}/update`, obj)
            .then(function (data) {
                Toastify({ title: "Event updated succesfully" });
                getApiEventDate();
                setClickEvent("");
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
                }).catch(function (error) {
                    Toastify({ showIcon: true, title: "Error while deleting event" });
                })
        } else {

        }
    };


    useEffect(() => {
        setDates([...Array(7)].map((_, index) => ({
            date: format(addDays(lastDate, index), "yyyy-MM-dd"),
            value: "",
            time: ""
        })));
        getApiEventDate();
    }, [lastDate])

    return (
        <>
            <div className='w-full py-8 '>
                <table className='w-full '>
                    <thead className=''>
                        <tr className=''>
                            <th className='w-20'></th>
                            {dates.map((d, index) => (
                                <th key={index} className='py-2'>
                                    <p className='text-gray-500 text-sm'>{moment(d.date).format('ddd')}</p>
                                    <p className='text-lg'>{moment(d.date).date()}</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className='overflow-auto h-screen '>
                        {timeIntervals.map((ti, hourIndex) => hourIndex !== timeIntervals.length - 1 && (
                            <tr key={hourIndex} className='text-center divide-x-2 divide-y-2'>
                                <td className='text-xs pr-2 w-20 h-12 text-right flex justify-end text-gray-500 font-bold'>{ti}</td>
                                {dates.map((date, dateIndex) => (
                                    <td key={dateIndex} className={`py-3 relative cursor-pointer w-36`}
                                        onClick={() =>
                                            handleClick(String(hourIndex) + dateIndex, myEventsData.find((obj) => obj.date === date.date && obj.time.split('-')[0].trim() === ti), date?.date, String(ti + " - " + timeIntervals[hourIndex + 1]))}
                                    >
                                        {
                                            myEventsData.map((obj) => obj.date === date.date && obj.time.split('-')[0].trim() === ti &&
                                                <div className='absolute top-0 bottom-0 left-0 right-0 flex items-start p-2 font-semibold flex-col justify-start text-[10px] text-white gap-0.5 bg-calendar-purple rounded-md'>
                                                    <p className=''>{obj?.value || "(No title)"}</p>
                                                    <p className=''>{ti} - {timeIntervals[hourIndex + 1]}</p>
                                                </div>
                                            )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {
                            clickEvent && (
                                <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
                                    <AddTask
                                        date={moment(clickObj?.date).format('dddd, D MMMM')}
                                        initialValue={clickObj?.value}
                                        time={clickObj?.time}
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
