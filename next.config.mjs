// next.config.mjs
import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.jsx",
  standalone: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // other Next.js configurations can go here
};

export default withNextra(nextConfig);
