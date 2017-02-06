import React from 'react';
import { propType } from 'graphql-anywhere';

import FilmEntry from '../graphql/fragments/FilmFragments.graphql';

const VoteEntry = ({ onVote, entry, alignment, canVote }) => {
  function submitVote() {
    onVote({ id: entry.id });
  }

  return (
    <div className={alignment}>
      <input type="image" src={entry.imageURL} onClick={() => canVote && submitVote()} />
    </div>
  );
};

VoteEntry.fragments = {
  entry: FilmEntry
};

VoteEntry.propTypes = {
  onVote: React.PropTypes.func.isRequired,
  entry: propType(VoteEntry.fragments.entry).isRequired,
  alignment: React.PropTypes.string.isRequired,
  canVote: React.PropTypes.bool.isRequired
};

export default VoteEntry;
