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
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  const [error, setError] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const fetchUserPosts = async () => {
    setLoadingPost(true);
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
    setLoadingPost(false);
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if(text.length < 10 || text.length > 200) {
      setError('Post must be between 10 to 200 characters');
      setTimeout(() => {
        setError(null);
        setLoading(false);
      },2000);
      return;
    }
    
    const response = await fetch(`${proxy}/api/post/create-post/${user._id.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text }),
      credentials: 'include'
    });
    const data = await response.json();

    if(data.success == 'true' || data.success == true) {
      posts.unshift({content: text, _id : data.post._id},);
      setPosts(posts);
      setLoading(false);
    }
    setText('');
  };


  const handleDeletePost = async (id,index) => {
    setLoadingDelete(true);
    setDeleteIndex(index);
    try {
      const response = await fetch(`${proxy}/api/post/delete-post/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      if(data.success == 'true' || data.success == true) {
        posts.splice(index,1);
        setPosts([...posts]);
        setDeleteIndex(-1);
        setLoadingDelete(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }

  return (
    <>
    <div className="py-2">
        <h1 className="text-2xl font-bold sm:text-4xl">Create Post</h1>
        <p className="text-gray-500">Welcome back, {user.name}</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-lg mt-8">
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
        <button type="submit" className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 ${loading ? 'cursor-not-allowed opacity-45' : 'null'}`}>
          {
            loading  ? 'Loading...' : 'Submit'
          }
        </button>
        {
          error && <p className='text-red-500 text-sm mt-2'>{error}</p>
        }
      </div>
    </form>

    <div className="py-2">
        <h1 className="text-xl font-bold sm:text-2xl">Recent Post</h1>
      </div>

    {loadingPost && <p className='p-3 text-[rgb(131,119,248)] text-lg'>Loading...</p>}

    <div className="max-w-lg mt-8">
      {posts && posts.map((post,index) => (
        <div key={post._id} className="bg-white shadow-md rounded-md p-4 mb-4 flex items-center justify-between">
          <p>{post.content}</p>
          {
            loadingDelete  && deleteIndex == index ? 'Loading...' : 
            (
              
              <div className='ml-[5px]'>
                  <TrashIcon className={`w-6 h-6 text-red-500  ${loadingDelete ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={loadingDelete ? null : () => handleDeletePost(post._id.toString(), index)}/>
              </div>
              
            )
          }
        </div>
      ))}
    </div>
    
    </>
  );
};

export default FormComponent;
