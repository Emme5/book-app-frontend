const getBaseUrl = () => {
    console.log('ENV:', import.meta.env.MODE);
    console.log('SERVER_URL:', import.meta.env.VITE_SERVER_URL);
    
    // ถ้าเป็น development mode ใช้ localhost
    if (import.meta.env.MODE === 'development') {
        return 'http://localhost:5000';
    }
    
    // ถ้าเป็น production mode ใช้ URL จาก env
    if (import.meta.env.VITE_SERVER_URL) {
        return import.meta.env.VITE_SERVER_URL;
    }

    return 'https://book-app-backend-alpha.vercel.app'; // fallback
};

export default getBaseUrl;