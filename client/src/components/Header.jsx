import React from 'react'
import { Navigate, NavLink, useNavigate } from 'react-router-dom'

// icons

import { IconContext } from 'react-icons/lib'
import { FaMusic, FaHome, FaCrown } from "react-icons/fa"

import { TbPremiumRights } from "react-icons/tb"
import { MdOutlinePermContactCalendar } from "react-icons/md"


import { logo } from '../assets/img'


import { isActiveStyles, isNotActiveStyles } from '../utils/styles'
import { useStateValue } from '../context/StateProvider'
import { getAuth } from 'firebase/auth'
import { app } from '../config/firebase.config'
import { actionType } from "../context/reducer";

import { motion } from 'framer-motion'
import { useState } from 'react'


const Header = () => {
    const [{ user, isSongPlaying }, dispatch] = useStateValue();



    const [isMenu, setIsMenu] = useState(false)

    const navigate = useNavigate();

    const logOut = () => {
        const firebaseAuth = getAuth(app);
        firebaseAuth.signOut().then(() => {
            window.localStorage.setItem("auth", "false");
        }).catch((e) => console.log(e))
        navigate("/login", { replace: true })

        if (isSongPlaying) {
            dispatch({
                type: actionType.SET_ISSONG_PLAYING,
                isSongPlaying: false,
            });
        }

    }





    return (
        <header className='flex items-center w-full p-4 md:py-2 md:px-6'>
             <NavLink to={"/"}>
                <img className='w-16' src={logo} alt='Logo' />
            </NavLink>
            
            <ul className='flex items-center justify-center ml-7'>
                <li className='mx-5 text-lg'>
                    <NavLink to={"/home"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}>
                        <IconContext.Provider value={{ size: '24px', className: 'mx-5 text-lg' }}>
                            {<FaHome />}
                            <p className='text-lg text-center'>Home</p>
                        </IconContext.Provider>
                    </NavLink>
                </li>
                <li className='mx-5 text-lg'>
                    <NavLink to={"/exclusive"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}>
                        <IconContext.Provider value={{ size: '24px', className: 'mx-5 text-lg' }}>
                            {<FaMusic />}
                            <p className='text-lg text-center'>Exclusive</p>
                        </IconContext.Provider>
                    </NavLink>
                </li>
                <li className='mx-5 text-lg'>
                    <NavLink to={"/premium"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}>
                        <IconContext.Provider value={{ size: '24px', className: 'mx-6 text-lg' }}>
                            {<TbPremiumRights />}
                            <p className='text-lg text-center'>Premium</p>
                        </IconContext.Provider>
                    </NavLink>
                </li>
                <li className='mx-5 text-lg'>
                    <NavLink to={"/contact"} className={({ isActive }) => isActive ? isActiveStyles : isNotActiveStyles}>
                        <IconContext.Provider value={{ size: '24px', className: 'mx-8 text-lg ' }}>
                            {<MdOutlinePermContactCalendar />}
                            <p className='text-lg text-center'>Contact Us</p>
                        </IconContext.Provider>
                    </NavLink>
                </li>
            </ul>

            <div
                onMouseEnter={() => setIsMenu(true)}
                onMouseLeave={() => setIsMenu(false)}

                className='flex items-center ml-auto cursor-pointer gap-2 relative'>
                <img src={user?.user?.imageURL} className='w-12 h-12 min-w-[44px] object-cover rounded-full shadow-lg' alt="" referrerPolicy='no-referrer' />
                <div className='flex flex-col'>
                    <p className='text-white text-lg hover:text-slate-200 font-semibold'>{user?.user?.name}</p>
                    <p className='flex items-center gap-2 text-xs text-slate-300 font-normal'>Premum Member.<FaCrown className='text-sm -ml-1 text-yellow-500' /> </p>
                </div>

                {isMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className='absolute z-10 top-12 p-4 right-0 w-275 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col'>

                        <NavLink to="/userProfile">
                            <p className='text-base text-white hover:font-semibold hover:text-red-400 duration-150 transition-all ease-in-out'>
                                Profile
                            </p>

                        </NavLink>

                        <p className='text-base text-white hover:font-semibold hover:text-red-400 duration-150 transition-all ease-in-out'>
                            My Favourites
                        </p>

                        <hr />

                        {

                            user?.user?.role === "admin" &&
                            (
                                <>
                                    <NavLink to={"/dashboard/home"}>
                                        <p className='text-base text-white hover:font-semibold hover:text-red-400 duration-150 transition-all ease-in-out'>
                                            Dashboard
                                        </p>
                                    </NavLink>
                                    <hr />
                                </>
                            )
                        }






                        <p className='text-base text-white hover:font-semibold hover:text-red-400 duration-150 transition-all ease-in-out' onClick={logOut}>
                            Sign Out
                        </p>

                    </motion.div>
                )}


            </div> 

        </header>
    )
}

export default Header
