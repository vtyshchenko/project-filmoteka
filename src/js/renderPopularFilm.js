import API from './apiService';
import videoCardTpl from '../partials/hbs/video-card.hbs'
import refs from './common/refs';

const {galleryListRefs, btnHomeRefs} = refs.refs


// btnHomeRefs.addEventListener('click', onSearchPopularFilms)

export default function onSearchPopularFilms(page) {
    if (!page) {
        page = 1;
    }
    
    API.fetchPopularFilms(page).then(data => {
        localStorage.setItem("totalPages", data.total_pages);
        localStorage.setItem("pageType", 'popular');
        return data.results
    })
    .then(renderPopFilms)
    .catch(error => {
      console.log(error)
    })
}
         
function renderPopFilms(results) {
   const markup = videoCardTpl(results)
    galleryListRefs.innerHTML = markup
}
    
onSearchPopularFilms()



