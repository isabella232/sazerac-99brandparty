import { alert99 } from '../../scripts/scripts.js';

const resultsPerPage = 15;

let map;
let infoWindow;
let geolocat = false;
let pos;
let markers = [];

const countryWithAlcohol = ['Massachusetts', 'South Carolina', 'West Virginia', 'Arkansas', 'Pennsylvania'];

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  markers.forEach((marker) => marker.setMap(null));
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function deleteResult() {
  deleteMarkers();
  document.getElementById('locator-results').innerHTML = '';
}

function isZIP(text) {
  return /\d+$/.test(text) && (text.length === 5);
}

async function isCountryWithoutAlcohol() {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.lat},${pos.lng}&key=AIzaSyAyfNEYMmECQLIBpa97FVwiQH0Q9ayqK0Y&location_type=APPROXIMATE&result_type=administrative_area_level_1`;
  const response = await fetch(url);
  let country;
  if (response.ok) {
    const data = await response.json();
    if (data.status === 'OK') {
      const search = data.results[0].address_components[0].long_name;
      if (countryWithAlcohol.find((c) => c === search)) {
        country = `Information not available for ${search}`;
      }
    }
  }
  return country;
}

function getLink(x1, y1, x2, y2) {
  return `https://www.google.com.co/maps/dir/${x1},${y1}/${x2},${y2}/?hl=en`;
}

