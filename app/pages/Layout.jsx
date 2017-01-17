import React from 'react';

import Navbar from '../containers/Navbar';

const Layout = ({ children, params, location }) => (
  <div>
    <Navbar
      params={params}
      location={location}
    />

    <div className="container">
      {children}
    </div>
  </div>
);

Layout.propTypes = {
  children: React.PropTypes.element
};

export default Layout;
