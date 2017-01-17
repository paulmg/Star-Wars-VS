import React from 'react';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { propType } from 'graphql-anywhere';

import Loading from '../components/Loading';
import Entries from '../components/Entries';
import VoteEntry from '../components/VoteEntry';
import FILMS_QUERY from '../graphql/FilmsQuery.graphql';
import VOTE_MUTATION from '../graphql/Vote.graphql';

import { getRandom } from '../utils/helpers';

class VoteFilmEntries extends React.Component {
  constructor() {
    super();

    // Get left and right entries from query props, setState will then re-render after voting
    this.state = {
      leftEntry: null,
      rightEntry: null,
      canVote: true
    };

    // Bind class context for this.props
    this.voteEvent = this.voteEvent.bind(this);
  }

  componentDidMount() {
    const { allFilms, leftIndex, rightIndex } = this.getNewEntries();

    setTimeout(() => {
      this.setState({ leftEntry: allFilms[leftIndex], rightEntry: allFilms[rightIndex] });
    }, 100);
  }

  componentWillReceiveProps() {
    console.log('will receive props');
  }

  getLeftRightIndexes(len) {
    const leftIndex = getRandom(len);
    let rightIndex = getRandom(len);

    while(rightIndex === leftIndex) {
      rightIndex = getRandom(len);
    }

    console.log(leftIndex, rightIndex)

    return { leftIndex, rightIndex };
  }

  getNewEntries() {
    const { allFilms } = this.props;
    const { leftIndex, rightIndex } = this.getLeftRightIndexes(allFilms.length);

    return { allFilms, leftIndex, rightIndex };
  }

  voteEvent({ id }) {
    const { vote } = this.props;
    const { leftEntry, rightEntry } = this.state;
    this.setState({ canVote: false });

    console.log('vote event');

    const winner = leftEntry.id === id ? leftEntry : rightEntry;
    const loser = leftEntry.id !== id ? leftEntry : rightEntry;

    return vote({ id: winner.id, wins: winner.wins + 1, losses: winner.losses }).then(() => {
      vote({ id: loser.id, wins: loser.wins, losses: loser.losses + 1}).then((res) => {
        const { allFilms, leftIndex, rightIndex } = this.getNewEntries();

        this.setState({ leftEntry: allFilms[leftIndex], rightEntry: allFilms[rightIndex], canVote: true });
        console.log('update', res);
      });
    });
  }

  render() {
    const { loading } = this.props;
    const { leftEntry, rightEntry, canVote } = this.state;

    return (
      <div>
        {(leftEntry && rightEntry) &&
        <Entries
          leftEntry={leftEntry || null}
          rightEntry={rightEntry || null}
          onVote={this.voteEvent}
          canVote={canVote || false}
        />
        }

        {loading ? <Loading /> : null}
      </div>
    );
  }
}

VoteFilmEntries.propTypes = {
  loading: React.PropTypes.bool.isRequired,
  allFilms: React.PropTypes.arrayOf(propType(VoteEntry.fragments.entry)).isRequired,
  vote: React.PropTypes.func.isRequired
};

const withData = graphql(FILMS_QUERY, {
  options: {
    variables: {
      first: 10
    },
    forceFetch: true
  },
  props: ({ data: { loading, allFilms } }) => ({
    loading,
    allFilms
  })
});

const withMutations = graphql(VOTE_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    vote: ({ id, wins, losses }) => mutate({
      variables: { id, wins, losses },
      // updateQueries: {
      //   allFilms: (prev, {mutationResult}) => {
      //     const updatedFilm = mutationResult.data.updateFilm;
      //     return update(prev, {
      //       allFilms: {
      //
      //       }
      //     })
      //   }
      // }
    })
  })
});

export default withMutations(withData(VoteFilmEntries));
