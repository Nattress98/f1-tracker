/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/f1-tracker",
    output: "export",  // <=== enables static exports
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
