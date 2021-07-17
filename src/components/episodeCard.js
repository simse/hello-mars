import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { useAudioPlayer/*, useAudioPosition */} from 'react-use-audio-player'
import { useDispatch, useSelector } from 'react-redux'

import { setSource } from "../state/features/audioPlayer/audioPlayerSlice"

// styles
import * as styles from "../styles/components/episodeCard.module.scss"

// markup
const EpisodeCard = ({ episode }) => {
    const dispatch = useDispatch()
    const { playing, togglePlayPause, play } = useAudioPlayer()

    const sourceId = useSelector(state => state.audioPlayer.source.id)
    const thisAudioPlaying = (sourceId === episode.id)
    
    // length
    let d = Number(episode.duration/1000);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);

    return (
        <div className={styles.card}>
            <div className={styles.playButton}>
                <div className={styles.circle} role={"button"} tabIndex={0} onClick={
                    () => {
                        if (thisAudioPlaying) {
                            togglePlayPause()
                        } else {
                            dispatch(setSource({
                                url: episode.audioUrl,
                                id: episode.id,
                                duration: episode.duration,
                                title: `Episode ${episode.episode_number}: ${episode.title}`,
                            }))
                            play()
                        }
                    }
                }>
                    {(playing && thisAudioPlaying) ? <img src={require("../images/pause.png").default} alt={"play button"} /> : <img style={{marginLeft:2}} src={require("../images/play.png").default} alt={"play button"} />}
                </div>
            </div>

            <GatsbyImage image={getImage(episode.thumbnailImage)} alt={"y u blind"} />

            <div className={styles.meta}>
                <h3 className={styles.title}>Episode {episode.episode_number}: {episode.title}</h3>
                <span className={styles.duration}>{h} hour{h > 1 && 's'} {m} minute{m > 1 && 's'}</span>

                <p className={styles.excerpt}>{episode.excerpt}</p>
            </div>
        </div>
    )
}

export default EpisodeCard