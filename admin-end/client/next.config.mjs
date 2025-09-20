/** @type {import('next').NextConfig} */
const nextConfig = {

    mages: {
        // Simple allow-list
        domains: ['example.com', 'vueseoefnkrmahcrbivf.supabase.co'], // add any you use
        // OR use remotePatterns for finer control:
        remotePatterns: [
            { protocol: 'https', hostname: 'example.com', pathname: '/images/**' },
            { protocol: 'https', hostname: 'vueseoefnkrmahcrbivf.supabase.co', pathname: '/storage/v1/object/**' },
        ],
    },
};

export default nextConfig;
