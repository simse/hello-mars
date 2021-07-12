import * as React from "react"
import { graphql } from 'gatsby'

// styles
import * as indexStyles from "../styles/pages/index.module.scss"

// components
import Layout from "../components/layout"
import Mars from "../components/mars"
import EpisodeCard from "../components/episodeCard"

// markup
class IndexPage extends React.Component {
  render() {
    console.log(this.props.data)

    return (
      <Layout>
        <main className={indexStyles.index}>
          <title>Hello Mars / The Podcast</title>

          <Mars style={{height: 120}} />

          <h1 className={indexStyles.title}>Hello Mars</h1>
          <h2 className={indexStyles.subtitle}>
            A podcast about technology, and sometimes space
          </h2>

          <div className={indexStyles.gallery}>
          {this.props.data.episodes.nodes.map(episode => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
          </div>
        </main>
      </Layout>
    )
  }
}

export default IndexPage

export const query = graphql`
query AllPodcastEpisodes {
  episodes: allPodcastEpisode(sort: {fields: episode_number, order: DESC}) {
    nodes {
      id
      title
      sourceId
      episode_number
      excerpt
      thumbnailImage {
        childImageSharp {
          gatsbyImageData(width: 500, height: 300, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF], quality: 100)
        }
      }
    }
  }
}
`