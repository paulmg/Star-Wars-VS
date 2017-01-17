import React from 'react';
import gql from 'graphql-tag';
import { propType } from 'graphql-anywhere';

const VoteEntry = ({ onVote, entry, alignment, canVote }) => {
  function submitVote() {
    onVote({ id: entry.id, wins: entry.wins + 1, losses: entry.losses });
  }

  return (
    <div className={alignment}>
      <input type="image" src={entry.imageURL} onClick={() => canVote && submitVote()} />
    </div>
  );
};

VoteEntry.fragments = {
  entry: gql`
    fragment VoteEntry on Film {
      id
      director
      episodeId
      imageURL
      losses
      producers
      releaseDate
      title
      wins
    }
  `,
};

VoteEntry.propTypes = {
  onVote: React.PropTypes.func.isRequired,
  entry: propType(VoteEntry.fragments.entry).isRequired,
  alignment: React.PropTypes.string.isRequired,
  canVote: React.PropTypes.bool.isRequired
};

export default VoteEntry;
