import watchedQueueTpl from '../partials/hbs/watched-queue-markup.hbs';
import refs from './common/refs';
import { onMarkupButton } from './pagination';
import { get, getUser, getLanguage } from './common/api-data';
const {
  galleryListRefs,
  headerWatchedBtnRefs,
  headerQueueBtnRefs,
  wrapperRefs,
  emptyWatchedQueueRefs,
  watchedQueueTextRefs,
} = refs.refs;

const lang = getLanguage();

headerWatchedBtnRefs.addEventListener('click', onWatchedBtnClick);
headerQueueBtnRefs.addEventListener('click', onQueueBtnClick);

function getMarkup(name, page) {
  let nameUser = getUser();
  if (!page) {
    page = 1;
  }
  let data = get(nameUser);
  let dataList = '';
  let totalPages = 0;
  if (name === 'watched') {
    dataList = data.watched;
  } else {
    dataList = data.queue;
  }
  if (dataList) {
    totalPages = numberOfPage(dataList);
  } else {
    dataList = [];
  }
  localStorage.setItem('totalPages', totalPages);
  localStorage.setItem('pageType', name);
  let firstIndex = (page - 1) * 20;
  let lastIndex = page * 20;
  if (lastIndex > dataList.length) {
    lastIndex = dataList.length;
  }
  let resultPage = dataList.slice(firstIndex, lastIndex);
  let genresList = onSearchGenresList(resultPage);
  let year = onSearchYear(genresList);
  if (year && year.length > 0) {
    galleryListRefs.innerHTML = watchedQueueTpl(year);
    emptyWatchedQueueRefs.classList.add('visually-hidden');
  } else {
    emptyWatchedQueueRefs.classList.remove('visually-hidden');
    galleryListRefs.innerHTML = '';
    if (lang === 'uk-UA') {
      watchedQueueTextRefs.textContent = 'Упс... Ваш список порожній!';
    }
  }
}

function onWatchedBtnClick() {
  showMarkup('watched');
}

function onQueueBtnClick() {
  showMarkup('queue');
}

export function watchedBtnClick(page) {
  showMarkup('watched', page);
}

export function queueBtnClick(page) {
  showMarkup('queue', page);
}

function showMarkup(name, page) {
  getMarkup(name, page);
  wrapperRefs.innerHTML = '';
  onMarkupButton(page);
}

function numberOfPage(info) {
  return Math.floor(info.length / 20) + 1;
}

function onSearchGenresList(data) {
  if (!data) {
    return null;
  }
  let newData = JSON.parse(JSON.stringify(data));
  newData = newData.map(elem => {
    let genre = elem.genres.map(item => item.name);
    if (genre.length === 0) {
      genre = ['No genre'];
      if (lang === 'uk-UA') {
        genre = ['Нема жанру'];
      }
    }
    if (genre.length >= 3) {
      genre = genre.slice(0, 2);
      if (lang === 'uk-UA') {
        genre.push('Інше');
      } else {
        genre.push('Other');
      }
    }
    genre = genre.join(', ');
    elem.genres = genre;
    return elem;
  });
  return newData;
}

function onSearchYear(data) {
  if (!data) {
    return null;
  }
  let newYear = JSON.parse(JSON.stringify(data));
  newYear = newYear.map(elem => {
    if (elem.release_date) {
      elem.release_date = elem.release_date.split('-')[0];
    } else if (lang === 'uk-UA') {
      elem.release_date = 'Нема даних';
    } else {
      elem.release_date = 'No date';
    }
    return elem;
  });
  return newYear;
}

export default { onWatchedBtnClick, onQueueBtnClick, getMarkup };
