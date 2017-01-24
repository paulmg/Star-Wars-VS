import React from 'react';
import { graphql } from 'react-apollo';

import Loading from '../components/Loading';
import RankingEntries from '../components/RankingEntries';
import FILM_RANKING_QUERY from '../graphql/queries/FilmRankingQuery.graphql';

class Ranking extends React.Component {
  constructor() {
    super();
  }

  render() {
    const { loading, allFilms, fetchMore } = this.props;

    return (
      <div>
        <RankingEntries
          entries={allFilms || []}
          onLoadMore={fetchMore}
        />

        {loading ? <Loading /> : null}
      </div>
    );
  }
}

Ranking.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  allFilms: RankingEntries.propTypes.entries,
  fetchMore: React.PropTypes.func
};

const withData = graphql(FILM_RANKING_QUERY, {
  options: props => ({
    variables: {
      first: 5,
      skip: 0,
      order: props.order || 'wins_DESC'
    },
    forceFetch: true
  }),
  props: ({ data: { loading, allFilms, fetchMore } }) => ({
    loading,
    allFilms,
    fetchMore: () => fetchMore({
      variables: {
        skip: allFilms.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        console.log(allFilms.length, fetchMoreResult)
        if(!fetchMoreResult.data) {
          return prev;
        }
        return Object.assign({}, prev, {
          allFilms: [...prev.allFilms, ...fetchMoreResult.data.allFilms]
        });
      }
    })
  })
});

export default withData(Ranking);
