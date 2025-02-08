import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import getBaseUrl from '../../utils/baseURL';
import Loading from '../../components/Loading';
import { MdIncompleteCircle } from 'react-icons/md'
import RevenueChart from './RevenueChart';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/admin`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  const stats = [
    {
      title: 'จำนวนหนังสือ',
      value: data?.totalBooks,
      icon: (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'indigo',
    },
    {
      title: 'ยอดขายรวม',
      value: `$${data?.totalSales}`,
      icon: (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'emerald',
    },
    {
      title: 'หนังสือที่กำลังได้รับความนิยมในเดือนนี้',
      value: data?.trendingBooks,
      percentage: '13%',
      icon: (
        <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      color: 'rose',
    },
    {
      title: 'ยอดสั่งซื้อรวม',
      value: data?.totalOrders,
      icon: <MdIncompleteCircle className="h-6 w-6" />,
      color: 'sky',
    },
  ];

  return (
<div className="space-y-6">
      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center p-8 bg-white shadow-lg rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div 
              className={`inline-flex flex-shrink-0 items-center justify-center h-16 w-16 
                text-${stat.color}-600 bg-${stat.color}-100 
                rounded-full mr-6 transform hover:scale-110 transition-transform duration-200`}
            >
              {stat.icon}
            </div>
            <div>
              <span className="block text-2xl font-bold text-gray-900">
                {stat.value}
                {stat.percentage && (
                  <span className="inline-block text-xl text-gray-500 font-semibold ml-2">
                    ({stat.percentage})
                  </span>
                )}
              </span>
              <span className="block text-gray-500">{stat.title}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-3 xl:grid-flow-col gap-6">
        <div className="flex flex-col md:col-span-2 md:row-span-2 bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="px-6 py-5 font-semibold border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg text-gray-800">จำนวนรายการสั่งซื้อต่อเดือน</h3>
          </div>
          <div className="p-4 flex-grow bg-white">
            <div className="h-full rounded-lg overflow-hidden">
              <RevenueChart />
            </div>
          </div>
        </div>
      </section>

      <section className="text-right font-semibold text-gray-500">
        <a href="#" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200">
          ออกแบบเว็บไซต์ร้านหนังสือด้วย
        </a>{' '}
        -{' '}
        <a 
          href="https://tailwindcss.com/" 
          className="text-teal-500 hover:text-teal-600 hover:underline transition-colors duration-200"
        >
          Tailwind CSS
        </a>{' '}
        เพื่อ{' '}
        <a 
          href="https://dribbble.com/shots/10711741-Free-UI-Kit-for-Figma-Online-Courses-Dashboard" 
          className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
        >
          ประสบการณ์การซื้อที่สะดวกและทันสมัย
        </a>
      </section>
    </div>
  );
};

export default Dashboard;
