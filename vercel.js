module.exports = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        // This will pull from your Vercel Environment Variables
        destination: `${process.env.VITE_API_TARGET}/api/:path*`,
      },
      {
        source: "/(.*)",
        destination: "/index.html",
      },
    ];
  },
};