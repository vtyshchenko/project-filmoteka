export function onSearchGenresList(data) {
  let genres = localStorage.getItem('genres');
  if (!genres) {
    return
  }
  genres = JSON.parse(genres);

  let newData = JSON.parse(JSON.stringify(data))

  newData.results = newData.results.map(elem => {
   
    let genreID = elem.genre_ids.map(item => {

      let tmp = genres.find(genr => genr.id === item)
      return tmp.name
    })
      if (genreID.length === 0) {
        genreID = ["No genre"]
        if (localStorage.getItem('language') === 'uk-UA') {
          genreID = ["Нема жанру"]
        }
        }
  
    if (genreID) {
          genreID = genreID.join(', ').split(',')
        }
      if (genreID.length >= 3) {
            genreID = genreID.slice(0, 2)
        if (localStorage.getItem('language') === 'uk-UA') {
          genreID.push(' Інше')
        } else {
          genreID.push(' Other')
        }
      }
        
    elem.genre_ids = genreID
    return elem
  })
  
  return newData;
}

export function onSearchYear(data) {

  let newYear = JSON.parse(JSON.stringify(data))
 newYear.results = newYear.results.map(elem => {
    if (elem.release_date) {
      elem.release_date = elem.release_date.split('-')[0];
      }  else if( localStorage.getItem('language') === 'uk-UA')  {
      elem.release_date = 'Нема даних'
    } else {
     elem.release_date = 'No date'
   }
 return elem
 })
  
  return newYear
}
