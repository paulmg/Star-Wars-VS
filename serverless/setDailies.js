const _ = require('lodash');
const { Lokka } = require('lokka');
const { Transport } = require('lokka-transport-http');
const jsonfile = require('jsonfile');

const config = require('./config');

const token = config.graphCool.token;
const headers = { Authorization: `Bearer ${token}` };

const types = {
  people: 'people',
  starship: 'starships',
  vehicle: 'vehicles',
  species: 'species',
  planet: 'planets',
  film: 'films'
};

const client = new Lokka({
  transport: new Transport(config.graphCool.url, { headers })
});

// Set timezone to UTC (needed for Graphcool)
process.env.TZ = 'UTC';

const connectMutation = (newDataId, newTypeId, connectionType) => (
  client.mutate(`{
    addTo${connectionType.model + connectionType.connectionModel}(${connectionType.connectionPlural + connectionType.connectionModel}Id: "${newTypeId}" ${connectionType.plural + connectionType.model}Id: "${newDataId}") {
      ${connectionType.plural + connectionType.model} {
        id
      }
    }
  }`)
);

const queryAll = () => (
  client.query(`{
    allFilms {
      id
      losesDaily
      winsDaily
    }
  }`)
)

const main = () => {
  // Query all resource types
  for(const typeProp in types) {
    if(types.hasOwnProperty(typeProp)) {

    }
  }

  // Get each resource id, daily wins

  // Tally wins and losses for each

  // Clear and add new resources to daily relationship

  //



  // let mutations = [];
  // connectMutationTypes.forEach((connectionType) => {
  //   mutations.push(_.chain(connectionType.data)
  //                   .flatMap((data) => {
  //                     const newTypeIds = [].concat(data[connectionType.type]).map((d) => connectionType.connectionIdMap[d]);
  //                     const newDataId = connectionType.idMap[data.url];
  //                     console.log(newTypeIds, newDataId);
  //
  //                     return newTypeIds.map((newTypeId) => ({ newTypeId, newDataId }));
  //                   })
  //                   .map(({ newTypeId, newDataId }) => {
  //                     connectMutation(newDataId, newTypeId, connectionType);
  //                   })
  //                   .value());
  // });
  //
  // await Promise.all(mutations);
  // console.log(`Created ${mutations.length} edges in films`);
};

main();
