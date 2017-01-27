const _ = require('lodash');
const Promise = require('bluebird');
const { Lokka } = require('lokka');
const { Transport } = require('lokka-transport-http');

const config = require('./../config');

const token = config.graphCool.token;
const headers = { Authorization: `Bearer ${token}` };

const models = {
  Person: 'Persons',
  Starship: 'Starships',
  Vehicle: 'Vehicles',
  Species: 'Species',
  Planet: 'Planets',
  Film: 'Films'
};

const client = new Lokka({
  transport: new Transport(config.graphCool.url, { headers })
});

// Set timezone to UTC (needed for Graphcool)
process.env.TZ = 'UTC';

// Update the daily wins
const updateMutation = (resourceId, model) => (
  client.mutate(`{
    updateResource: update${model}(
      id: "${resourceId}", 
      winsDaily: 0, 
      lossesDaily: 0
    ) {
      id
    }
  }`)
);

function main(context) {
  // Query all resource models
  const queries = [];
  const mutations = [];

  Object.values(models).forEach((model) => {
    queries.push(
      client.query(`{
          all${model} {
            id
          }
        }`).then((res) => {
        const allResourceIds = {};
        allResourceIds[model] = res[Object.keys(res)[0]].map((item) => item.id);

        return allResourceIds;
      })
    );
  });

  Promise.all(queries).then((res) => {
    if(res) {
      // Loop through array and mutate every model Id
      res.forEach((allResourceIds) => {
        const modelName = Object.keys(models).find(key => models[key] === Object.keys(allResourceIds)[0]);
        const resourceIds = allResourceIds[Object.keys(allResourceIds)];

        resourceIds.forEach((resourceId) => {
          mutations.push(updateMutation(resourceId, modelName));
        });
      });

      Promise.all(mutations).then((res) => console.log(res));
    }
  });
}

main();
