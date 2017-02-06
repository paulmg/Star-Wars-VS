import React from 'react';

import Page from './Page';
import VotePersonEntries from '../containers/VotePersonEntries';
import Rankings from '../containers/Ranking';


class PersonsPage extends React.Component {
  static getMetaData() {
    return {
      title: 'Star Wars VS - Persons Page',
      meta: [
        { name: 'description', content: 'The persons versus page for Star Wars VS' }
      ],
      link: []
    };
  }

  render() {
    return (
      <Page {...PersonsPage.getMetaData()}>
        <VotePersonEntries {...this.props} />
        <Rankings {...this.props} order={"winsDaily_DESC"} />
        <Rankings {...this.props} order={"winsWeekly_DESC"} />
        <Rankings {...this.props} order={"wins_DESC"} />
      </Page>
    );
  }
}

export default PersonsPage;
