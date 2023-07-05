import { useContext, useState } from 'react';
import { Calendar } from "react-multi-date-picker";
import { CalendarContext } from '../../pages/_app';
import { startOfWeek } from 'date-fns';
import AddTask from './AddTask';
import moment from 'moment';

const Sidebar = () => {
    const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    const { setlastDate } = useContext(CalendarContext);
    const [showCalendar, setShowcalendar] = useState(false)
    const handleSave = (eventValue) => {

    }
    const handleCancel = () => {
        setShowcalendar(false)
    }
    const handleRemove = () => {

    };

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
                        date={moment(new Date()).format('dddd, D MMMM')}
                        initialValue={""}
                        time={moment(new Date()).format('hh:mm a')}
                        username="Trilochan Behera"
                        handleCancel={handleCancel}
                        handleSave={handleSave}
                        handleRemove={handleRemove}
                    />
                </div>
            }

        </div>
    );
};

export default Sidebar;