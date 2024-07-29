import React, { useEffect } from 'react';

import {FcGoogle} from 'react-icons/fc';
import {bg,login} from "../assets/img"
import { app } from "../config/firebase.config.js";
import {getAuth, GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import { useStateValue } from '../context/StateProvider.js';
import { actionType } from '../context/reducer.js';
import { validateUser } from '../api/index.js';

const Login = ({setAuth}) => {

  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();


  const loginWithGoogle=async()=>{
    
    await signInWithPopup(firebaseAuth,provider).then((userCred)=>{
      // console.log(userCred)
      if(userCred){
        setAuth(true);
        window.localStorage.setItem("auth","true");

        firebaseAuth.onAuthStateChanged((userCred) => {
          if(userCred){
            userCred.getIdToken().then((token) => {
              // console.log(token)
              validateUser(token).then((data)=>{
                  dispatch({
                    type:actionType.SET_USER,
                    user:data,
                  })
              })
            })
            navigate("/",{replace:true})
          }
          else{
            setAuth(false);
            dispatch({
              type:actionType.SET_USER,
              user:null,
            })
            navigate("/login")
          }
      })

      }
    })
  }

  useEffect(() => {
    if(window.localStorage.getItem("auth")==="true")
      navigate("/",{replace:true});
  }, [])
  




  return (
    <div className='relative w-screen h-screen'>
      {/* <img src={bg} className='w-full h-full object-cover'/> */}
      <video src={login}
      type="video/mp4"
      autoPlay
      muted
      loop
       className='w-full h-full object-cover'
      />

      <div className='absolute inset-0 bg-darkOverlay flex items-center justify-center p-4'>
        <div className='w-full md:w-375 p-4 bg-lightOverlay shadow-2xl rounded-md backdrop-blur-md flex flex-col item-center justify-center'>
          <div className='flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-900 cursor-pointer hover:bg-gray-800 hover:shadow-md hover:font-semibold duration-100 ease-in-out transition-all'
          onClick = {loginWithGoogle}
          >
            <FcGoogle className='text-xl'/>
            Sign in with Google
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login
