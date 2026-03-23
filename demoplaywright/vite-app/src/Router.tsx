import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import App from './App';
import Login from './login';
import { StorageWithExpiry } from './help/StorageWithExpiry';
import Persons from './Persons/page';
import Pets from './Pets/page';
import Navbar from './Nav';

const PrivateRoute = () => {
  const isAuthenticated = StorageWithExpiry.get<boolean>("isAuthenticated") ?? false;
  return isAuthenticated ?
    <Outlet /> : <Navigate to="/login" replace />;
};

const Router = () => {

  return (

    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<div> <Navbar /><PrivateRoute /></div>}>
        <Route path="/" element={<App />} />
        <Route path="/Persons" element={<Persons />} />
        <Route path="/Pets" element={<Pets />} />
      </Route>
    </Routes>
  );
};

export default Router;
