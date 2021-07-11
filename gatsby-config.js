module.exports = {
  siteMetadata: {
    siteUrl: "https://hellomars.show",
    title: "Hello Mars",
  },
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: '@directus/gatsby-source-directus',
      options: {
        url: `https://api.hellomars.show`,
        auth: {
          token: 'cce6cad570ee951b3e33faab306221a580d756b934978a8fb63a07bfdf398f68',
        },
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
