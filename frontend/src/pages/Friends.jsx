import React, { useEffect } from 'react'
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';import {proxy} from '../../utils/proxy.js';



export default function Friends() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [followers, setFollowers] = React.useState([]);
  const [following, setFollowing] = React.useState([]);
  const [showFollowing, setShowFollowing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleFollowers = async () => {
    setLoading(true);
    try{
      const response = await fetch(`${proxy}/api/user/get-followers/${currentUser._id.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      setFollowers(data.data);
      setShowFollowing(false);
      setLoading(false);
    }
    catch (error) {
      console.error('Error getting followers:', error);
    }
  }

  const handleFollowing = async () => {
    setLoading(true);
    try{
      const response = await fetch(`${proxy}/api/user/get-following-users/${currentUser._id.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      setFollowing(data.data);
      setShowFollowing(true);
      setLoading(false);
    }
    catch (error) {
      console.error('Error getting following:', error);
    }
  }

  useEffect(() => {
    handleFollowers();
  },[]);



  return (
    <>
      <div className="py-2">
        <h1 className="text-4xl font-bold">Friends</h1>
        <p className="text-gray-500">Welcome back, {currentUser.name}</p>
      </div>
      <div className="flex  space-x-4 py-4">
        <button
          className={` ${
            showFollowing
              ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
              : 'bg-[rgb(131,119,248)] hover:bg-[rgb(120,106,248)] text-white'
          }  py-2 px-4 rounded ${loading ? 'cursor-not-allowed' : '' }`}
          onClick={handleFollowers}
          disabled={loading} 
        >
          Followers
        </button>

        <button
          className={` ${
            !showFollowing
              ? 'bg-gray-300 hover:bg-gray-400 text-gray-800'
              : 'bg-[rgb(131,119,248)] hover:bg-[rgb(120,106,248)] text-white'
          }  py-2 px-4 rounded ${loading ? 'cursor-not-allowed' : '' }`}
          onClick={handleFollowing}
          disabled={loading} 
        >
          Following
        </button>
      </div>


      {loading ? (
          <> 
            <p className='p-3 text-lg'>Loading...</p>
          </>
      ): (
          <>
             {showFollowing ? 
                (
                  <>
                      {following && following.map((follow) => (
                        <div
                          key={follow._id}
                          className="bg-white shadow-md rounded-md p-4 mb-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              src={follow.avatar}
                              alt={follow.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="ml-4">
                              <h2 className="text-xl font-bold">{follow.name}</h2>
                              <p className="text-gray-500">{follow.bio}</p>
                            </div>
                          </div>
                          {/* <PlusCircleIcon
                            className="w-6 h-6 text-blue-500 cursor-pointer"
                            onClick={() => handleAddFriend(follow._id)}
                          /> */}
                        </div>
                      ))}
                  </>
                ):
                (
                  <>
                      {followers && followers.map((follower) => (
                        <div
                          key={follower._id}
                          className="bg-white shadow-md rounded-md p-4 mb-4 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              src={follower.avatar}
                              alt={follower.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div className="ml-4">
                              <h2 className="text-xl font-bold">{follower.name}</h2>
                              <p className="text-gray-500">{follower.bio}</p>
                            </div>
                          </div>
                          {/* <PlusCircleIcon
                            className="w-6 h-6 text-blue-500 cursor-pointer"
                            onClick={() => handleAddFriend(follower._id)}
                          /> */}
                        </div>
                      ))}
                  </>
                )
              }
          </>
      )}

     
        

            

    </>
  )
}
