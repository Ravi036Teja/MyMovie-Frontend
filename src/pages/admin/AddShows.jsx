import React, { useEffect, useState } from 'react'
import Title from '../../components/admin/Title'
import Loading from '../../components/Loading';
import { dummyShowsData } from '../../assets/assets/assets';
import { kConverter } from '../../lib/kConverter';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';

const AddShows = () => {

   const currency = '₹';
   const [nowPlayingMovie, setNowPlayingMovie] = useState([]);
   const [selectedMovie, setSelectedMovie] = useState(null);
   const [dateTimeSelection, setDateTimeSelection] = useState({});
   const [dateTimeInput, setDateTimeInput] = useState('');
   const [showPrice, setShowPrice] = useState('');

   const fetchNowPlayingMovies = async () => {
    setNowPlayingMovie(dummyShowsData)
   };

   const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || []; // Get existing times for the date, or an empty array
      if (times.includes(time)) {
        // If the time already exists for this date, do nothing (prevent duplicates)
        return prev;
      }
      // Add the new time and sort the array
      return { ...prev, [date]: [...times, time].sort() };
    });
    setDateTimeInput(''); // Clear input after adding
   };

   const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        // If no times left for this date, remove the date entry completely
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      // Otherwise, update the times for that date
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
   };

   useEffect(()=> {
    fetchNowPlayingMovies()
   },[]);

  return nowPlayingMovie.length > 0 ? (
   <>
   <Title text1='Add' text2='Shows'/>
   <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
   <div className='overflow-x-auto pb-4 no-scrollbar'>
    <div className='group flex flex-wrap gap-4 mt-4 w-max'>
      {nowPlayingMovie.map((movie) => (
          <div key={movie.id}
               className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40
               hover:-translate-y-1 transition duration-300 ${selectedMovie === movie.id ? 'border-2 border-indigo-700 rounded-lg' : ''}`}
               onClick={() => setSelectedMovie(movie.id)}>
            <div className='relative rounded-lg overflow-hidden'>
              <img src={movie.poster_path} alt={movie.title} className='w-full object-cover brightness-90'/>
              <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
              <p className='flex items-center gap-1 text-gray-400'>
                <StarIcon className='w-4 h-4 text-yellow-500 fill-yellow-500'/>
                {movie.vote_average.toFixed(1)}
              </p>
              <p className='text-gray-300'>{kConverter(movie.vote_count)} Votes</p>
              </div>
            </div>
            {selectedMovie === movie.id && (
              <div className='absolute top-2 right-2 flex  items-center justify-center bg-indigo-700 h-6 w-6 rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5}/>
              </div>
            )}
            <p className='font-medium truncate'>{movie.title}</p>
            <p className='text-gray-400 text-sm'>{movie.release_date}</p>
          </div>
      ))}
    </div>
   </div>

   {/* Show price input */}
   <div className='mt-8'>
    <label htmlFor="show-price" className='block text-sm font-medium mb-2'>Show Price</label>
      <div className='inline-flex items-center gap-2  border border-gray-600 px-3 py-2 rounded-md'>
        <p className='text-gray-400 text-sm'>{currency}</p>
        <input
         id="show-price"
         min={0}
         type="number"
         value={showPrice}
         onChange={(e) => setShowPrice(e.target.value)}
         placeholder='Enter Show Price'
         className='outline-none rounded-md bg-transparent'
        />
      </div>
   </div>

   {/* input fields to get date and time */}
   <div>
    <label htmlFor="datetime-local" className='block text-sm font-medium mb-2 mt-4'>Select Date & Time</label>
    <div className='inline-flex items-center gap-2  border border-gray-600 px-3 py-2 rounded-md'>
      <input
        id="datetime-local"
        type="datetime-local"
        value={dateTimeInput}
        onChange={(e) => setDateTimeInput(e.target.value)}
        className='outline-none rounded-md bg-transparent'
      />
      <button onClick={handleDateTimeAdd} className='bg-indigo-700/80 text-white px-3 py-2 text-sm
      rounded-lg hover:bg-indigo-700 cursor-pointer'>Add Time</button>
    </div>
   </div>

   {/* display selected date & time */}
   {Object.keys(dateTimeSelection).length > 0 && (
    <div className='mt-6'>
      <h2 className='mb-2'>Selected Date & Time</h2>
      <ul className='space-y-3'>
        {Object.entries(dateTimeSelection).map(([date, times]) => (
          <li key={date}>
            <div className='font-medium'>{date}</div>
            <div className='flex flex-wrap gap-2  mt-1 text-sm'>
              {times.map((time) => (
                <div key={`${date}-${time}`} className='border border-indigo-700 px-2 py-1 flex items-center rounded'>
                  <span>{time}</span>
                  <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={15} className='ml-2
                  text-red-500 hover:text-red-700 cursor-pointer'/>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
   )}

   {/* add show */}
   <button className='bg-indigo-700 text-white  px-8 py-2 mt-6  rounded  hover:bg-indigo-800/90 transition-all cursor-pointer'>Add Show</button>
   </>
  ) : <Loading/>
}

export default AddShows;