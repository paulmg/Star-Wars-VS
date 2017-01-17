// convert to ISO 8601 format
const convertToDateTimeString = (str) => new Date(Date.parse(str)).toISOString();

module.exports = {
  createFilm: async function(film) {
    const result = await this.mutate(`{
      film: createFilm(
        director: "${film.director}"
        episodeId: ${film.episode_id}
        imageURL: "${film.image_url}"
        oldId: "${film.url}"
        openingCrawl: "${film.opening_crawl.replace(/(\r\n\r\n|\r\n|\n|\r)/gm, " ")}"
        producers: [${film.producer.split(', ').map(producer => `"${producer}"`)}]
        releaseDate: "${convertToDateTimeString(film.release_date)}"
        title: "${film.title}"
      ) {
        id
      }
    }`
    );

    return result.film.id;
  },

  createPerson: async function(person) {
    const result = await this.mutate(`{
      person: createPerson(
        birthYear: "${person.birth_year}"
        eyeColor: "${person.eye_color}"
        gender: "${person.gender}"
        hairColor: "${person.hair_color}"
        height: "${person.height}"
        imageURL: "${person.image_url}"
        mass: "${person.mass}"
        name: "${person.name}"
        oldId: "${person.url}"
        skinColor: "${person.skin_color}"
      ) {
        id
      }
    }`);

    return result.person.id;
  },

  createPlanet: async function(planet) {
    const result = await this.mutate(`{
    planet: createPlanet(
      climates: [${planet.climate.split(', ').map(climate => `"${climate}"`)}]
      diameter: "${planet.diameter}"
      gravity: "${planet.gravity}"
      imageURL: "${planet.image_url}"
      name: "${planet.name}"
      oldId: "${planet.url}"
      orbitalPeriod: "${planet.orbital_period}"
      population: "${planet.population}"
      rotationPeriod: "${planet.rotation_period}"
      surfaceWater:" ${planet.surface_water}"
      terrains: [${planet.terrain.split(', ').map(terrain => `"${terrain}"`)}]
    ) {
      id
    }
  }`);

    return result.planet.id;
  },

  createSpecies: async function(species) {
    const result = await this.mutate(`{
    species: createSpecies(
      averageHeight: "${species.average_height}"
      averageLifespan: "${species.average_lifespan}"
      classification: "${species.classification}"
      designation: "${species.designation}"
      eyeColors: [${species.eye_colors.split(', ').map(eye_color => `"${eye_color}"`)}]
      hairColors: [${species.hair_colors.split(', ').map(hair_color => `"${hair_color}"`)}]
      imageURL: "${species.image_url}"
      language: "${species.language}"
      name: "${species.name}"
      oldId: "${species.url}"
      skinColors: [${species.skin_colors.split(', ').map(skin_color => `"${skin_color}"`)}]
    ) {
      id
    }
  }`);

    return result.species.id;
  },

  createStarship: async function(starship) {
    const result = await this.mutate(`{
    starship: createStarship(
      cargoCapacity: "${starship.cargo_capacity}"
      consumables: "${starship.consumables}"
      costInCredits: "${starship.cost_in_credits}"
      crew: "${starship.crew}"
      hyperdriveRating: "${starship.hyperdrive_rating}"
      imageURL: "${starship.image_url}"
      length: "${starship.length}"
      manufacturers: [${starship.manufacturer.split(', ').map(manufacturer => `"${manufacturer}"`)}]
      maxAtmospheringSpeed: "${starship.max_atmosphering_speed}"
      mglt: "${starship.MGLT}"
      model: "${starship.model}"
      name: "${starship.name}"
      oldId: "${starship.url}"
      passengers: "${starship.passengers}"
      starshipClass: "${starship.starship_class}"
    ) {
      id
    }
  }`);

    return result.starship.id;
  },

  createVehicle: async function(vehicle) {
    const result = await this.mutate(`{
    vehicle: createVehicle(
      oldId: "${vehicle.url}"
      cargoCapacity: "${vehicle.cargo_capacity}"
      consumables: "${vehicle.consumables}"
      costInCredits: "${vehicle.cost_in_credits}"
      crew: "${vehicle.crew}"
      imageURL: "${vehicle.image_url}"
      length: "${vehicle.length}"
      manufacturers: [${vehicle.manufacturer.split(', ').map(manufacturer => `"${manufacturer}"`)}]
      maxAtmospheringSpeed: "${vehicle.max_atmosphering_speed}"
      model: "${vehicle.model}"
      name: "${vehicle.name}"
      passengers: "${vehicle.passengers}"
      vehicleClass: "${vehicle.vehicle_class}"
    ) {
      id
    }
  }`);

    return result.vehicle.id;
  }
}
