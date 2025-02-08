import React from 'react'

const Loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-28 w-28 border-t-4
        border-rose-600 border-solid'></div>
    </div>
  );
};

export default Loading;
