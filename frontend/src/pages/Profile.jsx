import React , {useState} from 'react'
import {useSelector} from 'react-redux';import {proxy} from '../../utils/proxy.js';

export default function Profile() {
  const user = useSelector(state => state.user.currentUser);
  const {name , uuid} = user;
  const [formData, setFormData] = useState({
    uuid: user.uuid,
    name: user.name,
    password: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdate = () => {
  }

  return (
    <>
      <div className="py-2">
        <h1 className="text-4xl font-bold">Profile</h1>
        <p className="text-gray-500">Welcome back, John Doe</p>
      </div>

      <div className="max-w-md mx-auto mt-8">

        <div className="mb-4">
          <label htmlFor="uuid" className="block text-gray-700 font-semibold">UUID:</label>
          <input
            type="text"
            id="uuid"
            name="uuid"
            value={formData.uuid}
            onChange={handleInputChange}
            placeholder="Enter UUID..."
            className="mt-1 px-4 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter name..."
            className="mt-1 px-4 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter password..."
          className="mt-1 px-4 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          Update
        </button>
      </div>

    </div>
        
    </>

  )
}
