//---API---
const api_token =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTgxNzNjZTY4YTYyMWQ4OWI1ODQ5YjIwYzg5MzBmZiIsIm5iZiI6MTczNjMxNDY2Mi42ODQsInN1YiI6IjY3N2UwZjI2MjE4ZmQ1N2FjZjRlNTc1NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UplQK5NQAiCLPzUCZqyZy0gueCx_R7Q6NPzHT1oIYtE';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${api_token}`,
  },
};

//---DOM ELEMENTS---
//검색창 변수
const searchInput = document.querySelector('#search_input');
const searchBtn = document.querySelector('#searchBtn');

//모달창 변수
const modalLayer = document.querySelector('#modal_wrap');
const modalImg = document.querySelector('.modal_img');
const modalTitle = document.querySelector('.modal_title');
const modalInfo = document.querySelector('.modal_info');
const modalDay = document.querySelector('.modal_day');
const modalStar = document.querySelector('.modal_star');
const modalBtn = document.querySelector('#modal_btn');

//---URL---
// const popularUrl =
//   'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1';
// const nowShowingUrl =
//   'https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1';
// const searchUrl = `https://api.themoviedb.org/3/search/movie?${searchValue}&include_adult=false&language=ko-KR&page=1`;

//---FETCH---
//영화 정보 가져오기
const fetchMovies = async function (url) {
  try {
    //fetch
    const response = await fetch(url, options);
    const json = await response.json();
    const data = json.results;

    return data;
  } catch (err) {
    console.error('error data', err);
  }
};

//---INIT---
// 초기 렌더링 및 검색 기능 실행
(async function (urlDetail, pageNum) {
  if (!urlDetail) urlDetail = 'popular';
  if (!pageNum) pageNum = 1;

  let url = `https://api.themoviedb.org/3/movie/${urlDetail}?language=ko-KR&page=${pageNum}`;

  const movieData = await fetchMovies(url);
  renderMovie(movieData); // 영화 렌더링
})();

//---RENDER + SEARCH---
//---RENDER---
//영화 정보 가져와서 페이지에 렌더링 : 카드생성 + 클릭시 모달창(함수)실행
const renderMovie = function (data) {
  const movieCardWrap = document.querySelector('#movie_card_wrap');
  movieCardWrap.innerHTML = ''; // 기존 카드 제거

  data.forEach((movie) => {
    // movie객체 벨류값 가져오기
    const title = movie.title;
    const posterImg = movie.poster_path;
    const rate = movie.vote_average;
    const info = movie.overview;
    const releaseDate = movie.release_date;
    // 별점 계산
    const count = Math.floor(rate / 2) + (rate % 2 !== 0 ? 1 : 0);
    const star = '⭐️'.repeat(count);

    // 영화 카드 생성
    const movieCard = document.createElement('li');

    // 영화 카드에 속성 추가
    movieCard.setAttribute('class', 'movie_card');
    movieCard.setAttribute('data-title', title);
    movieCard.setAttribute('data-poster', posterImg);
    movieCard.setAttribute('data-info', info);
    movieCard.setAttribute('data-release', releaseDate);
    movieCard.setAttribute('data-star', star);
    // 영화 카드에 내용 넣기
    movieCard.innerHTML = `
      <img src='https://image.tmdb.org/t/p/w500${posterImg}' alt='${title} image'>
      <h3>${title}</h3>
      <p>${star}</p>
    `;

    movieCardWrap.appendChild(movieCard);

    // 클릭 - 모달 이벤트 추가
    movieCard.addEventListener('click', () => {
      activeModal(movieCard);
      closeModal(movieCard);
    });
  });
};

//---SEARCH---
//검색창 이벤트 : 검색창에 영화 타이틀을 검색하면 해당 카드만 보이도록 정렬
//검색 버튼 클릭시 해당 영화 필터링
searchBtn.addEventListener('click', async function (event) {
  const searchValue = searchInput.value.trim();
  event.preventDefault();

  let data = await searchMovie(searchValue);

  if (searchValue === '') {
    alert('검색어를 입력해주세요!');
    return;
  }

  //검색 결과 필터링
  const filteredMovies = data.filter((movie) =>
    movie.title.includes(searchValue)
  );

  //영화 목록 다시 렌더링
  renderMovie(filteredMovies);
});

//검색키워드 해당 url 변경 + 데이터 불러오는 함수
const searchMovie = async function (searchValue) {
  let searchUrl;

  if (searchValue) {
    let encodedText = encodeURIComponent(searchValue);
    console.log(encodedText);
    searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodedText}&include_adult=false&language=ko-KR&page=1`;
  }

  const searchData = await fetchMovies(searchUrl);

  return searchData;
};

//---MODAL---
//모달 이벤트 : 해당 카드를 클릭하면 영화 상세정보 모달창 팝업

//모달창 활성화 함수
const activeModal = function (movieCard) {
  //모달창에 카드 속성 가져오기
  const posterImg = movieCard.getAttribute('data-poster');
  const title = movieCard.getAttribute('data-title');
  const info = movieCard.getAttribute('data-info');
  const releaseDate = movieCard.getAttribute('data-release');
  const star = movieCard.getAttribute('data-star');

  if (!posterImg || !title || !info || !releaseDate || !star) {
    console.error('Missing data for modal!');
    return;
  }

  //모달창에 데이터 반영
  modalImg.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${posterImg})`;
  modalTitle.innerText = title;
  modalInfo.innerText = info;
  modalDay.innerText = releaseDate;
  modalStar.innerText = star;

  //모달창 활성화
  modalLayer.classList.add('activeModal');
};

//모달창 비활성화 함수
const closeModal = function (movieCard) {
  modalBtn.addEventListener('click', () => {
    //모달창 비활성화
    modalLayer.classList.remove('activeModal');
  });
};
