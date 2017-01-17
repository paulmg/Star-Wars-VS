import React from 'react';
import { Link } from 'react-router';

import NavbarLink from '../components/NavbarLink';

const Navbar = ({ params, location }) => (
  <nav className="navbar navbar-default">
    <div className="container">
      <div className="navbar-header">
        <Link className="navbar-brand" to="/">SW VS</Link>
      </div>

      <ul className="nav navbar-nav">
        <NavbarLink
          title="Films"
          href="/films"
          active={location.pathname === '/films' || params.type === 'films'}
        />

        <NavbarLink
          title="People"
          href="/people"
          active={location.pathname === '/people' || params.type === 'people'}
        />
      </ul>
    </div>
  </nav>
);

Navbar.propTypes = {
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired
  }).isRequired,
  params: React.PropTypes.shape({
    type: React.PropTypes.string
  }).isRequired
};

export default Navbar;
