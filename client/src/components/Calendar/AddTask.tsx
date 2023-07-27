import { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { FcCalendar } from 'react-icons/fc';
import { MdCancel, MdOutlineWatchLater } from 'react-icons/md';
import { TiTick } from 'react-icons/ti';
import { ImCross } from 'react-icons/im';
import moment from 'moment';


export default function AddTask({ width = "w-96", username, clickObj, setClickObj, handleCancel, handleSave, handleRemove = () => { }, isRemoveVisible = true }) {
    const [eventValue, setEventValue] = useState(clickObj?.value || "")
    const [confirmRemove, setConfirmRemove] = useState(false);
    const duration = [15, 30, 45, 60];
    return <>
        <div className={`h-96 bg-white ${width} rounded-lg shadow-lg border relative`}>
            <div className="bg-gray-100 text-gray-400 font-bold h-8 rounded-t-lg flex justify-end items-center gap-4 text-right px-4 text-lg w-full leading-8">
                {isRemoveVisible && <p className='cursor-pointer' onClick={() => setConfirmRemove(true)}><FaTrash /></p>}
                <p className='cursor-pointer text-sm' onClick={handleCancel}><ImCross /></p>
            </div>
            <div className="p-4 flex flex-col gap-y-5">
                <input type="text" defaultValue={eventValue} placeholder="Add Title" className="eventInput px-1" onChange={(e) => setEventValue(e.target.value)} />
            </div>

            <div className="flex px-4 gap-4 items-center py-4">
                <div className="text-2xl text-gray-400">
                    <MdOutlineWatchLater />
                </div>
                <div className='flex w-full gap-2 flex-nowrap items-center'>
                    <p className='text-sm text-gray-500 font-medium'>{moment(clickObj?.date).format('dddd, D MMMM')}</p>
                    <div className='text-md text-gray-500 font-medium h-fit  flex gap-2 outline-none'>
                        <input type="time" name="" id="" className='outline-none gap-2' defaultValue={clickObj?.start_time} onChange={(e) => setClickObj({ ...clickObj, start_time: e.target?.value })} />
                    </div>
                </div>
            </div>
            <div className="flex px-4 gap-4 items-center pb-4">
                <div className="text-2xl text-gray-400">
                    <MdOutlineWatchLater />
                </div>
                <div className='flex w-full gap-2 flex-nowrap items-center'>
                    <p className='text-sm text-gray-500 font-medium'>Duration (mins) :</p>
                    <div className='text-sm text-gray-500 font-medium h-fit w-12 flex gap-2'>
                        <select name="" id="method" className='py-1 outline-none rounded-md px-2' onChange={(e) => setClickObj({ ...clickObj, duration: e.target?.value })}>
                            <option value="" className='hidden'></option>
                            {duration.map((t) => (
                                <option value={t} selected={parseInt(clickObj?.duration) === t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="flex px-4 gap-4 items-center">
                <div className="w-5 h-5 text-gray-400">
                    <img src="../../meet.png" alt='google meet' />
                </div>
                <div className='bg-blue-600 shadow-inner shadow-blue-500 px-4 py-2 text-sm text-white rounded-md'>
                    Add Google meet video conferencing
                </div>
            </div>
            <div className="flex px-4 gap-4 items-center py-4">
                <div className="text-2xl text-gray-400">
                    <FcCalendar />
                </div>
                <div className='text-md uppercase text-gray-500 font-medium '>
                    <p className='text-semibold'>{username}</p>
                    <p className='text-[12px] capitalize'>Notify 10 min before</p>
                </div>
            </div>
            <div className="flex justify-end px-8 my-4">
                <div className={`rounded-sm w-fit py-2 text-sm font-bold text-white px-8 mr-0 cursor-pointer ${eventValue.length > 3 ? "bg-blue-500" : "bg-gray-400 pointer-events-none"}`} onClick={() => handleSave(eventValue)}>
                    Save
                </div>
            </div>
            {
                confirmRemove &&
                <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center gap-2 bg-white/70">
                    <div className="rounded-lg w-fit py-2 text-lg font-bold text-white px-6 mr-0 cursor-pointer bg-gray-600" onClick={() => setConfirmRemove(false)}>
                        <MdCancel />
                    </div>
                    <div className="rounded-lg w-fit py-2 text-xl font-bold text-white px-6 mr-0 cursor-pointer bg-red-600" onClick={handleRemove}>
                        <TiTick />
                    </div>
                </div>
            }
        </div >
    </>
};
