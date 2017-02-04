import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { propType } from 'graphql-anywhere';

import Loading from '../components/Loading';
import Entries from '../components/Entries';
import VoteEntry from '../components/VoteEntry';

import FILMS_QUERY from '../graphql/queries/FilmQuery.graphql';
import VOTE_MUTATION from '../graphql/mutations/VoteMutation.graphql';

import { getLeftRightIndexes } from '../utils/helpers';

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

  getNewEntries() {
    const { allFilms } = this.props;
    const { leftIndex, rightIndex } = getLeftRightIndexes(allFilms.length);

    return { allFilms, leftIndex, rightIndex };
  }

  voteEvent({ id }) {
    const { vote } = this.props;
    const { leftEntry, rightEntry } = this.state;
    this.setState({ canVote: false });

    console.log('vote event');

    const winner = leftEntry.id === id ? leftEntry : rightEntry;
    const loser = leftEntry.id === id ? rightEntry : leftEntry;

    return vote({
      id: winner.id,
      wins: winner.wins + 1,
      winsDaily: winner.winsDaily + 1,
      winsWeekly: winner.winsWeekly + 1,
      losses: winner.losses,
      lossesDaily: winner.lossesDaily,
      lossesWeekly: winner.lossesWeekly
    }).then(() => {
      vote({
        id: loser.id,
        wins: loser.wins,
        winsDaily: loser.winsDaily,
        winsWeekly: loser.winsWeekly,
        losses: loser.losses + 1,
        lossesDaily: winner.lossesDaily + 1,
        lossesWeekly: winner.lossesWeekly + 1
      }).then((res) => {
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
    forceFetch: true
  },
  props: ({ data: { loading, allFilms } }) => ({
    loading,
    allFilms
  })
});

const withMutations = graphql(VOTE_MUTATION, {
  props: ({ ownProps, mutate }) => ({
    vote: ({ id, wins, losses, winsDaily, winsWeekly, lossesDaily, lossesWeekly }) => mutate({
      variables: { id, wins, losses, winsDaily, winsWeekly, lossesDaily, lossesWeekly },
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

function mapStateToProps(state) {
  return {
    leftEntry: state.leftEntry,
    rightEntry: state.rightEntry,
    canVote: state.canVote
  };
}

function mapDispatchToProps(dispatch) {
  return {

  };
}

export default compose(
  withMutations,
  withData,
  connect(mapStateToProps)
)(VoteFilmEntries);
