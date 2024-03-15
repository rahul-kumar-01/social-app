import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function NotFound() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);
    const user = useSelector((state) => state.user.currentUser);

    useEffect(() => {
        if(user._id === undefined) navigate('/');
    },[]);

    useEffect(() => {
        if(user._id !== undefined){

            const timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
    
            setTimeout(() => {
                navigate('/dashboard/home');
            }, 3000);
    
            return () => {
                clearInterval(timer);
            };
        }

    }, []);



    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <p>Redirecing In : {countdown} </p>
        </div>
    );
}
