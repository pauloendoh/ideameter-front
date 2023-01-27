const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
module.exports = withBundleAnalyzer({
  images: {
    domains: ["localhost", "endoh.s3.amazonaws.com"],
    formats: ["image/avif", "image/webp"],
  },
})
