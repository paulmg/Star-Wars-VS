/* eslint-disable react/no-danger */
import React from 'react';

import config from '../config';

const basePort = config.port;
const scriptUrl = `http://localhost:${basePort + 20}/assets/app.js`;

const Html = ({ content, state }) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>SW VS</title>
    </head>

    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: content }} />

      <script
        dangerouslySetInnerHTML={{ __html: `window.__APOLLO_STATE__=${JSON.stringify(state)};` }}
        charSet="UTF-8"
      />
      <script src={scriptUrl} charSet="UTF-8" />
    </body>
  </html>
);

Html.propTypes = {
  content: React.PropTypes.string.isRequired,
  state: React.PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default Html;
