import React from 'react'
import { useEffect } from 'react'

import { GiLoveSong, GiMusicalNotes } from "react-icons/gi";
import { RiUserStarFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";

import { bgColors } from "../utils/styles";

import { getAllUsers,getAllSongs,getAllArtist,getAllAlbums } from '../api'
import { actionType } from '../context/reducer'
import {useStateValue} from '../context/StateProvider'

export const DashboardCard = ({icon,name,count})=>{

  const bg_color = bgColors[parseInt(Math.random()*bgColors.length)];

  return(
    <div 
    style={{background:`${bg_color}`}}
    className='p-4 w-40 gap-3 h-auto rounded-lg shadow-md flex flex-col items-center justify-center'>
      {icon}
      <p className='text-xl text-red-400 font-semibold'>{name}</p>
      <p className='text-xl text-red-400 font-semibold'>{count}</p>
    </div>
  )
}

const DashboardHome = () => {

  const [{allUsers,allSongs,allArtists,allAlbums},dispatch] = useStateValue();

  useEffect(() => {
    
    if(!allUsers){
      getAllUsers().then((data)=>{
        dispatch({
          type:actionType.SET_ALL_USERS,
          allUsers:data.data,
        })
      })
    }

    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type:actionType.SET_ALL_SONGS,
          allSongs:data.song,
        })
      })
    }

    if (!allArtists) {
      getAllArtist().then((data) => {
        dispatch({
          type:actionType.SET_ALL_ARTISTS,
          allArtists:data.artist,
        })
      });
    }

    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({
          type:actionType.SET_ALL_ALBUMS,
          allAlbums:data.album,
        })
      });
    }

  }, [])
  

  return (
    <div className='w-full p-6 flex items-center justify-evenly flex-wrap'>
      
      <DashboardCard icon={<FaUsers className="text-3xl text-white" />} name={"Users"} count={allUsers?.length > 0 ? allUsers?.length : 0} />
      
      <DashboardCard icon={<GiLoveSong className="text-3xl text-white" />} name={"Songs"} count={allSongs?.length > 0 ? allSongs?.length : 0} />

      <DashboardCard icon={<RiUserStarFill className="text-3xl text-white" />} name={"Artist"} count={allArtists?.length > 0 ? allArtists?.length : 0} />

      <DashboardCard icon={<GiMusicalNotes className="text-3xl text-white" />} name={"Album"} count={allAlbums?.length > 0 ? allAlbums?.length : 0} />
    
    </div>
  )
}

export default DashboardHome
