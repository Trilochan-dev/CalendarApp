import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Calendartable from './CalendarTable';

const Calendar = () => {
    return (
        <>
            <div className="flex flex-col justify-center divide-y relative">
                <div className='h-16 flex items-center px-4'>
                    <Navbar />
                </div>
                <div className="flex px-4">
                    <Sidebar />
                    <Calendartable />
                </div>
            </div>
        </>
    )
};

export default Calendar;
