const _ = require('lodash');
const { Lokka } = require('lokka');
const { Transport } = require('lokka-transport-http');
const jsonfile = require('jsonfile');

const config = require('./config');
const { createFilm, createPerson, createPlanet, createSpecies, createStarship, createVehicle } = require('./createMutations');

// Set Graphcool authorization header
const token = config.graphCool.token;
const headers = { Authorization: `Bearer ${token}` };

// Create the Lokka GraphQL client from Graphcool simple API endpoint
const client = new Lokka({
  transport: new Transport(config.graphCool.url, { headers })
});

// Set timezone to UTC (needed for Graphcool)
process.env.TZ = 'UTC';

// Maps from old imported id (data set) to new generated id (Graphcool)
const createResource = async(name, resource, fn) => {
  const resourceIds = await Promise.all(resource.map(fn.bind(client)));

  const zippedIds = _.zipObject(resource.map(res => res.url), resourceIds);

  const file = `./data/${name}IdMap.json`;
  jsonfile.writeFile(file, zippedIds, { spaces: 2 }, (err) => console.error(err));

  return zippedIds;
};

// Sets up a connection mutation for each resource type
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
  // Grab the previously generated JSON data
  const films = require('./data/film.json');
  const people = require('./data/people.json');
  const planets = require('./data/planet.json');
  const species = require('./data/species.json');
  const starships = require('./data/starship.json');
  const vehicles = require('./data/vehicle.json');

  // Create a Graphcool resource for each type and generate an id map
  const filmIdMap = await createResource('film', films, createFilm);
  const peopleIdMap = await createResource('people', people, createPerson);
  const planetsIdMap = await createResource('planet', planets, createPlanet);
  const speciesIdMap = await createResource('species', species, createSpecies);
  const starshipsIdMap = await createResource('starship', starships, createStarship);
  const vehiclesIdMap = await createResource('vehicle', vehicles, createVehicle);

  // console.log(filmIdMap);
  // console.log(`Created ${Object.keys(filmIdMap).length} films`);

  //
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
      plural: 'persons',
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
      plural: 'persons',
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

  // Go through each mutation connection
  let mutations = [];
  connectMutationTypes.forEach((connectionType) => {
    mutations.push(_.chain(connectionType.data)
                    .flatMap((data) => {
                      const newTypeIds = [].concat(data[connectionType.type]).map((d) => connectionType.connectionIdMap[d]);
                      const newDataId = connectionType.idMap[data.url];
                      //console.log(newTypeIds, newDataId);

                      return newTypeIds.map((newTypeId) => ({ newTypeId, newDataId }));
                    })
                    .map(({ newTypeId, newDataId }) => {
                      //
                      connectMutation(newDataId, newTypeId, connectionType);
                    })
                    .value());
  });

  await Promise.all(mutations);
  console.log(`Created ${mutations.length} edges in films`);
};

main().catch((e) => console.error(e));
