import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const AppHeader = (props) => {
  return (
    <header className="main-header">
      <Link to="/" className="logo">
        <span className="logo-lg"><b>Sync</b> Gateway</span>
        <span className="logo-mini"><b>S</b>G</span>
      </Link>
      <nav className="navbar navbar-static-top" role="navigation">
        <a href="#" className="sidebar-toggle" data-toggle="offcanvas" 
          role="button"></a>
        <div className="navbar-custom-menu">
          <ul className="nav navbar-nav">
            <li><a href="http://mobile.couchbase.com" target="_blank">
              Couchbase Mobile</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default AppHeader;