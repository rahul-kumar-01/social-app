import React, { useEffect } from 'react'
import { MagnifyingGlassIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';import {proxy} from '../../utils/proxy.js';



export default function Friends() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [followers, setFollowers] = React.useState([]);
  const [following, setFollowing] = React.useState([]);
  const [showFollowing, setShowFollowing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

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

  const handleFollow = async (id) => {
    // setAddLoading(true);
    try {
      const response = await fetch(`${proxy}/api/user/follow-to?currentUserId=${currentUser._id.toString()}&followingUserId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if(data.success == false || data.success == 'false') {
        setError(data.message);
      }
      else{
        handleFollowers();
      }
      
    } catch (error) {
      setError(data.message);
      console.error('Error adding friend:', error);
    }
  }

  const handleUnfollow = async (id) => {
    // setAddLoading(true);
    try {
      const response = await fetch(`${proxy}/api/user/unfollow-to?currentUserId=${currentUser._id.toString()}&unfollowingUserId=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);

      // setAddLoading(false);
      handleFollowing();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  }


  return (
    <>
      <div className="py-2">
        <h1 className="text-2xl font-bold sm:text-4xl">Friends</h1>
        <p className="text-gray-500">Welcome back, {currentUser.name}</p>
      </div>
      <div className="flex  space-x-4 py-4 max-w-xl">
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

    <div className='max-w-2xl'>
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
                          <button
                            className={ `bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded ${loading ? 'cursor-not-allowed' : ''} ` }
                            onClick={()=>handleUnfollow(follow._id)
                            }
                          >Unfollow</button>
                        </div>
                      ))}
                  </>
                ):
                (
                  <>
                      {followers && followers.map((follower) => (
                        <div
                          key={follower._id}
                          className="bg-white shadow-md rounded-md p-1 sm:p-4 mb-4 flex items-center justify-between gap-2"
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


                          <div className='  flex flex-wrap gap-2'>
                              <button
                                  className={`bg-[rgb(131,119,248)] hover:bg-[rgb(120,106,248)] text-white min-w-[120px]
                                    py-2 px-4 rounded ${loading ? 'cursor-not-allowed' : '' }`}
                                  onClick={()=>handleFollow(follower._id)}
                                  disabled={loading} 
                                >
                                  Follow Back
                                </button>

                                <button
                                  className={ `bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded min-w-[120px] cursor-not-allowed`}
                                  onClick={()=>handleFollow(follower._id)}
                                  disabled={loading} 
                                >
                                  Remove
                                </button>
                          </div>


                        </div>
                        
                      ))}
                  </>
                )
              }
          </>
      )}

'
      <p className='text-red-600 '>{error}</p>
     
        

    </div>  

    </>
  )
}
