import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const PublicRoutes = () => {
 const token = localStorage.getItem("adminToken");
 const navigate = useNavigate();
 const {pathname} = useLocation();
 if(!token  && pathname==="/admin/login"){
    return <Outlet/>
 }else{
    return navigate("/admin");
 }
}

export default PublicRoutes