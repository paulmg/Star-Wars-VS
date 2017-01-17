/* eslint-disable no-sync */
global.Promise = require('babel-runtime/core-js/promise').default;
const fetch = require('isomorphic-fetch');
const jsonfile = require('jsonfile');

const exportToCloudinary = require('./exportToCloudinary');

// Resource types
const types = require('./types');

// URLS
const apiURL = 'https://swapi.co/api/';
const wookieURL = 'http://starwars.wikia.com/api.php?action=imageserving&format=json&wisTitle=';


const get = async(url) => {
  // force https on Star Wars API
  const httpsUrl = url.replace('http://', 'https://');
  const response = await fetch(httpsUrl);
  return await response.json();
};

const fetchAllFromResource = async(resource) => {
  let page = await get(resource);
  const records = page.results;

  while(page.next) {
    page = await get(page.next);
    records.push(...page.results);
  }

  return records;
};

const fetchImageFromWookiepedia = async(title) => {
  // First encode title
  const encodedTitle = title.replace(/ /g, "_");

  const page = await get(wookieURL + encodedTitle);

  if(page.image) {
    let cloudinaryURL = '';

    if(page.image.imageserving) {
      cloudinaryURL = await exportToCloudinary(page.image.imageserving);
    }

    return cloudinaryURL;
  }

  return '';
};

const main = async() => {
  const root = await get(apiURL);

  for(const typeProp in types) {
    if(types.hasOwnProperty(typeProp)) {
      // Get each type resource from SWAPI url
      const resource = await fetchAllFromResource(root[types[typeProp]]);

      // Add in Wookiepedia image data in another pass
      const newResource = await Promise.all(resource.map(async(item) => {
        item['image_url'] = await fetchImageFromWookiepedia(item.title ? item.title : item.name);
        return item;
      }));

      // Save to local json file
      const file = `./data/${typeProp}.json`;
      jsonfile.writeFile(file, newResource, { spaces: 2 }, (err) => console.error(err));
    }
  }
};

main().catch((e) => console.error(e));
