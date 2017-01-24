import React from 'react';

import Page from './Page';
import VoteFilmEntries from '../containers/VoteFilmEntries';
import Rankings from '../containers/Ranking';

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
        <Rankings {...this.props} order={"winsDaily_DESC"} />
        <Rankings {...this.props} order={"winsWeekly_DESC"} />
        <Rankings {...this.props} order={"wins_DESC"} />
      </Page>
    );
  }
}

export default FilmsPage;
