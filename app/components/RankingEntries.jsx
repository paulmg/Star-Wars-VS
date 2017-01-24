import React from 'react';
import { propType } from 'graphql-anywhere';
import _ from 'lodash';

import RankingEntry from './RankingEntry';

const RankingEntries = ({ entries = [], onLoadMore }) => {
  if(entries && entries.length) {
    return (
      <div> {
        entries.map(entry => (
          entry ? <RankingEntry
              key={_.uniqueId()}
              entry={entry}
            /> : null
        ))
      }

        <button onClick={onLoadMore}>Load more</button>
      </div>
    );
  }
  return <div />;
};

RankingEntries.propTypes = {
  entries: React.PropTypes.arrayOf(propType(RankingEntry.fragments.entry).isRequired),
  onLoadMore: React.PropTypes.func.isRequired,
};

export default RankingEntries;
