const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return 'https://book-app-backend-alpha.vercel.app';
    }
    return import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
};
export default getBaseUrl;