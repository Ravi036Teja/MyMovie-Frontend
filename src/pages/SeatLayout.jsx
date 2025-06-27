import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets/assets';
import Loading from '../components/Loading';
import { ClockIcon } from 'lucide-react';
import isoTimeFormat from '../lib/isoTimeFormat';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';

const SeatLayout = () => {
    const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
    const { id, date } = useParams();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [movieData, setMovieData] = useState(null); // Changed from 'show' to 'movieData' for clarity
    const navigate = useNavigate();

    const getMovieAndTimingData = async () => { // Renamed for clarity
        const foundMovie = dummyShowsData.find(m => m._id === id); // Use 'm' to avoid conflict
        const availableTimingsForDate = dummyDateTimeData[date];

        if (foundMovie && availableTimingsForDate) {
            setMovieData({
                movie: foundMovie,
                timings: availableTimingsForDate
            });
        } else {
            setMovieData(null); // Or handle error/not found more gracefully
            console.warn(`Movie with ID ${id} or date ${date} not found for seat layout.`);
            // Optionally, navigate away or show a specific "not found" message
        }
    };

    const handleSeatClick = (seatId) => {
        if (!selectedTime) {
            return toast.error("Please select time first");
        }
        if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) { // Changed to >= 5 as you can select "only 5 seats"
            return toast.error('You can select only 5 seats');
        }
        setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId]);
    };

    // CORRECTED: Added 'return' keyword for the JSX
    const renderSeats = (row, count = 9) => {
        return ( // <--- ADDED RETURN HERE
            <div key={row} className='flex gap-2 mt-2'>
                <div className='flex flex-wrap items-center justify-center gap-2'>
                    {Array.from({ length: count }, (_, i) => {
                        const seatId = `${row}${i + 1}`;
                        // TODO: Add logic for 'occupied' or 'booked' seats later
                        const isOccupied = false; // Placeholder
                        const isSelected = selectedSeats.includes(seatId);
                        return (
                            <button
                                key={seatId}
                                onClick={() => handleSeatClick(seatId)}
                                // Added disabled for occupied seats
                                disabled={isOccupied}
                                className={`h-8 w-8 rounded border border-indigo-700/60 cursor-pointer
                                    ${isSelected ? "bg-indigo-700 text-white" : isOccupied ? "bg-gray-600 cursor-not-allowed" : "bg-transparent"}
                                    ${!isSelected && !isOccupied ? "hover:bg-indigo-700/10" : ""} `}
                            >
                                {seatId}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (id && date) {
            getMovieAndTimingData();
        }
    }, [id, date]); // Dependencies updated

    return movieData ? ( // Use movieData for rendering condition
        <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-28 md:pt-40'>
            {/* Available timings */}
            <div className='w-60 bg-indigo-700/10 border border-indigo-700/20 rounded-lg py-10 h-max md:sticky md:top-30'>
                <p className='text-lg font-semibold px-6'>Available Timings</p>
                <div className='mt-5 space-y-1'>
                    {movieData.timings.map((item) => (
                        <div
                            key={item.time} // Using time as key, assuming it's unique per date
                            onClick={() => setSelectedTime(item)}
                            className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md
                                cursor-pointer transition ${selectedTime?.time === item.time ? "bg-indigo-700 text-white" : "hover:bg-indigo-700/20"}`}
                        >
                            <ClockIcon className='w-4 h-4'/>
                            <p className='text-sm'>{isoTimeFormat(item.time)}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* seat layout */}
            <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
                {/* Corrected: Added '=' to top in BlurCircle */}
                <BlurCircle top='-100px' left='-100px'/>
                <BlurCircle bottom='0px' right='0px'/>
                <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
                <img src={assets.screenImage} alt="screen" /> {/* Ensure assets.screenImage exists and is correct */}
                <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

                <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
                    <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
                        {/* Ensure these are called correctly and return JSX */}
                        {groupRows[0].map(row => renderSeats(row))}
                    </div>

                    <div className='grid grid-cols-2 gap-11'>
                        {groupRows.slice(1).map((group, idx) => {
                            // CORRECTED: Added 'return' for the outer map callback function
                            return ( // <--- ADDED RETURN HERE
                                <div key={idx}>
                                    {group.map(row => renderSeats(row))}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Selected Seats and Book Now button */}
                <div className='mt-8 p-4 bg-indigo-700/10 border border-indigo-700/20 rounded-lg w-full max-w-md text-center'>
                    <p className='text-lg font-semibold'>Selected Seats:</p>
                    <p className='text-sm text-gray-300 mb-4'>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'No seats selected'}</p>
                    <p className='text-lg font-semibold'>Selected Time:</p>
                    <p className='text-sm text-gray-300 mb-4'>{selectedTime ? isoTimeFormat(selectedTime.time) : 'No time selected'}</p>
                    <button
                        onClick={() => {
                            if (selectedSeats.length > 0 && selectedTime) {
                                toast.success(`Booking ${selectedSeats.length} seats for ${movieData.movie.title} at ${isoTimeFormat(selectedTime.time)}`);
                                navigate('/my-bookings')
                                // Implement your actual booking logic here
                                // navigate('/booking-confirmation', { state: { selectedSeats, selectedTime, movieData } });
                            } else {
                                toast.error('Please select seats and a time to book.');
                            }
                        }}
                        className='bg-indigo-700 text-white px-8 py-2 mt-4 rounded hover:bg-indigo-800 transition-all cursor-pointer'
                    >
                        Proceed to Book ({selectedSeats.length} Seats)
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <Loading/>
    );
};

export default SeatLayout;