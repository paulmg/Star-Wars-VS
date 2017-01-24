import React from 'react';
import { propType } from 'graphql-anywhere';

import VoteEntry from './VoteEntry';

const Entries = ({ leftEntry, rightEntry, onVote, canVote }) => {
  if(leftEntry && rightEntry) {
    return (
      <div>
        <VoteEntry key={leftEntry.title} entry={leftEntry} onVote={onVote} canVote={canVote} alignment="left" />
        <VoteEntry key={rightEntry.title} entry={rightEntry} onVote={onVote} canVote={canVote} alignment="right" />
      </div>
    );
  }

  return <div />;
};

Entries.propTypes = {
  leftEntry: propType(VoteEntry.fragments.entry).isRequired,
  rightEntry: propType(VoteEntry.fragments.entry).isRequired,
  onVote: React.PropTypes.func.isRequired,
  canVote: React.PropTypes.bool.isRequired
};

export default Entries;
