const axios = require('axios');
const myKey = '34154795-6fcd5a0715506f88bd4f4189d';

const rfs = {
  cardSet: document.querySelector('.gallery'),
};
let page = 1;
let per_page = 10;
const inputValue = 'cat';

const url = `https://pixabay.com/api/?key=${myKey}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;

function createCardHTML(item) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = item;
  const markup = `<div class="photo-card">
<img src="${webformatURL}" alt="${(largeImageURL, tags)}" loading="lazy" />
<div class="info">
  <p class="info-item">
    <b>Likes ${likes}</b>
  </p>
  <p class="info-item">
    <b>Views ${views}</b>
  </p>
  <p class="info-item">
    <b>Comments ${comments}</b>
  </p>
  <p class="info-item">
    <b>Downloads ${downloads}</b>
  </p>
</div>
</div>`;
  return markup;
}

function galleryInnerHTML(array) {
  array.length !== 0
    ? (rfs.cardSet.innerHTML = array.map(createCardHTML).join(''))
    : console.log('Ужас, пустой массив');
}

fetch(url)
  .then(res => res.json())
  .then(({ hits }) => galleryInnerHTML(hits))
  .catch(er => console.log(er.message()));
