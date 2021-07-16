import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { useBus, useListener } from 'react-bus'
import { useAudioPlayer/*, useAudioPosition */} from 'react-use-audio-player'

// styles
import * as styles from "../styles/components/episodeCard.module.scss"

// markup
const EpisodeCard = ({ episode }) => {
    const bus = useBus()
    const { playing } = useAudioPlayer()

    // track whether to resume or change source
    const [lastAudioId, setLastAudioId] = React.useState("")

    // track whether current audio is the one playing
    const [currentAudioPlaying, setCurrentAudioPlaying] = React.useState(false)
    const changeSource = React.useCallback(event => {
        setCurrentAudioPlaying(episode.id === event.id)
        setLastAudioId(event.id)
    })
    useListener("changePlayerSource", changeSource)

    const playerReset = React.useCallback(event => {
        setCurrentAudioPlaying(false)
        setLastAudioId("")
    })
    useListener("audioPlayerReset", playerReset)
    
    // length
    let d = Number(episode.duration/1000);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);

    return (
        <div className={styles.card}>
            <div className={styles.playButton}>
                <div className={styles.circle} onClick={
                    () => {
                        if (currentAudioPlaying) {
                            bus.emit("pausePlayer")
                            setCurrentAudioPlaying(false)
                        } else if(lastAudioId === episode.id) {
                            bus.emit("resumePlayer")
                            setCurrentAudioPlaying(true)
                        } else {
                            bus.emit("changePlayerSource", {
                                source: episode.audioUrl,
                                title: `Episode ${episode.episode_number}: ${episode.title}`,
                                id: episode.id,
                                duration: episode.duration
                            })
                        }
                    }
                }>
                    {(playing && currentAudioPlaying) ? <img src={require("../images/pause.png").default} alt={"play button"} /> : <img style={{marginLeft:2}} src={require("../images/play.png").default} alt={"play button"} />}
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