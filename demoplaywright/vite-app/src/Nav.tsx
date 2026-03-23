
import React, { useEffect, useState } from 'react';

const Navbar: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const authStr = localStorage.getItem('isAuthenticated');
        const auth = authStr ? JSON.parse(authStr)?.value || false : false;
        setIsAuthenticated(auth);
    }, []);

    const handleLoginClick = () => {
        if (isAuthenticated) {
            // Logout
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            window.location.href = '/';
        } else {
            // Redirect to login page
            window.location.href = '/login';
        }
    };

    return (
        <nav className="navbar px-4"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
            }}>
            {isAuthenticated && (<a className="navbar-brand" id="personlink" href="/persons"> Persons</a>)}
            {isAuthenticated && (<a className="navbar-brand" id="petslink" href="/pets">Pets</a>)}
            <a
                className="navbar-brand"
                id="login"
                onClick={handleLoginClick}
                style={{ cursor: 'pointer' }}
            >
                {isAuthenticated ? 'Logout' : 'Login'}
            </a>
        </nav>
    );
};

export default Navbar;
