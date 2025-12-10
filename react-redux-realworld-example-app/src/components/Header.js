import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isLoggedIn = false; // Would come from Redux in real app
  
  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          conduit
        </Link>
        
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/editor" className="nav-link">
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link">
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <img src="" className="user-pic" alt="" />
                  Username
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
