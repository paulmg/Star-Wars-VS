import React from 'react';
import { Link } from 'react-router';

const NavbarLink = ({ title, href, active = false }) => (
  <li className={active && 'active'}>
    <Link to={href}>
      {title}
    </Link>
  </li>
);

NavbarLink.propTypes = {
  title: React.PropTypes.string,
  href: React.PropTypes.string,
  active: React.PropTypes.bool
};

export default NavbarLink;
