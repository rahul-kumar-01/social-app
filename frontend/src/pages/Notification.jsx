import React from 'react'
import {proxy} from '../../utils/proxy.js';
import { useSelector } from 'react-redux';
export default function Notification() {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <>


    <div className="py-2">
        <h1 className="text-2xl font-bold sm:text-4xl">Notification</h1>
        <p className="text-gray-500">Welcome back, {user.name}</p>
    </div>

    <div>
      <p>No new notification ... </p>
    </div>

    </>

  )
}
