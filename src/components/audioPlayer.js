import React, { useState } from "react"
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player"
import { useListener, useBus } from 'react-bus'

import * as styles from "../styles/components/audioPlayer.module.scss"

const AudioPlayer = ({ file }) => {
    // prep bus
    const bus = useBus()

    // source file state
    let [source, setSource] = useState("")

    // source title
    let [title, setTitle] = useState("")

    // source unique id
    let [id, setId] = useState("")

    // source duration
    let [duration, setDuration] = useState(0)

    // audio player
    const { togglePlayPause, playing, play, stop, pause, ready } = useAudioPlayer({
        src: source,
        format: "mp3",
        autoplay: true,
        html5: true,
    })
    const { percentComplete, seek } = useAudioPosition({ highRefreshRate: false })

    // event listener for changing source
    const changeSource = React.useCallback(event => {
        console.log("changing source: " + event.id)
        stop()
        setSource(event.source)
        setTitle(event.title)
        setId(event.id)
        setDuration(event.duration)

        // check if there is previous progress
        let savedProgress = localStorage.getItem(`playProgress:${event.id}`)
        if(savedProgress > 0) {
            console.log(event.duration)
            console.log("found previous play progress: " + savedProgress)
            //console.log(localStorage.getItem(`playProgress:${id}`))
            console.log("seeking to: " + event.duration/1000 * savedProgress/100)
            seek(event.duration/1000 * savedProgress/100)

            /*while (!ready) {
                console.log(ready)
            }*/
        }

        if(!playing) play()
        seek(100)
    })
    useListener("changePlayerSource", changeSource)

    // event listener for pausing
    const pausePlayer = React.useCallback(event => {
        pause()
    })
    useListener("pausePlayer", pausePlayer)

    // event listener for resuming (playing)
    const resumePlayer = React.useCallback(event => {
        play()
    })
    useListener("resumePlayer", resumePlayer)

    // seek bar
    const fullLength = new Date(duration).toISOString().substr(11, 8)
    const playedLength = new Date(duration * percentComplete / 100).toISOString().substr(11, 8)

    // reset function
    const resetPlayer = () => {
        setSource("")
        setTitle("")
        setId("")
        stop()
        bus.emit("audioPlayerReset")
        // seek(0)
    }

    // save play progress in local storage
    if (percentComplete > 0 && id !== "") {
        localStorage.setItem(`playProgress:${id}`, percentComplete)
    }

    return (
        <div className={`${styles.player} ${title !== '' ? '' : styles.hidden}`}>
            <div className={styles.header}>
                <h4>{title}</h4>

                <button onClick={resetPlayer}>close</button>
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