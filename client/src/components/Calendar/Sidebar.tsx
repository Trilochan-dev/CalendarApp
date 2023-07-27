import { useContext, useState } from 'react';
import { Calendar } from "react-multi-date-picker";
import { CalendarContext } from '../../pages/_app';
import { startOfWeek } from 'date-fns';
import AddTask from './AddTask';
import moment from 'moment';
import { createEvent } from '../services/EventService';
import Toastify from '../Toastify/toast';

const Sidebar = () => {
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    const { setlastDate, userinfo, setApiCall } = useContext(CalendarContext);
    const [showCalendar, setShowcalendar] = useState(false);
    const [clickObj, setClickObj] = useState({
        "date": moment(new Date()).format('YYYY-MM-DD'),
        "duration": "60",
        "start_time": moment(new Date()).format('HH:mm')
    });

    const handleSave = (eventValue) => {
        const newObj = {
            date: new Date(clickObj.date),
            timezone: moment.tz?.guess(),
            title: eventValue,
            start_time: clickObj?.start_time,
            duration: clickObj?.duration,
        }
        addEvent(newObj);
    }

    const addEvent = (obj) => {
        createEvent(`${process.env.NEXT_PUBLIC_HOST}/api/event/create`, obj)
            .then(function (data) {
                Toastify({ title: "Event created succesfully" });
                setApiCall(true);
                setShowcalendar(false);
            }).catch(function (error) {
                Toastify({ showIcon: true, title: "Error while creating event" });
            })
    }
    const handleCancel = () => {
        setShowcalendar(false)
    }

    return (
        <div className='flex flex-col gap-2'>
            <div className=" bg-white shadow-lg flex items-center gap-4 px-6 py-1.5 my-4 w-fit rounded-full cursor-pointer hover:shadow-gray-400 border border-gray-200" onClick={() => setShowcalendar(true)
            }>
                <img src="../../plus.png" alt="plus" />
                <p>Create</p>
            </div>
            <Calendar
                onChange={(dateObjects: any) => {
                    setlastDate(startOfWeek(new Date(dateObjects)));
                }}
                weekDays={weekDays}
                monthYearSeparator=" "
                showOtherDays
                weekStartDayIndex={0}
                headerOrder={["MONTH_YEAR", "LEFT_BUTTON", "RIGHT_BUTTON"]}
                className='shadow-lg'
            />
            {
                showCalendar &&
                <div className="w-40">
                    <AddTask
                        clickObj={clickObj}
                        setClickObj={setClickObj}
                        username={userinfo?.name}
                        handleCancel={handleCancel}
                        handleSave={handleSave}
                        isRemoveVisible={false}
                    />
                </div>
            }
        </div>
    );
};

export default Sidebar;
