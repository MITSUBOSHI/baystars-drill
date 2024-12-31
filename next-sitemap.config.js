
module.exports = {
  siteUrl: 'https://mitsuboshi.github.io/baystars-drill',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  autoLastmod: false,
  generateIndexSitemap: false,
  outDir: './public', // routingの問題回避のためout dirではなくpublic dirに出力する
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      }
    ]
  }
};
