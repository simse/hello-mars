import React, { useState } from "react"
import { useAudioPlayer, useAudioPosition } from "react-use-audio-player"
import { useListener } from 'react-bus'

import * as styles from "../styles/components/audioPlayer.module.scss"

const AudioPlayer = ({ file }) => {
    // source file state
    let [source, setSource] = useState("")

    // source title
    let [title, setTitle] = useState("")

    // audio player
    const { togglePlayPause, playing, play, stop } = useAudioPlayer({
        src: source,
        format: "mp3",
        autoplay: true,
        html5: true
    })

    // event listener for changing source
    const changeSource = React.useCallback(event => {
        setSource(event.source)
        setTitle(event.title)
        if(!playing) play()
    })
    useListener("changePlayerSource", changeSource)

    // seek bar
    const { percentComplete, duration/*, seek*/ } = useAudioPosition({ highRefreshRate: false })
    const fullLength = new Date(duration * 1000).toISOString().substr(11, 8)
    const playedLength = new Date(duration / 100 * percentComplete * 1000).toISOString().substr(11, 8)

    // reset function
    const resetPlayer = () => {
        setSource("")
        setTitle("")
        setTimeout(() => {stop()}, 500)
        // seek(0)
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