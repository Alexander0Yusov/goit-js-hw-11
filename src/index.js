const axios = require('axios');
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
const myKey = '34154795-6fcd5a0715506f88bd4f4189d';
import Notiflix from 'notiflix';

const rfs = {
  cardSet: document.querySelector('.gallery'),
  btnMore: document.querySelector('.load-more'),
  inputEl: document.querySelector('.search-form')[0],
  btnFind: document.querySelector('.search-form')[1],
};

rfs.btnMore.addEventListener('click', btnMoreClickHandler);
rfs.inputEl.addEventListener('input', onInputElHandler);
rfs.btnFind.addEventListener('click', btnFindClickHandler);

const options = {
  closeText: '×',
  nav: true,
  navText: ['←', '→'],
};
const lightbox = new SimpleLightbox('.gallery a', options);
lightbox.on('show.simplelightbox');

let page = 1;
let per_page = 20;
let inputValue = '';
let url = '';
let allPages = 0;

function updateUrlPage(page) {
  url = `https://pixabay.com/api/?key=${myKey}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;
}

function updateUrlinsertValue() {}

function onInputElHandler() {
  inputValue = rfs.inputEl.value;
}

async function btnFindClickHandler(e) {
  e.preventDefault();
  page = 1;
  // inputValue = 'cat yellow eye';
  // inputValue = 'cfrtyhbnj';

  await clearCardset();
  await updateUrlPage(page);
  await getData();
}

function btnMoreClickHandler() {
  page++;
  updateUrlPage(page);
  getData();
}

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
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${(largeImageURL, tags)}" loading="lazy" />

<div class="info">
  <p class="info-item" style="text-decoration:none;">
    <b>Likes </b>${likes}
  </p>
  <p class="info-item">
    <b>Views </b>${views}
  </p>
  <p class="info-item">
    <b>Comments </b>${comments}
  </p>
  <p class="info-item">
    <b>Downloads </b>${downloads}
  </p>
</div>
</a>
</div>
`;
  return markup;
}

function galleryInnerHTML(array) {
  array.length !== 0
    ? rfs.cardSet.insertAdjacentHTML(
        'beforeend',
        array.map(createCardHTML).join('')
      )
    : new Error('Пустенько');
}

function clearCardset() {
  rfs.cardSet.innerHTML = '';
}

async function getData() {
  hideBtn();

  await fetch(url)
    .then(res => res.json())
    .then(({ hits, total, totalHits }) => {
      console.log(total, totalHits);
      if (total) {
        galleryInnerHTML(hits);
        updatePageStatus(total);
        setTimeout(comparePageNumber, 700);
        page === 1 &&
          Notiflix.Notify.success(`Hooray! We found ${total} images.`);
      } else {
        Notiflix.Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }

      return total;
    })
    .catch(er => console.log(er.message()));
  await lightbox.refresh();
}

function updatePageStatus(total) {
  allPages = Math.floor(total / per_page) + 1;
}
function comparePageNumber() {
  if (page === allPages) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    hideBtn();
  } else showBtn();
}
function hideBtn() {
  rfs.btnMore.style.display = 'none';
  console.log('hidden');
}
function showBtn() {
  rfs.btnMore.style.display = 'block';
  console.log('showing');
}

hideBtn();

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

console.log('tttttttttt');
