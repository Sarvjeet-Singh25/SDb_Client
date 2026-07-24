import React from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

const PrivateRoutes = () => {
    const token = localStorage.getItem("adminToken");
    const navigate = useNavigate();
    const {pathname} = useLocation();
    console.log(pathname)
    if(token){

        return <Outlet/>
    }

  return <Navigate to={"/admin/login"} replace/>;
  
}

export default PrivateRoutes