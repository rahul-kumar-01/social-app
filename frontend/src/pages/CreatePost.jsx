import react from 'react';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {proxy} from '../../utils/proxy.js';
import {
  TrashIcon
} from '@heroicons/react/24/outline';
const FormComponent = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [text, setText] = useState('');
  const [posts, setPosts] = useState([]);

  const fetchUserPosts = async () => {
    try {
      const getUserPost = await fetch(`${proxy}/api/post/get-post/${user._id.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await getUserPost.json();
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
    console.log(user);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${proxy}/api/post/create-post/${user._id.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text }),
      credentials: 'include'
    });
    const data = await response.json();
    console.log(data.success);

    if(data.success == 'true' || data.success == true) await fetchUserPosts();
    console.log('Submitted:', text);
    setText('');
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(`${proxy}/api/post/delete-post/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log(data.success);
      if(data.success == 'true' || data.success == true) await fetchUserPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  return (
    <>
    <div className="py-2">
        <h1 className="text-4xl font-bold">Create Post</h1>
        <p className="text-gray-500">Welcome back, John Doe</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label htmlFor="textArea" className="block text-gray-700">Enter text:</label>
        <textarea
          id="textArea"
          value={text}
          onChange={handleTextChange}
          rows={4}
          className="mt-1 px-3 py-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          placeholder="Type something..."
        />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700">
          Submit
        </button>
      </div>
    </form>

    <div className="py-2">
        <h1 className="text-2xl font-bold">Recent Post</h1>
      </div>

    <div className="max-w-md mx-auto mt-8">
      {posts && posts.map((post) => (
        <div key={post._id} className="bg-white shadow-md rounded-md p-4 mb-4 flex items-center justify-between">
          <p>{post.content}</p>
          <TrashIcon className="w-6 h-6 text-red-500 cursor-pointer" 
          onClick={() => handleDeletePost(post._id.toString())}
          />
        </div>
      ))}
    </div>
    
    </>
  );
};

export default FormComponent;