import React from 'react'
import { motion } from 'framer-motion'
import { IoTrash } from 'react-icons/io5'
import { useState } from 'react'
import { deleteSongById, deleteArtistById, deleteAlbumById, getAllSongs, getAllArtist, getAllAlbums } from '../api'
import { useStateValue } from '../context/StateProvider'
import { actionType } from '../context/reducer'

import { toast } from 'react-toastify';

import { storage } from '../config/firebase.config'
import {
  getStorage,
  ref,
  deleteObject
} from 'firebase/storage'

const SongCard = ({ data, index, type }) => {
  const [isDelete, setIsDelete] = useState(false)
  const [{ allSongs, allArtists, allAlbums, songIndex, isSongPlaying }, dispatch] = useStateValue()


  const deleteAnObject = (referenceUrl) => {
    const deleteRef = ref(storage, referenceUrl);
    deleteObject(deleteRef)
      .then(() => {
        return true;
      })
      .catch((error) => {
        return false;
      });
  };

  const deleteCombo = (data, type) => {
    if (type === "song") {

      deleteAnObject(data.imageURL)
      deleteAnObject(data.songURL)

      deleteSongById(data._id).then((res) => {
        if (res.data) {
          toast.success("Deleted Successfully", {
            theme: "dark"
          })
        } else {
          toast.success("Something went Wrong", {
            theme: "dark"
          })
        }
      })

      getAllSongs().then(data => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.song
        })
      })

    }

    if (type === "artist") {
      deleteAnObject(data.imageURL)
      deleteArtistById(data._id).then((res) => {
        if (res.data) {
          toast.success("Deleted Successfully", {
            theme: "dark"
          })
        } else {
          toast.success("Something went Wrong", {
            theme: "dark"
          })
        }
      })

      getAllArtist().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data.artist,
        })
      });
    }

    if (type === "album") {
      deleteAnObject(data.imageURL)
      deleteAlbumById(data._id).then((res) => {
        if (res.data) {
          toast.success("Deleted Successfully", {
            theme: "dark"
          })
        } else {
          toast.success("Something went Wrong", {
            theme: "dark"
          })
        }
      })

      getAllAlbums().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data.album,
        })
      });
    }

  };

  const addToContext = () => {
    // console.log(isSongPlaying);
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_ISSONG_PLAYING,
        isSongPlaying: true,
      })
    }

    // console.log(isSongPlaying);
    // console.log(songIndex);

    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      })
    }
    // console.log(songIndex);
    // Toastify
    toast.success("Playing", {
      theme: "dark"
    })
  }

  return (
    <motion.div className='relative w-40 min-w-210 px-2 py-4 cursor-pointer  hover:bg-gray-700 bg-gray-600 shadow-md rounded-lg flex flex-col items-center '
    >
      <motion.div className='w-40 min-w-[160px] min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden'>
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          className='w-full h-full rounded-lg object-cover'
          onClick={type === "song" && addToContext}
        />
      </motion.div>

      <p className='font-semibold my-2 text-center' onClick={type === "song" && addToContext}>
        {data.name.length > 25 ? `${data.name.slice(0, 25)}...` : data.name}

        {data.artist && (
          <span className='block text-sm text-gray-400 my-1'>
            {data.artist.length > 25
              ? `${data.artist.slice(0, 25)}...`
              : data.artist}
          </span>
        )}
      </p>

      <div className='w-full absolute bottom-2 right-2 flex items-center justify-between px-4'>
        <motion.i
          whileTap={{ scale: 0.75 }}
          className='text-base text-red-400 drop-shadow-md hover:text-red-500'
          onClick={() => {
            setIsDelete(true)
          }}
        >
          <IoTrash />
        </motion.i>
      </div>


      {isDelete && (
        <motion.div className='absolute inset-0 backdrop-blur-md bg-cardOverlay flex items-center justify-center flex-col px-4 py-2 gap-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className='text-lg text-gray-200 font-semibold text-center'>Are you sure do you want to delete it</p>
          <div className='flex items-center gap-4'>

            <motion.button
              whileTap={{ scale: 0.75 }}
              className='text-sm font-semibold text-slate-800 px-2 py-1 bg-red-300 rounded-md hover:shadow-md uppercase'
              onClick={() => { deleteCombo(data, type); }}
            >
              yes
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.75 }}
              className='text-sm font-semibold text-slate-800 px-2 py-1 bg-green-300 rounded-md hover:shadow-md uppercase'
              onClick={() => { setIsDelete(false) }}
            >
              no
            </motion.button>

          </div>
        </motion.div>
      )}



    </motion.div>
  )
}

export default SongCard
