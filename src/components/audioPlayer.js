import React from "react"
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player"
import { useSelector, useDispatch } from 'react-redux'

import { resetSource } from "../state/features/audioPlayer/audioPlayerSlice"

import * as styles from "../styles/components/audioPlayer.module.scss"

const AudioPlayer = () => {
    const dispatch = useDispatch()

    const source = useSelector(state => state.audioPlayer.source.url)

    // source title
    const title = useSelector(state => state.audioPlayer.source.title)

    // source unique id
    const id = useSelector(state => state.audioPlayer.source.id)

    // source duration
    const duration = useSelector(state => state.audioPlayer.source.duration)

    // audio player
    const { togglePlayPause, playing, stop } = useAudioPlayer({
        src: source,
        format: "mp3",
        autoplay: true,
        html5: true,
    })
    const { percentComplete, /* seek */ } = useAudioPosition({ highRefreshRate: false })

    // seek bar
    const fullLength = new Date(duration).toISOString().substr(11, 8)
    const playedLength = new Date(duration * percentComplete / 100).toISOString().substr(11, 8)

    // save play progress in local storage
    if (percentComplete > 0 && id !== "") {
        localStorage.setItem(`playProgress:${id}`, percentComplete)
    }

    return (
        <div className={`${styles.player} ${id !== '' ? '' : styles.hidden}`}>
            <div className={styles.header}>
                <h4>{title}</h4>

                <button onClick={() => {
                    dispatch(resetSource())
                    
                    setTimeout(() => {stop()}, 500)
                }}>close</button>
            </div>

            <div className={styles.controls}>
                <button onClick={togglePlayPause}>{playing ? <img src={require("../images/pause.png").default} alt={"pause button"} /> : <img src={require("../images/play.png").default} alt={"play button"} />}</button>

                <div className={styles.progress}>
                    <div className={styles.barOuter}>
                        <div className={styles.bar} style={{ width: `${percentComplete}%` }}></div>
                    </div>


                    <div className={styles.duration}>
                        <span>{playedLength}</span>  <span>{fullLength}</span>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default AudioPlayer