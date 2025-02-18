const getBaseUrl = () => {
    // ใช้ VITE_SERVER_URL จาก .env เป็นอันดับแรก
    if (import.meta.env.VITE_SERVER_URL) {
        return import.meta.env.VITE_SERVER_URL;
    }

    // ถ้าไม่มี VITE_SERVER_URL ให้ใช้ตามโหมดการทำงาน
    if (import.meta.env.MODE === 'production') {
        return 'https://book-app-backend-alpha.vercel.app';
    }

    // fallback สำหรับ development
    return 'http://localhost:5000';
};

export default getBaseUrl;