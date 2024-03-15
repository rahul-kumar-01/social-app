import react from 'react';
import { useState,useEffect } from 'react';
import {useSelector} from 'react-redux';
import {proxy} from '../../utils/proxy.js';


export default function Dashboard() {
  const [feeds, setFeeds] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await fetch(`${proxy}/api/user/get-feed/${currentUser._id.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await response.json();
        setFeeds(data.data);
      } catch (error) {
        console.error('Error fetching feeds:', error);
      }
    };
    fetchFeeds();
  }
  , []);


  return (
    <>

      <div className="py-2">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, John Doe</p>
        <p className='pt-5 text-md font-semibold '>Recent Feeds: </p>
      </div>

      {
        feeds.map((feed) => {
          return (
            <div className="bg-white p-4 rounded-lg shadow-md my-4">
              <div className="flex items-center">
                <img src={feed.post.user.avatar} alt={feed.post.user.name} className="w-8 h-8 rounded-full mr-2" />
                <p className="text-sm font-medium">{feed.post.user.name}</p>
              </div>
              <p className='py-2 text-md' style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{feed.post.content}</p>
            </div>
          )
        })
      }
    </>
  )
}


