import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'; 

const LoginStreak = ({user}) =>
{

    return(
<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Login Streak</h3>
            <p className="text-3xl font-bold text-purple-600">{user.login_streak} days</p>
            <p className="text-gray-500 mt-2">Total days logged in consecutively</p>
            <ul className="mt-4 space-y-2">
            {Array.from({ length: user.login_streak }).map((_, index) => (
          <li key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Day {index + 1}: Logged in</span>
            <span className="text-gray-500">{'>'}</span>
          </li>
        ))}
            </ul>
          </div>
    )
}

export default LoginStreak;