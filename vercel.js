{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://profile-system-backend-production.up.railway.app/"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}