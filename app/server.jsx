import path from 'path';
import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { match, RouterContext } from 'react-router';
import 'isomorphic-fetch';

import routes from './routes';
import Html from './pages/Html';
import config from './config';

const basePort = config.port;
const apiUrl = config.apiUrl;

const app = new Express();
app.use(Express.static(path.join(process.cwd(), 'static')));

app.use((req, res) => {
  match({ routes, location: req.originalUrl }, (error, redirect, props) => {
    if(redirect) {
      res.redirect(redirect.pathname + redirect.search);
    }
    else if(error) {
      console.error('ROUTER ERROR:', error); // eslint-disable-line no-console
      res.status(500).json(error);
    }
    else if(props) {
      const client = new ApolloClient({
        queryTransformer: addTypename,
        ssrMode: true,
        networkInterface: createNetworkInterface({
          uri: apiUrl,

        }),
        dataIdFromObject: (result) => {
          if(result.id && result.__typename) { // eslint-disable-line no-underscore-dangle
            return result.__typename + result.id; // eslint-disable-line no-underscore-dangle
          }
          return null;
        },
      });

      const component = (
        <ApolloProvider client={client}>
          <RouterContext {...props} />
        </ApolloProvider>
      );

      renderToStringWithData(component).then((content) => {
        const data = client.store.getState().apollo.data;
        // res.status(200);

        const html = (
          <Html
            content={content}
            state={{ apollo: { data } }}
          />
        );

        console.log(html.props.content)
        res.send(`<!DOCTYPE html>\n${ReactDOM.renderToStaticMarkup(html)}`);

        // const html = pageRenderer({ apollo: { data } }, content);
        // res.status(200).send(ReactDOM.renderToStaticMarkup(html));

        res.end();
      }).catch((err) => {
        console.error('RENDERING ERROR:', err);
        res.status(500).json(err);
      });
    }
    else {
      res.status(404).send('Not found');
    }
  });
});

app.listen(basePort, () => console.log( // eslint-disable-line no-console
  `App Server is now running on http://localhost:${basePort}`
));
