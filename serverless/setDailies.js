const _ = require('lodash');
const async = require('async');
const { Lokka } = require('lokka');
const { Transport } = require('lokka-transport-http');

const config = require('./config');

const token = config.graphCool.token;
const headers = { Authorization: `Bearer ${token}` };

const models = {
  person: 'Persons',
  starship: 'Starships',
  vehicle: 'Vehicles',
  species: 'Species',
  planet: 'Planets',
  film: 'Films'
};

const client = new Lokka({
  transport: new Transport(config.graphCool.url, { headers })
});

// Set timezone to UTC (needed for Graphcool)
process.env.TZ = 'UTC';

// Query action
const queryAll = model => (
  client.query(`{
    all${model} {
      id
    }
  }`)
);

// Update the daily wins
const updateMutation = (newDataId, newTypeId, connectionType) => (
  client.mutate(`{
    updateResource: update${connectionType.model}(
      id: "${newTypeId}", 
      winsDaily: 0, 
      lossesDaily: 0
    ) {
      id
    }
  }`)
);


const main = () => {
  // Query all resource models
  Object.values(models).forEach((model) => {
    const allIds = queryAll(model);
  })

  // Get each resource id, winsDaily

  // Tally wins and losses for each

  // Clear and add new resources to daily relationship (grab all daily ids and remove?)

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
