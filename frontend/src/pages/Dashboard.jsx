import react from 'react';
import { useState,useEffect } from 'react';
import {useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {proxy} from '../../utils/proxy.js';


export default function Dashboard() {
  const user = useSelector((state) => state.user.currentUser);
  const [feeds, setFeeds] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
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
      setLoading(false);
    };
    fetchFeeds();
  }
  , []);


  return (
    <>

      <div className="py-2">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user.name}</p>
        <p className='pt-5 text-md font-semibold '>
        {!loading ? (feeds.length === 0 ? <p>No Feeds ...</p> : <p>Recent Feeds: </p>) : null}


        </p>
      </div>
    <div className='max-w-xl'>
      {loading && <p className=' text-[rgb(131,119,248)] text-lg'>Loading...</p>}
      {feeds && feeds.length > 0 ? 
        (
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
        )
        :
        (
          <> 
          {
            !loading && <p className='text-[rgb(131,119,248)] cursor-pointer' onClick={()=>{navigate('/dashboard/search')}}>Add some friends</p>
          }
            
          </>
        )
      }
    </div>
    </>
  )
}


