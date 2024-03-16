import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  AdjustmentsHorizontalIcon,
  PowerIcon,
  BellAlertIcon,
  MagnifyingGlassIcon,
  UserCircleIcon

} from '@heroicons/react/24/outline';

import {proxy} from '../../utils/proxy.js';
import { useSelector , useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link, Outlet } from 'react-router-dom';
import { removeCurrentuser } from '../redux/reducer/userReducer';

import clsx from 'clsx';
import logo from '../../utils/logo.svg';


// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard/home', icon: HomeIcon },
  {
    name: 'Create Post',
    href: '/dashboard/create-post',
    icon: DocumentDuplicateIcon,
  },
  {name: 'Search', href: '/dashboard/search', icon: MagnifyingGlassIcon },
  {name: 'Friends', href: '/dashboard/friends', icon: UserGroupIcon },
  {name: 'Notification', href: '/dashboard/notification' , icon : BellAlertIcon},
  {name: 'Profile' , href: '/dashboard/profile' , icon : UserCircleIcon},
  
];

const pathname = '/dashboard';

export default function NavLinks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try{
      const response = await fetch(`${proxy}/api/user/destroy-session`,
      {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if(data.success == 'true'){
        dispatch(removeCurrentuser());
        navigate('/');
      }
    }catch(err){
    }
  }


 
  return (
    <>
      <div className=" flex p-3 flex-col sm:flex-row relative">
        <div className="w-[100vw]  sm:w-[20vw] sm:h-[100vh] p-2  fixed z-10 top-0 left-0 bg-white">

          <div className='flex items-center gap-6 py-5 flex-wrap '>
            <img src = {logo} className='h-[50px]'/>
            <p className='text-2xl'>Vuexy</p>
          </div>
          <div className='flex  sm:flex-col gap-2'>

              {links.map((link,index) => {
                  const LinkIcon = link.icon;
                  return (
                    <Link to={link.href} key={index}>
                  <span
                      key={link.name}
                      href={link.href}
                      className={clsx(
                      'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
                      {
                          'bg-sky-100 text-blue-600': pathname === link.href,
                      },
                      )}
                  >
                      <LinkIcon className="w-6" />
                      <p className="hidden md:block">{link.name}</p>
                  </span>
                  </Link>
                  );
              })}
              <button 
              onClick={handleSignOut}
              className="flex h-[48px]    items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                  <PowerIcon className="w-6" />
                  <div className="hidden md:block">Sign Out</div>
              </button>

          </div>


        </div>

      <div className="w-[100vw] sm:w-[78vw] p-2 absolute right-0 top-40 sm:top-0 z-0">
        <Outlet />
      </div>
      </div>
    </>
  );
}