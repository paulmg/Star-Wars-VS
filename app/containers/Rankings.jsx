import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../components/Loading';
import RankingEntries from '../components/RankingsEntries';

class Rankings extends React.Component {
  constructor() {
    super();

    this.offset = 0;
  }

  render() {
    const { loading, feed, fetchMore } = this.props;

    return (
      <div>
        <RankingEntries
          entries={feed || []}
          onLoadMore={fetchMore}
        />

        {loading ? <Loading /> : null}
      </div>
    );
  }
}

Rankings.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  feed: RankingEntries.propTypes.entries,
  fetchMore: React.PropTypes.func
};

const FEED_QUERY = gql`
  query Feed($type: FeedType!, $offset: Int, $limit: Int) {
    feed(type: $type, offset: $offset, limit: $limit) {
      ...FeedEntry
    }
  }
  ${FeedEntry.fragments.entry}
`;

const ITEMS_PER_PAGE = 10;
const withData = graphql(FEED_QUERY, {
  options: props => ({
    variables: {
      type: (
        props.params &&
        props.params.type &&
        props.params.type.toUpperCase()
      ) || 'ALL',
      offset: 0,
      limit: ITEMS_PER_PAGE
    },
    forceFetch: true
  }),
  props: ({ data: { loading, feed, fetchMore } }) => ({
    loading,
    feed,
    fetchMore: () => fetchMore({
      variables: {
        offset: feed.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if(!fetchMoreResult.data) {
          return prev;
        }
        return Object.assign({}, prev, {
          feed: [...prev.feed, ...fetchMoreResult.data.feed]
        });
      }
    })
  })
});

export default withData(Rankings);
