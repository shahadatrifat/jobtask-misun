import Navbar from '../components/layouts/Navbar';
import React from 'react';
import { Outlet } from 'react-router';

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default RootLayout;