import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useSelector} from "react-redux";

const PrivateRoute = ({element}) => {
  const auth = useSelector(state => state.web3.account);
  return auth ? element : <Navigate to="/" />;
}

export default PrivateRoute;
