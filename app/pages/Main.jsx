import React from 'react';

import Page from './Page';

class MainPage extends React.Component {
  static getMetaData() {
    return {
      title: 'Star Wars VS - Main Page',
      meta: [
        { name: 'description', content: 'The main page for Star Wars VS' }
      ],
      link: []
    };
  }

  render() {
    return (
      <Page {...MainPage.getMetaData()}>

      </Page>
    );
  }
}

export default MainPage;
