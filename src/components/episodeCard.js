import * as React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

// styles
import * as styles from "../styles/components/episodeCard.module.scss"

// markup
const episodeCard = ({ episode }) => (
    <div className={styles.card}>
        <GatsbyImage image={getImage(episode.thumbnailImage)} alt={"y u blind"} />

        <div className={styles.meta}>
            <h3 className={styles.title}>Episode {episode.episode_number}: {episode.title}</h3>
            <span className={styles.duration}>1 hour 23 minutes</span>

            <p className={styles.excerpt}>{episode.excerpt}</p>
        </div>
    </div>
)

export default episodeCard