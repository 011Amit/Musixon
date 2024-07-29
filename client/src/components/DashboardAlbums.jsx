import React, { useEffect } from 'react'
import { getAllAlbums } from '../api'
import { useStateValue } from '../context/StateProvider'
import { actionType } from '../context/reducer'
import SongCard from './SongCard'

const DashboardAlbums = () => {
  const [{ allAlbums }, dispatch] = useStateValue()

  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data.album,
        })
      });
    }
  }, [])

  return (
    <div className='w-full p-4 flex items-center justify-center flex-col'>
      <div className='relative w-full min-h-[480px] my-4 p-4 py-16 border bg-gray-600 border-gray-800 rounded-md'>
        {/* count */}

        <div className='absolute top-4 left-4'>
          <p className='text-l font-semibold'>
            Count{' : '}
            <span className='text-l font-bold text-white'>
              {allAlbums?.length}
            </span>
          </p>
        </div>

        {/* song container */}
        <SongContainer data={allAlbums} />
      </div>
    </div>
  )
}










export const SongContainer = ({ data }) => {
  return (
    <div className='w-full flex flex-wrap gap-3 items-center justify-evenly'>
      {data &&
        data.map((song, i) => (
          <SongCard key={song._id} data={song} index={i} type="album" />
        ))}
    </div>
  )
}


export default DashboardAlbums
