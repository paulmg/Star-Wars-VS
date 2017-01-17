import React from 'react';
import Helmet from 'react-helmet';

const Page = ({ title, link, meta, children }) => {
  return (
    <div>
      <Helmet title={title} link={link} meta={meta} />
      { children }
    </div>
  );
};

Page.propTypes = {
  title: React.PropTypes.string.isRequired,
  link: React.PropTypes.arrayOf(React.PropTypes.shape({
    href: React.PropTypes.string.isRequired,
    rel: React.PropTypes.string,
    sizes: React.PropTypes.string
  })),
  meta: React.PropTypes.arrayOf(React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    content: React.PropTypes.string.isRequired
  }))
};

export default Page;
