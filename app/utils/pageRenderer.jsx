import Helmet from 'react-helmet';

import config from '../config';

const createTrackingScript = trackingID =>
`<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', ${trackingID}, 'auto');
    ga('send', 'pageview');
  </script>`;

const analyticsScript = createTrackingScript(config.trackingID);

const createScriptTags = () => {
  return `${analyticsScript}<script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>`;
};

const buildPage = ({ content, state, headAssets }) => {
  return `
    <!doctype html>
    <html>
      <head>
        ${headAssets.title.toString()}
        ${headAssets.meta.toString()}
        ${headAssets.link.toString()}
      </head>
      <body>
        <div id="app">${content}</div>
        
        <script>window.__APOLLO_STATE__ = ${JSON.stringify(state)}</script>
        ${createScriptTags()}
      </body>
    </html>
  `;
};

const pageRenderer = (content, state) => {
  const headAssets = Helmet.rewind();

  return buildPage({ content, state, headAssets, analyticsScript });
};

export default pageRenderer;
