import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Banner from './pages/home/Banner'
import { AuthProvider } from './context/AuthContext'
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
    <AuthProvider>
    <Navbar/>
    {isHomePage && <Banner/>} {/* แสดง Banner เฉพาะเมื่ออยู่ที่หน้า Home */}
        <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-4 font-primary'>
          <Outlet/>
        </main>
      <Footer/>
    </AuthProvider>
    </>
  )
}

export default App
