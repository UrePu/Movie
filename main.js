const api_key = '8e8173ce68a621d89b5849b20c8930ff';
const api_token =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTgxNzNjZTY4YTYyMWQ4OWI1ODQ5YjIwYzg5MzBmZiIsIm5iZiI6MTczNjMxNDY2Mi42ODQsInN1YiI6IjY3N2UwZjI2MjE4ZmQ1N2FjZjRlNTc1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UplQK5NQAiCLPzUCZqyZy0gueCx_R7Q6NPzHT1oIYtE';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${api_token}`,
  },
};

const popularUrl =
  'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1';

const nowShowingUrl =
  'https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1';

//영화 데이터 가져오기
// const getMovies = async function () {
//   try {
//     //fetch
//     const popularResponse = await fetch(popularUrl, options);
//     const popularJson = await popularResponse.json();
//     const popularData = await popularJson.results;

//     return popularData;
//   } catch (err) {
//     console.error('error data', error);
//   }
// };

const getMovies = async function (url) {
  try {
    //fetch
    const Response = await fetch(url, options);
    const Json = await Response.json();
    const Data = await Json.results;

    return Data;
  } catch (err) {
    console.error('error data', error);
  }
};

//변수
const movieCardWrap = document.querySelector('#movie_card_wrap');
const main = document.querySelector('main');

//영화 정보 가져와서 페이지에 렌더링
const renderMovie = async function () {
  try {
    //popular 영화 데이터 불러오기
    const popularData = await getMovies(popularUrl);

    //popular 영화 목록 생성
    popularData.forEach((popularMovie) => {
      let title = popularMovie.title;
      let posterImg = popularMovie.poster_path;
      let rate = popularMovie.vote_average;
      //별점
      let star = '';
      if (rate > 8) {
        star = '⭐️⭐️⭐️⭐️⭐️';
      } else if (rate > 6) {
        star = '⭐️⭐️⭐️⭐️';
      } else if (rate > 4) {
        star = '⭐️⭐️⭐️';
      } else if (rate > 2) {
        star = '⭐️⭐️';
      } else {
        star = '⭐️';
      }

      const movieCard = document.createElement('div');
      movieCardWrap.append(movieCard);

      movieCard.setAttribute('class', 'movie_card');
      movieCard.innerHTML = `
      <img src='https://image.tmdb.org/t/p/w500${posterImg}' alt='${title} image'>
      <h3>${title}</h3>
      <p>${star}</p>
      `;

      //popular 영화 카드 선택시 모달창 팝업
    });
  } catch (err) {
    console.error('error data', error);
  }
};

renderMovie();
