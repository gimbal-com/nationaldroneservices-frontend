import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_MAPBOX_TOKEN: 'pk.eyJ1IjoidHJldjkxNSIsImEiOiJjbTZrMDFqcGgwM2x5Mm1uOXI5ZGRhZDc5In0.nNDZwLeLluTeaACdTKhBSQ',
    NEXT_PUBLIC_API_URL: 'http://localhost:8000'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
