import React from 'react';
import { propType } from 'graphql-anywhere';

import FILM_ENTRY from '../graphql/fragments/FilmFragments.graphql';

const RankingEntry = ({ entry }) => {
  return (
    <div className="">
      {entry.title}
    </div>
  );
};

RankingEntry.fragments = {
  entry: FILM_ENTRY
};

RankingEntry.propTypes = {
  entry: propType(RankingEntry.fragments.entry).isRequired
};

export default RankingEntry;
