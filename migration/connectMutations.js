const _ = require('lodash');
const { Lokka } = require('lokka');
const { Transport } = require('lokka-transport-http');

const config = require('./config');

const token = config.graphCool.token;
const headers = { Authorization: `Bearer ${token}` };

const client = new Lokka({
  transport: new Transport(config.graphCool.url, { headers })
});

// set timezone to UTC (needed for Graphcool)
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

const main = async() => {
  const films = require('./data/film.json');
  const people = require('./data/people.json');
  const planets = require('./data/planet.json');
  const species = require('./data/species.json');
  const starships = require('./data/starship.json');
  const vehicles = require('./data/vehicle.json');

  const filmIdMap = require('./data/filmIdMap');
  const peopleIdMap = require('./data/peopleIdMap');
  const planetsIdMap = require('./data/planetIdMap');
  const speciesIdMap = require('./data/speciesIdMap');
  const starshipsIdMap = require('./data/starshipIdMap');
  const vehiclesIdMap = require('./data/vehicleIdMap');

  const connectMutationTypes = [
    {
      data: films,
      type: 'characters',
      idMap: filmIdMap,
      connectionIdMap: peopleIdMap,
      plural: 'films',
      model: 'Film',
      connectionPlural: 'persons',
      connectionModel: 'Person'
    },
    {
      data: films,
      type: 'planets',
      idMap: filmIdMap,
      connectionIdMap: planetsIdMap,
      plural: 'films',
      model: 'Film',
      connectionPlural: 'planets',
      connectionModel: 'Planet'
    },
    {
      data: films,
      type: 'starships',
      idMap: filmIdMap,
      connectionIdMap: starshipsIdMap,
      plural: 'films',
      model: 'Film',
      connectionPlural: 'starships',
      connectionModel: 'Starship'
    },
    {
      data: films,
      type: 'vehicles',
      idMap: filmIdMap,
      connectionIdMap: vehiclesIdMap,
      plural: 'films',
      model: 'Film',
      connectionPlural: 'vehicles',
      connectionModel: 'Vehicle'
    },
    {
      data: films,
      type: 'species',
      idMap: filmIdMap,
      connectionIdMap: speciesIdMap,
      plural: 'films',
      model: 'Film',
      connectionPlural: 'species',
      connectionModel: 'Species'
    },
    {
      data: people,
      type: 'homeworld',
      idMap: peopleIdMap,
      connectionIdMap: planetsIdMap,
      plural: 'person',
      model: 'Person',
      connectionPlural: 'planet',
      connectionModel: 'Planet'
    },
    {
      data: people,
      type: 'starships',
      idMap: peopleIdMap,
      connectionIdMap: starshipsIdMap,
      plural: 'persons',
      model: 'Person',
      connectionPlural: 'starships',
      connectionModel: 'Starship'
    },
    {
      data: people,
      type: 'vehicles',
      idMap: peopleIdMap,
      connectionIdMap: vehiclesIdMap,
      plural: 'persons',
      model: 'Person',
      connectionPlural: 'vehicles',
      connectionModel: 'Vehicle'
    },
    {
      data: people,
      type: 'species',
      idMap: peopleIdMap,
      connectionIdMap: speciesIdMap,
      plural: 'person',
      model: 'Person',
      connectionPlural: 'species',
      connectionModel: 'Species'
    },
    {
      data: species,
      type: 'homeworld',
      idMap: speciesIdMap,
      connectionIdMap: planetsIdMap,
      plural: 'species',
      model: 'Species',
      connectionPlural: 'planet',
      connectionModel: 'Planet'
    }
  ];

  let mutations = [];
  connectMutationTypes.forEach((connectionType) => {
    mutations.push(_.chain(connectionType.data)
                    .flatMap((data) => {
                      const newTypeIds = [].concat(data[connectionType.type]).map((d) => connectionType.connectionIdMap[d]);
                      const newDataId = connectionType.idMap[data.url];
                      console.log(newTypeIds, newDataId);

                      return newTypeIds.map((newTypeId) => ({ newTypeId, newDataId }));
                    })
                    .map(({ newTypeId, newDataId }) => {
                      connectMutation(newDataId, newTypeId, connectionType)
                    })
                    .value());
  });

  await Promise.all(mutations);
  console.log(`Created ${mutations.length} edges in films`);
};

main().catch((e) => console.error(e));
