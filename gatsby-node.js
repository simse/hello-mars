const axios = require('axios').default;
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)
const fs = require('fs');
const Podcast = require("podcast");

exports.onPostBuild = async ({ graphql }) => {
    // generate podcast xml feed
    const feed = new Podcast({
        title: "Hello Mars",
        description: "A technology podcast hosted by two Computer Science students.",
        feedUrl: "https://hellomars.show/podcast.xml",
        siteUrl: "https://hellomars.show",
        imageUrl: "https://hellomars.show/image.jpg",
        author: "Simon and Alastair",
        language: "en-UK",
        categories: ["Technology"],
        itunesAuthor: "Simon and Alastair",
        itunesSubtitle: "A technology podcast hosted by two Computer Science students.",
        itunesSummary: "Two computer science students tries to explore the ever evolving technology field. There's always something new to talk about.",
        itunesOwner: {
            name: "Simon and Alastair",
            email: "yo@hellomars.show"
        },
        itunesExplicit: false,
        itunesCategory: [
            {
                text: "Technology"
            }
        ],
        itunesImage: "https://hellomars.show/image.jpg",
        itunesType: "episodic"
    });

    // fetch episodes
    const episodesQuery = await graphql(`
    query AllPodcastEpisodes {
        episodes: allPodcastEpisode(sort: {fields: episode_number, order: DESC}) {
          nodes {
            id
            title
            sourceId
            episode_number
            excerpt
            audioUrl
            duration
            date_created
          }
        }
      }
    `)

    const episodes = episodesQuery.data.episodes.nodes

    episodes.forEach(episode => {
        feed.addItem({
            title: `Episode ${episode.episode_number}: ${episode.title}`,
            description: episode.description,
            url: `https://hellomars.show/episode/${episode.episode_number}`,
            guid: episode.id,
            date: episode.date_created,
            enclosure: {
                url: episode.audioUrl,
                type: "audio/mpeg"
            },
            itunesSeason: 1,
            itunesEpisode: episode.episode_number
        })
    })

    const xml = feed.buildXml()
    console.log(xml)

    fs.writeFile('public/podcast.xml', xml, function (err) {
        if (err) throw err;
        // console.log('Saved!');

    });
}

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
    const { createNode } = actions

    // Host <-> episode relationship
    const episodeHostsResponse = await axios.get("https://api.hellomars.show/items/podcast_episode_host")
    const episodeHostsData = episodeHostsResponse.data.data

    // Files metadata
    const filesResponse = await axios.get("https://api.hellomars.show/files")
    const filesData = filesResponse.data.data

    // Register podcast hosts
    const hostsResponse = await axios.get("https://api.hellomars.show/items/podcast_host")
    const hostsData = hostsResponse.data.data

    hostsData.forEach(host => {
        host.episodes = episodeHostsData.filter(rel => {
            return rel.podcast_host_id == host.id
        }).map(rel => {
            return {id: rel.podcast_episode_id}
        })

        host.sourceId = host.id

        createNode({
            ...host,
            id: createNodeId(`PodcastHost-${host.id}`),
            parent: null,
            children: [],
            internal: {
                type: "PodcastHost",
                content: JSON.stringify(host),
                contentDigest: createContentDigest(host)
            }
        })
    })

    // Register podcast episodes
    const episodesResponse = await axios.get("https://api.hellomars.show/items/podcast_episode")
    const episodesData = episodesResponse.data.data

    episodesData.forEach(episode => {
        episode.hosts = episodeHostsData.filter(rel => {
            return rel.podcast_episode_id == episode.id
        }).map(rel => {
            return {id:rel.podcast_host_id}
        })

        episode.sourceId = episode.id
        episode.audioUrl = `https://api.hellomars.show/assets/${episode.audio}`

        // Fetch duration
        episode.duration = filesData.find(file => file.id === episode.audio).duration

        createNode({
            ...episode,
            id: createNodeId(`PodcastEpisode-${episode.id}`),
            parent: null,
            children: [],
            internal: {
                type: "PodcastEpisode",
                content: JSON.stringify(episode),
                contentDigest: createContentDigest(episode)
            }
        })
    })



    return
}

exports.onCreateNode = async ({
    node, // the node that was just created
    actions: { createNode },
    createNodeId,
    getCache,
}) => {
    if (node.internal.type === "PodcastHost") {
        const fileNode = await createRemoteFileNode({
            // the url of the remote image to generate a node for
            url: `https://api.hellomars.show/assets/${node.avatar}`,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            getCache,
        })
        if (fileNode) {
            node.avatarImage = fileNode.id
        }
    }

    if (node.internal.type === "PodcastEpisode") {
        const fileNode = await createRemoteFileNode({
            // the url of the remote image to generate a node for
            url: `https://api.hellomars.show/assets/${node.thumbnail}`,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            getCache,
        })
        if (fileNode) {
            node.thumbnailImage = fileNode.id
        }
    }
}

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions
    createTypes(`
      type PodcastHost implements Node {
        id: ID!
        first_name: String!
        last_name: String!
        avatar: String!
        sourceId: Int!
        # create relationships between Post and File nodes for optimized images
        avatarImage: File @link
        # create relationships between Post and Author nodes
        episodes: PodcastEpisode @link(from: "episodes.id" by: "sourceId")
      }
      type PodcastEpisode implements Node {
        id: ID!
        title: String!
        sourceId: Int!
        thumbnailImage: File @link
        audio: String!
        hosts: PodcastHost @link(from: "hosts.id" by: "sourceId")
      }`)
}