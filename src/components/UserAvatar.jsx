import React from 'react';

const getColorFromEmail = (email) => {
    const colors = [
        'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
        'bg-lime-500', 'bg-green-600', 'bg-emerald-600'
    ];
    const index = email.length % colors.length;
    return colors[index];
};

const UserAvatar = ({ email, size = "normal", selectedIcon, onIconSelect }) => {
    const initial = email ? email[0].toUpperCase() : 'U';
    const bgColor = getColorFromEmail(email);
    
    const sizeClasses = {
        small: "w-9 h-9 text-lg",
        normal: "w-16 h-16 text-2xl"
    };

    if (selectedIcon) {
        return (
            <div className={`${sizeClasses[size]} rounded-full ring-4 ring-lime-500 hover:ring-green-600 transition-all bg-white flex items-center justify-center`}>
                {selectedIcon}
            </div>
        );
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full ring-4 ring-lime-500 hover:ring-green-600 transition-all ${bgColor} text-white flex items-center justify-center font-bold cursor-pointer relative group`}>
            {initial}
        </div>
    );
};

export default UserAvatar;