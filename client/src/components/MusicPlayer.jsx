import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { IoMdClose } from "react-icons/io";
import { IoArrowRedo, IoMusicalNote } from "react-icons/io5";
import { motion } from "framer-motion";
import { BsMusicNoteList } from 'react-icons/bs'

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../context/reducer";
import { getAllSongs } from "../api";
import { RiPlayListFill } from "react-icons/ri";



import { getLyrics } from '../api'

const MusicPlayer = () => {
    const [isPlayList, setIsPlayList] = useState(false);
    const [isLyrics, setIsLyrics] = useState(false);
    const [lyrics, setlyrics] = useState("")
    const [{ allSongs, songIndex, isSongPlaying, miniPlayer }, dispatch] = useStateValue();


    const closeMusicPlayer = () => {
        if (isSongPlaying) {
            dispatch({
                type: actionType.SET_ISSONG_PLAYING,
                isSongPlaying: false,
            });
        }
    };

    const togglePlayer = () => {
        if (miniPlayer) {
            dispatch({
                type: actionType.SET_MINI_PLAYER,
                miniPlayer: false,
            });
        } else {
            dispatch({
                type: actionType.SET_MINI_PLAYER,
                miniPlayer: true,
            });
        }
    };



    const nextTrack = () => {
        if (songIndex === allSongs.length - 1) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: 0,
            });
        } else {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: songIndex + 1,
            });
        }
    };

    const previousTrack = () => {
        if (songIndex === 0) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: 0,
            });
        } else {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: songIndex - 1,
            });
        }
    };




    useEffect(() => {
        if (songIndex > allSongs.length) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: 0,
            });
        }


        const data = allSongs[songIndex]?.name + "+" + allSongs[songIndex]?.artist;

        getLyrics(data).then((res) => {
            setlyrics(res.data.lyrics);
        });



    }, [songIndex]);



    return (
        <div className="w-full full flex items-center gap-3 overflow-hidden">
            <div
                className={`w-full full items-center gap-3 p-4 ${miniPlayer ? "absolute top-40" : "flex relative"
                    }`}
            >
                <img
                    src={allSongs[songIndex]?.imageURL}
                    className="w-40 h-20 object-cover rounded-md"
                    alt="Song Art"
                />
                <div className="flex items-start flex-col">
                    <p className="text-xl text-red-400 font-semibold">
                        {`${allSongs[songIndex]?.name.length > 20
                            ? allSongs[songIndex]?.name.slice(0, 20)
                            : allSongs[songIndex]?.name
                            }`}{" "}
                        <span className="text-base">({allSongs[songIndex]?.album})</span>
                    </p>
                    <p className="text-red-400">
                        {allSongs[songIndex]?.artist}{" "}
                        <span className="text-sm text-red-400 font-semibold">
                            ({allSongs[songIndex]?.category})
                        </span>
                    </p>

                    <motion.i
                        whileTap={{ scale: 0.8 }}
                        onClick={() => setIsPlayList(!isPlayList)}
                    >
                        <RiPlayListFill className="text-red-400 hover:text-white text-3xl cursor-pointer" />
                    </motion.i>


                </div>

                <div className="flex-1">
                    <AudioPlayer
                        src={allSongs[songIndex]?.songURL}
                        onPlay={() => console.log("is playing")}
                        autoPlay={true}
                        showSkipControls={true}
                        onClickNext={nextTrack}
                        onClickPrevious={previousTrack}
                        onEnded={nextTrack}
                    />
                </div>
                <div className="h-full flex items-center justify-center flex-col gap-3">
                    <motion.i whileTap={{ scale: 0.8 }} onClick={() => setIsLyrics(!isLyrics)}>
                        <BsMusicNoteList className="text-gray-200 hover:text-red-300 text-2xl cursor-pointer" />
                    </motion.i>

                    <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
                        <IoMdClose className="text-red-400 hover:text-white text-2xl cursor-pointer" />
                    </motion.i>

                    <motion.i whileTap={{ scale: 0.8 }} onClick={togglePlayer}>
                        <IoArrowRedo className="text-gray-200 hover:text-red-300 text-2xl cursor-pointer" />
                    </motion.i>
                </div>
            </div>

            {isPlayList && (
                <>
                    <PlayListCard />
                </>
            )}

            {
                isLyrics && (
                    <>
                        <LyricsCard lyrics={lyrics} />
                    </>
                )
            }

            {miniPlayer && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed right-2 bottom-2 "
                >
                    <div className="w-40 h-40 rounded-full flex items-center justify-center  relative ">
                        <div className="absolute inset-0 rounded-full bg-red-400 blur-xl animate-pulse"></div>
                        <img
                            onClick={togglePlayer}
                            src={allSongs[songIndex]?.imageURL}
                            className="z-50 w-32 h-32 rounded-full object-cover cursor-pointer"
                            alt=""
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export const PlayListCard = () => {
    const [{ allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();

    useEffect(() => {
        if (!allSongs) {
            getAllSongs().then(data => {
                dispatch({
                    type: actionType.SET_ALL_SONGS,
                    allSongs: data.song
                })
            })
        }
    }, []);

    const setCurrentPlaySong = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_ISSONG_PLAYING,
                isSongPlaying: true,
            });
        }
        if (songIndex !== index) {
            dispatch({
                type: actionType.SET_SONG_INDEX,
                songIndex: index,
            });
        }
    };

    return (
        <div className="absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md backdrop-blur-sm bg-gray-700">
            {allSongs.length > 0 ? (
                allSongs.map((music, index) => (
                    <motion.div
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`group w-full p-4 hover:bg-card flex  gap-3 items-center cursor-pointer ${music?._id === allSongs[songIndex]._id ? "bg-card" : "bg-transparent"
                            }`}
                        onClick={() => setCurrentPlaySong(index)}
                        key={index}
                    >
                        <IoMusicalNote className="text-white group-hover:text-red-400 text-2xl cursor-pointer" />

                        <div className="flex items-start flex-col">
                            <p className="text-lg text-white font-semibold group-hover:text-red-400">
                                {`${music?.name.length > 20
                                    ? music?.name.slice(0, 20)
                                    : music?.name
                                    }`}{" "}
                                <span className="text-base">({music?.album})</span>
                            </p>
                            <p className="text-gray-200 group-hover:text-red-300">
                                {music?.artist}{" "}
                                <span className="text-sm text-gray-200 font-semibold">
                                    ({music?.category})
                                </span>
                            </p>
                        </div>
                    </motion.div>
                ))
            ) : (
                <></>
            )}
        </div>
    );
};

export const LyricsCard = ({ lyrics }) => {


    return (
        <div className="absolute right-4 bottom-28 gap-2 px-4 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md bg-gray-700 text-gray-200">
            <p>
                {lyrics}
            </p>
        </div>
    );
};

export default MusicPlayer;