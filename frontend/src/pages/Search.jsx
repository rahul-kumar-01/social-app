import React, { useEffect } from 'react';
import { MagnifyingGlassIcon, PlusCircleIcon, UserPlusIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import {proxy} from '../../utils/proxy.js';

export default function Search() {
  const [query, setQuery] = React.useState('');
  const [users, setUsers] = React.useState([]);

  const [friends, setFriends] = React.useState([]);
  const [nonFriends, setNonFriends] = React.useState([]);

    const currentUser = useSelector((state) => state.user.currentUser);
    console.log(currentUser);

  const searchUsers = async () => {
    console.log("query",query);
    try {
      const response = await fetch(`${proxy}/api/user/search-users/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
        setFriends(data.data.Freinds);
        setNonFriends(data.data.NonFriends);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    searchUsers();
  }, [query]);

  const handleAddFriend = async (id) => {
    try {
      const response = await fetch(`https://social-app-api-beta.vercel.app/api/user/follow-to?currentUserId=${currentUser._id.toString()}&followingUserId=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      searchUsers();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  }

  return (
    <>
      <div className="py-2">
        <h1 className="text-4xl font-bold">Search</h1>
        <p className="text-gray-500">Welcome back, John Doe</p>
      </div>

      <div className="max-w-md mx-auto mt-8 flex border rounded-lg items-center gap-2 border-indigo-500 px-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="w-full px-4 py-2 border border-transparent rounded-md focus:outline-none"
        />
        <MagnifyingGlassIcon
          className="w-6 h-6 top-3 right-3 black cursor-pointer"
          onClick={searchUsers}
        />
      </div>
      
      <div className="flex flex-col space-y-4 mt-8">
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex flex-col space-y-2">
          {Object.keys(friends).length>0  && friends.map((friend) => (
            <div key={friend._id} className="flex items-center justify-between bg-white shadow-md rounded-md p-4">
              <div className="flex items-center">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{friend.name}</h3>
                  <p className="text-gray-500">{friend.bio}</p>
                </div>
              </div>
              <CheckBadgeIcon
                className="w-6 h-6 text-green-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-8">
        <h2 className="text-2xl font-bold"></h2>
        <div className="flex flex-col space-y-2">
          {nonFriends && nonFriends.map((nonFriend) => (
            <div key={nonFriend._id} className="flex items-center justify-between bg-white shadow-md rounded-md p-4">
              <div className="flex items-center">
                <img
                  src={nonFriend.avatar}
                  alt={nonFriend.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">{nonFriend.name}</h3>
                  <p className="text-gray-500">{nonFriend.bio}</p>
                </div>
              </div>
              <UserPlusIcon
                className="w-6 h-6 text-blue-500 cursor-pointer"
                onClick={() => handleAddFriend(nonFriend._id)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}