function addMarker(place, i) {
  // eslint-disable-next-line no-undef
  const myLatlng = new google.maps.LatLng(place.latitude, place.longitude);
  // eslint-disable-next-line no-undef
  const marker = new google.maps.Marker({
    map,
    position: myLatlng,
    icon: {
      url: 'https://mt.google.com/vt/icon/name=icons/onion/SHARED-mymaps-pin-container-bg_4x.png,icons/onion/SHARED-mymaps-pin-container_4x.png,icons/onion/1899-blank-shape_pin_4x.png&highlight=ff000000,ffd600,ff000000&scale=2.0',
      // eslint-disable-next-line no-undef
      anchor: new google.maps.Point(30, 30),
      // eslint-disable-next-line no-undef
      scaledSize: new google.maps.Size(30, 30),
    },
  });

  // eslint-disable-next-line no-undef
  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.setContent(`<div class="info-ubic">
      <h5>${i + 1}  - ${place.name}</h5>
        <div class="info-ubic-d">
          <p>${place.address}, <span>${place.city}</span></p>
          <p class="link-result"><a target="_blank" class="btn" href="${getLink(pos.lat, pos.lng, place.latitude, place.longitude)}">DIRECTIONS</a></p>
        </div>
      </div>`);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

function pageLeft() {
  const current = document.querySelector('.active');
  const next = current.previousElementSibling;
  if (next.classList.contains('results-page')) {
    current.classList.remove('active');
    current.classList.add('inactive');
    next.classList.remove('inactive');
    next.classList.add('active');
  }
}

function pageRight() {
  const current = document.querySelector('.active');
  const next = current.nextElementSibling;
  if (next.classList.contains('results-page')) {
    current.classList.remove('active');
    current.classList.add('inactive');
    next.classList.remove('inactive');
    next.classList.add('active');
  }
}

function printResults(array, elem, nresult) {
  elem.innerHTML = '';
  if (array.length > 0) {
    let page = null;
    let show = true;
    const totalResults = array.length;
    let pageNumber = -1;
    array.forEach((element, i) => {
      if (!page) {
        page = document.createElement('div');
        page.className = 'results-page';
        elem.appendChild(page);
        if (show) {
          page.classList.add('active');
        } else {
          page.classList.add('inactive');
        }
        pageNumber += 1;
        const pageTitle = document.createElement('span');
        const from = pageNumber * nresult + 1;
        let to = pageNumber * nresult + nresult;
        if (to > totalResults) {
          to = totalResults;
        }
        pageTitle.innerHTML = `${from}-${to} of ${totalResults} results found`;
        page.appendChild(pageTitle);
      }
      const div = document.createElement('div');
      div.className = 'result';
      div.innerHTML = `
        <p class='icon-num'>${i + 1}</p>
        <div>
            <p class='info-title'>${element.name}</p>
            <p class='info-address'>${element.address}, ${element.city}, ${element.state}</p>
        </div>
        <a class='button' target='_blank' href='${getLink(pos.lat, pos.lng, element.latitude, element.longitude)}'>DIRECTIONS</a>
      `;
      page.appendChild(div);

      if ((i + 1) % nresult === 0) {
        page = null;
        show = false;
      }
    });
    page = document.createElement('div');
    page.className = 'pageination';
    elem.appendChild(page);
    const left = document.createElement('div');
    left.className = 'pageinator-left';
    left.addEventListener('click', pageLeft);
    page.append(left);
    const right = document.createElement('div');
    right.className = 'pageinator-right';
    right.addEventListener('click', pageRight);
    page.append(right);
  } else {
    alert99('No results found, try another flavor.');
  }
}

async function makeQueryProduct(product, radius) {
  let url = `https://api.sazerac.com/where_to_buy/api/products/${product}.json?lat=${pos.lat}&lng=${pos.lng}&token=-TPkTzrildt0m_nwP2N_7g&within=${radius}`;
  if (window.location.href.includes('localhost')) {
    // for local development, use testdata
    url = '/blocks/locator/testdata.json';
  }

  try {
    const response = await fetch(url, { mode: 'no-cors' });
    if (response.ok) {
      const data = await response.json();
      infoWindow.close();
      const isCountryWithAlcohol = await isCountryWithoutAlcohol();
      if (!isCountryWithAlcohol) {
        if (data) {
          data.data.locations.forEach((location, i) => {
            addMarker(location, i);
          });
          printResults(data.data.locations, document.getElementById('locator-results'), resultsPerPage);
        } else {
          alert99('No results found, try another flavor.');
        }
      } else {
        alert99(isCountryWithAlcohol);
        infoWindow.open(map);
        infoWindow.setContent(isCountryWithAlcohol);
      }
    }
  } catch (err) {
    alert99(err);
  }
}

async function searchForZip(zip, product, radius) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${zip}&key=AIzaSyAyfNEYMmECQLIBpa97FVwiQH0Q9ayqK0Y`;
  const response = await fetch(url);
  if (!response.ok) {
    alert99('No results found, try another flavor.');
  } else {
    const data = await response.json();
    if (data.results.length === 0) {
      alert99('No results found, try another flavor.');
    } else {
      pos = data.results[0].geometry.location;
      map.setCenter(pos);
      infoWindow.setPosition(pos);
      await makeQueryProduct(product, radius);
    }
  }
}

function handleLocationError() {
  document.getElementById('locator-map').innerHTML = 'Error: Your browser doesn\'t support geolocation.';
}

function getMyLocation(subSinc, product, radius) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      geolocat = true;
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      infoWindow.open(map);
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
      if (subSinc) {
        makeQueryProduct(product, radius);
      }
    }, (e) => {
      if (e.code === 1) {
        geolocat = false;
      }
      handleLocationError();
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError();
  }
}

function formSubmitted(form) {
  const zip = form.querySelector('#zip').value;
  deleteResult();
  if (!isZIP(zip)) {
    alert99('Please enter a valid ZIP code.');
    return;
  }
  const product = form.querySelector('#product').value;
  const radius = form.querySelector('#distance').value;
  if (geolocat) {
    if (!isZIP(zip)) {
      getMyLocation(true, product, radius);
    } else {
      searchForZip(zip, product, radius);
    }
  } else if (isZIP(zip)) {
    searchForZip(zip, product, radius);
  } else {
    alert99('Please enter a valid ZIP code.');
  }
}

export async function initMap() {
  // eslint-disable-next-line no-undef
  const { Map } = await google.maps.importLibrary('maps');

  map = new Map(document.getElementById('locator-map'), {
    center: {
      lat: 36.2425741,
      lng: -113.7464011,
    },
    zoom: 8,
  });
  // eslint-disable-next-line no-undef
  infoWindow = new google.maps.InfoWindow({
    map,
  });
  getMyLocation(false);
}

export default async function decorate(block) {
  const disclaimer = block.querySelector('div');
  disclaimer.classList.add('disclaimer');
  disclaimer.remove();
  window.locate = async (form) => {
    formSubmitted(form);
  };
  window.initMap = async () => {
    initMap();
  };
  document.querySelector('#zip').setAttribute('pattern', '[0-9]{5}');

  block.textContent = '';
  const d = document.createElement('div');
  d.className = 'map-container';
  const mdiv = document.createElement('div');
  mdiv.id = 'locator-map';
  mdiv.className = 'map';
  d.append(mdiv);
  d.append(disclaimer);
  const rdiv = document.createElement('div');
  rdiv.id = 'locator-results';
  rdiv.className = 'results';
  d.appendChild(rdiv);
  block.append(d);
}
