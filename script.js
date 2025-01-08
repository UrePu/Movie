// fetch(
//   'https://api.themoviedb.org/3/movie/550?api_key=8e8173ce68a621d89b5849b20c8930ff'
// )
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// fetch('https://api.themoviedb.org/3/movie/550?api_key=8e8173ce68a621d89b5849b20c8930ff', {
//   method : 'POST',
//   headers : {'Content-Type' : 'application/json'},
//   body: JSON.stringify()
// })

const testTitle = document.querySelector('#test');

//TMDB Movie List - Popular
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTgxNzNjZTY4YTYyMWQ4OWI1ODQ5YjIwYzg5MzBmZiIsIm5iZiI6MTczNjMxNDY2Mi42ODQsInN1YiI6IjY3N2UwZjI2MjE4ZmQ1N2FjZjRlNTc1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UplQK5NQAiCLPzUCZqyZy0gueCx_R7Q6NPzHT1oIYtE',
  },
};

fetch(
  'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
  options
)
  .then((res) => res.json())
  .then((res) => {
    const resResults = res['results'];
    for (let i = 0; i < resResults.length; i++) {
      console.log(resResults[i].title);
      testTitle.innerHTML = `<p>${resResults[i].title}</p>`;
    }
  })
  .catch((err) => console.error(err));

options['title'];
