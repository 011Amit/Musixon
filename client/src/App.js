
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import { Home, Login, Dashboard, MusicPlayer } from './components'
import { app } from './config/firebase.config';
import { getAuth } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion'
import { validateUser } from './api'
import { useStateValue } from './context/StateProvider';
import { actionType } from './context/reducer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// const App  = () =>{
//     const firebaseAuth = getAuth(app);
//     const navigate = useNavigate();
//     const [{ user, isSongPlaying }, dispatch] = useStateValue();

//     const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")
   

//     useEffect(() => {
//         firebaseAuth.onAuthStateChanged((userCred) => {
//             // console.log(userCred)
//             if (userCred) {
//                 userCred.getIdToken().then((token) => {
                    
//                     validateUser(token).then((data) => {
                        
//                         dispatch({
//                             type: actionType.SET_USER,
//                             user: data,
//                         })
//                     });
//                 })
//             } else {
//                 setAuth(false);
//                 window.localStorage.setItem("auth", "false");
//                 dispatch({
//                     type: actionType.SET_USER,
//                     user: null,
//                 })
//                 navigate("/login");
//             }
//         })
//     }, [])

//     // return (
//     //     <div className='bg-blue-400 '>
//     //     This is first Page
//     //     <Routes>
//     //         <Route path='/login' element = {<Login setAuth={setAuth}/>}/>
//     //         <Route path='/*' element = {<Home/>}/>
//     //     </Routes>
//     // </div>
//     // )
    
//     return (
        
//         <AnimatePresence >

//             <div className='min-w-[600px] h-auto bg-slate-700 text-red-400 flex justify-center items-center'>
//                <Routes>
//                     <Route path='/login' element={<Login setAuth={setAuth} />} />
//                     <Route path='/*' element={<Home />} />
//                     <Route path='/dashboard/*' element={<Dashboard />} />

//                 </Routes>

//                 <ToastContainer
//                     position="top-right"
//                     autoClose={2000}
//                     hideProgressBar={false}
//                     newestOnTop
//                     closeOnClick
//                     rtl={false}
//                     pauseOnFocusLoss
//                     draggable
//                     pauseOnHover={false}
//                     theme="dark"
//                 />
//                 {isSongPlaying && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 50 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0 rounded-md  bg-gray-800 drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
//                     >
//                         <MusicPlayer />
//                     </motion.div>
//                 )} 
//             </div>

//         </AnimatePresence>
//     )
    
// }

const App = () => {

    const firebaseAuth = getAuth(app);
    const navigate = useNavigate();

    const [{ user, isSongPlaying }, dispatch] = useStateValue();


    const [auth, setAuth] = useState(false || window.localStorage.getItem("auth") === "true")


    useEffect(() => {
        firebaseAuth.onAuthStateChanged((userCred) => {
            if (userCred) {
                userCred.getIdToken().then((token) => {
                    // console.log(token);
                    validateUser(token).then((data) => {
                        dispatch({
                            type: actionType.SET_USER,
                            user: data,
                        })
                    });
                })
            } else {
                setAuth(false);
                window.localStorage.setItem("auth", "false");
                dispatch({
                    type: actionType.SET_USER,
                    user: null,
                })
                navigate("/login");
            }
        })
    }, [])




    return (
        <AnimatePresence mode='wait'>

            <div className='min-w-[600px] h-auto bg-slate-700 text-red-400 flex justify-center items-center'>
                <Routes>
                    <Route path='/login' element={<Login setAuth={setAuth} />} />
                    <Route path='/*' element={<Home />} />
                    <Route path='/dashboard/*' element={<Dashboard />} />

                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover={false}
                    theme="dark"
                />
                {isSongPlaying && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0 rounded-md  bg-gray-800 drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
                    >
                        <MusicPlayer />
                    </motion.div>
                )}
            </div>

        </AnimatePresence>
    )
}

export default App;
