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
//url 관련 변수
let urlDetail = '';
let pageNum = 1;
//홈화면 변수
const homeLogo = document.querySelector('#home_logo');
const movieCardWrap = document.querySelector('#movie_card_wrap');
//네비 변수
const naviLis = document.querySelectorAll('#navi > li');
//더보기 변수
const moreBtn = document.querySelector('#more_btn');
//검색창 변수
const searchInput = document.querySelector('#search_input');
const searchBtn = document.querySelector('#searchBtn');
//모달창 변수
const modalLayer = document.querySelector('#modal_wrap');
const modal = document.querySelector('#modal');
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
const init = async function (urlDetail, pageNum) {
  //url 주소 리셋
  urlDetail = 'popular';
  pageNum = 1;

  let url = `https://api.themoviedb.org/3/movie/${urlDetail}?language=ko-KR&page=${pageNum}`;

  //기존 카드 제거
  movieCardWrap.innerHTML = '';
  //영화 렌더링
  const movieData = await fetchMovies(url);
  renderMovie(movieData);

  //popular 활성화 + 다른 네비 비활성화
  naviLis.forEach(function (li) {
    li.classList.remove('activeNavi');
  });
  popular.classList.add('activeNavi');

  //화면 상단으로 올리기
  window.scrollTo(0, 0);
  //검색창 리셋
  searchInput.value = '';
};

init();

//---HOME + NAVI---
//---HOME---
//로고 클릭시 기본 세팅으로 돌아오기
homeLogo.addEventListener('click', init);

//---NAVI---
//navi 누르면 해당 영화목록 렌더링
naviLis.forEach(async function (naviLi) {
  naviLi.addEventListener('click', async function () {
    //기존 활성화된 active 제거
    naviLis.forEach(function (li) {
      li.classList.remove('activeNavi');
    });
    //기존 활성화된 pageNum 리셋
    pageNum = 1;

    //li 클릭시 active 부여
    if (!naviLi.classList.contains('activeNavi')) {
      naviLi.classList.add('activeNavi');
    }

    //해당 url로 설정해서 데이터 fetch하는 로직
    let naviUrl = `https://api.themoviedb.org/3/movie/${naviLi.id}?language=ko-KR&page=${pageNum}`;
    const naviData = await fetchMovies(naviUrl);
    //기존 카드 제거 후 해당 데이터로 다시 렌더링
    movieCardWrap.innerHTML = '';
    renderMovie(naviData);
  });
});

//---RENDER/ADD + SEARCH---
//---RENDER---
//영화 정보 가져와서 페이지에 렌더링 : 카드생성 + 클릭시 모달창(함수)실행
const renderMovie = function (data) {
  data.forEach((movie) => {
    // movie객체 벨류값 가져오기
    const title = movie.title;
    const posterImg = movie.poster_path;
    const rate = movie.vote_average;
    const info = movie.overview;
    const releaseDate = movie.release_date;
    const bgImg = movie.backdrop_path;

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
    movieCard.setAttribute('data-image', bgImg);

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
//키워드 해당 데이터로 필터링하는 함수
const filterSearch = async function () {
  //더보기 버튼 삭제
  moreBtn.style.display = 'none';

  //search data 렌더링하기
  const searchValue = searchInput.value.trim();
  let data = await searchMovie(searchValue);

  //검색 결과 필터링
  const filteredMovies = data.filter((movie) =>
    movie.title.includes(searchValue)
  );

  //기존 카드 제거
  movieCardWrap.innerHTML = '';
  //영화 목록 다시 렌더링
  renderMovie(filteredMovies);
};

//검색키워드 해당 url 변경 + 데이터 불러오는 함수
const searchMovie = async function (searchValue) {
  let searchUrl;

  if (searchValue) {
    let encodedText = encodeURIComponent(searchValue);
    searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodedText}&include_adult=false&language=ko-KR&page=1`;
  }

  const searchData = await fetchMovies(searchUrl);
  return searchData;
};

//검색 버튼 클릭시 해당 영화 필터링
searchBtn.addEventListener('click', async function (event) {
  const searchValue = searchInput.value.trim();
  if (searchValue === '') {
    alert('검색어를 입력해주세요!');
    return;
  }

  return await filterSearch(searchValue);
});

//enter키 누를시 해당 영화 필터링
searchInput.addEventListener('keypress', async function (event) {
  const searchValue = searchInput.value.trim();
  if (event.key === 'Enter') {
    event.preventDefault();

    if (searchValue === '') {
      alert('검색어를 입력해주세요!');
      return;
    }

    return await filterSearch(searchValue);
  }
});

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
  const bgImg = movieCard.getAttribute('data-image');

  if (!posterImg || !title || !info || !releaseDate || !star) {
    console.error('Missing data for modal!');
    alert('아직 해당 영화의 정보가 업로드 되지 않았습니다!');
    return;
  }

  //모달창에 데이터 반영
  modal.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${bgImg})`;
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

//---MORE MOVIE---
//영화더보기 이벤트 : 더보기 버튼 클릭하면 페이지 1장씩 추가
//각 카테고리 안에서 개별적으로 적용!

//실패!
// naviLis.forEach((naviLi) => {
//   const pageNums = {};
//   const categoryId = naviLi.id;

//   //pageNums 초기화
//   if (!pageNums[categoryId]) {
//     pageNums[categoryId] = 1;
//   }
//   //카테고리별 페이지 번호 증가
//   pageNums[categoryId]++;

//   //페이지 추가시 데이터 렌더링 함수
//   const addPage = async function () {
//     //변경된 숫자를 url에 적용
//     let moreUrl = `https://api.themoviedb.org/3/movie/${categoryId}?language=ko-KR&page=${pageNums[categoryId]}`;
//     console.log(pageNums);
//     const moreData = await fetchMovies(moreUrl);

//     //카드 20개씩 추가
//     renderMovie(moreData);
//   };

//   //더보기 변수
//   const moreBtn = document.querySelector('#more_btn');
//   moreBtn.addEventListener('click', addPage);
// });

async function addPage(activeLi, pageNum) {
  console.log(activeLi);
  console.log(pageNum);

  let addedUrl = `https://api.themoviedb.org/3/movie/${activeLi}?language=ko-KR&page=${pageNum}`;

  //영화 렌더링
  const addData = await fetchMovies(addedUrl);
  renderMovie(addData);
}

moreBtn.addEventListener('click', () => {
  const activeLi = document.querySelector('.activeNavi').id;
  pageNum++;
  addPage(activeLi, pageNum);
});
