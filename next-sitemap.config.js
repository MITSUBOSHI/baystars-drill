
module.exports = {
  siteUrl: 'https://mitsuboshi.github.io/baystars-drill',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  autoLastmod: false,
  generateIndexSitemap: false,
  outDir: './out',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      }
    ]
  }
};
