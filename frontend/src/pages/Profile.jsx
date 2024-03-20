import React , {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux';import {proxy} from '../../utils/proxy.js';
import {setCurrentUser} from '../redux/reducer/userReducer.js';
export default function Profile() {
  const user = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const {name , uuid} = user;
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    console.log(formData);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try{
      if(formData.password){
        if ( (formData.password.length < 8 || formData.password.length > 20)) {
          setError('Password must be between 8 to 20 characters');
          setLoading(false);
          setTimeout(() => {
            setMessage(null);
            setError(null);
          },2000);
          return;
        }
      }

      const response = await fetch(`${proxy}/api/user/update-user/${user._id.toString()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({...formData}),
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data);
      if(data.success == 'true' || data.success == true){
        setMessage('User updated successfully');
        dispatch(setCurrentUser(data.data));
      }  
      else{
        setError(data.message);
      }
      setLoading(false);
      setTimeout(() => {
        setMessage(null);
        setError(null);
      },2000);
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <>
      <div className="py-2">
        <h1 className="text-2xl font-bold sm:text-4xl">Profile</h1>
        <p className="text-gray-500">Welcome back, {user.name}</p>
      </div>

      <div className="max-w-md  mt-8">

        <div className="mb-4">
          <label htmlFor="uuid" className="block text-gray-700 font-semibold">UUID:</label>
          <input
            type="text"
            id="uuid"
            name="uuid"
            value={formData.uuid}
            defaultValue={user.uuid}
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
            defaultValue={user.name}
            placeholder="Enter name..."
            className="mt-1 px-4 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold">Password:</label>
        <input
          type="text"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter password..."
          className="mt-1 px-4 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-semibold">Bio:</label>
        <input
          type="text"
          id="bio"
          name="bio"
          value={formData.bio}
          defaultValue={user.bio}
          onChange={handleInputChange}
          placeholder="Enter password..."
          className="mt-1 px-4 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div>
        <button onClick={handleUpdate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          {loading ? 'Loading...' : 'Update'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {message && <p className="text-green-500 mt-2">{message}</p>}

    </div>
        
    </>

  )
}
