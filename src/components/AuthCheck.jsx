import {useState, useEffect} from 'react';
import {useAuth} from '../context/user.context.js';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner.jsx';

function AuthCheck({children, authentication=true}) {
    const [loader, setLoader] = useState(true)
    const navigate = useNavigate();
    const {user: {isAuth: userStatus}} = useAuth();

    useEffect(()=> {
      if(authentication && !userStatus) navigate('/login', {replace: true})
      else if(!authentication && userStatus) navigate('/dashboard', {replace: true})
      setLoader(false);
    }, [])

  return (
    loader ? <div style={{width: "100vw", height: "100vh"}}><Spinner/></div> : <>{children}</>
  )
}

export default AuthCheck