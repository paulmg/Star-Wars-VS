import React from 'react';

import Page from './Page';
import VoteFilmEntries from '../containers/VoteFilmEntries';

class FilmsPage extends React.Component {
  static getMetaData() {
    return {
      title: 'Star Wars VS - Films Page',
      meta: [
        { name: 'description', content: 'The films versus page for Star Wars VS' }
      ],
      link: []
    };
  }

  render() {
    return (
      <Page {...FilmsPage.getMetaData()}>
        <VoteFilmEntries {...this.props} />
      </Page>
    );
  }
}

export default FilmsPage;
