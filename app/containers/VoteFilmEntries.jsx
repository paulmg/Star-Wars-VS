import React from 'react';
import { graphql, compose } from 'react-apollo';
import { connect } from 'react-redux';
import update from 'immutability-helper';
import { propType } from 'graphql-anywhere';

import Loading from '../components/Loading';
import Entries from '../components/Entries';
import VoteEntry from '../components/VoteEntry';
import { setLeftRightEntries, setCanVote } from '../actions/entries';

import FILMS_QUERY from '../graphql/queries/FilmQuery.graphql';
import VOTE_MUTATION from '../graphql/mutations/VoteMutation.graphql';

class VoteFilmEntries extends React.Component {
  constructor() {
    super();

    // Bind class context for this.props
    this.voteEvent = this.voteEvent.bind(this);
  }

  componentDidMount() {
    const { allFilms } = this.props;

    setTimeout(() => {
      this.props.onReady(allFilms);
    }, 100);
  }

  voteEvent({ id }) {
    const { vote, leftEntry, rightEntry } = this.props;
    this.props.allowVote(false);

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
        this.props.onReady(this.props.allFilms);
        //this.props.allowVote(true);
        console.log('update', res);
      });
    });
  }

  render() {
    const { loading, leftEntry, rightEntry, canVote } = this.props;

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
    vote: ({ id, wins, losses, winsDaily, winsWeekly, lossesDaily, lossesWeekly }) =>
      mutate({
        variables: { id, wins, losses, winsDaily, winsWeekly, lossesDaily, lossesWeekly },
        refetchQueries: [{
          allFilms: FILMS_QUERY
        }]
        // todo: refetch new
        //updateQueries: {
        //  allFilms: (prev, { mutationResult }) => {
        //    const updatedFilm = mutationResult.data.updateFilm;
        //    console.log('updateFilm', updatedFilm, [...prev.allFilms, updatedFilm])
        //    return update(prev, {
        //      allFilms: [...prev.allFilms, updatedFilm]
        //    });
        //  }
        //}
      })
  })
});

function mapStateToProps(state) {
  return {
    leftEntry: state.entries.leftEntry,
    rightEntry: state.entries.rightEntry,
    canVote: state.entries.canVote
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onReady: (entries) => {
      dispatch(setLeftRightEntries(entries));
    },
    allowVote: (isEnabled) => {
      dispatch(setCanVote(isEnabled));
    }
  };
}

export default compose(
  withMutations,
  withData,
  connect(mapStateToProps, mapDispatchToProps)
)(VoteFilmEntries);
