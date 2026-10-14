import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{js,ts,jsx,tsx,mdx}','./components/**/*.{js,ts,jsx,tsx,mdx}'], theme: { extend: { colors: { ink: '#172033', muted: '#667085', brand: '#635bff' }, boxShadow: { soft: '0 12px 40px rgba(25,35,70,.07)' } } }, plugins: [] };
export default config;