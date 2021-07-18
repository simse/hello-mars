module.exports = {
  siteMetadata: {
    siteUrl: "https://hellomars.show",
    title: "Hello Mars",
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-ackee-tracker',
      options: {
        // Domatin ID found when adding a domain in the admin panel.
        domainId: 'e02693e6-8480-410d-b8aa-f290ffca7e13',
        // URL to Server eg: "https://analytics.test.com".
        server: 'https://analytics.sorensen.cloud',
        // Disabled analytic tracking when running localy
        ignoreLocalhost: true,
        // Enable or disable the tracking of your own visits (as identified by your login to the Ackee dashboard).
        ignoreOwnVisits: true,
        // If enabled it will collect info on OS, BrowserInfo, Device  & ScreenSize
        detailed: false,
      },
    },
    `gatsby-plugin-gatsby-cloud`,
    "gatsby-plugin-sass",
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images/`,
      },
    },
    {
      resolve: `gatsby-plugin-react-redux`,
      options: {
        // [required] - path to your createStore module
        pathToCreateStoreModule: './src/state/createStore',
        // [optional] - options passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        // will be merged with these defaults:
        serialize: {
          space: 0,
          // if `isJSON` is set to `false`, `eval` is used to deserialize redux state,
          // otherwise `JSON.parse` is used
          isJSON: true,
          unsafe: false,
          ignoreFunction: true,
        },
        // [optional] - if true will clean up after itself on the client, default:
        cleanupOnClient: true,
        // [optional] - name of key on `window` where serialized state will be stored, default:
        windowKey: '__PRELOADED_STATE__',
      },
    },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
  ],
};
