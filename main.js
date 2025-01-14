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
const headerHeight = document.querySelector('header').offsetHeight;
//모달창 변수
const modalLayer = document.querySelector('#modal_wrap');
const modal = document.querySelector('#modal');
const modalTitle = document.querySelector('.modal_title');
const modalInfo = document.querySelector('.modal_info');
const modalDay = document.querySelector('.modal_day');
const modalStar = document.querySelector('.modal_star');
const modalBtn = document.querySelector('#close_btn');

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
  window.scrollTo({ top: 0, behavior: 'smooth' });
  //검색창 리셋
  searchInput.value = '';
  //더보기 버튼 활성화
  moreBtn.style.display = 'block';
};

init();

//---HEADER IMG SLIDE---
//이미지슬라이드 변수
const imgSlideWrap = document.querySelector('#imgslide_wrap');
const loadingTitle = document.querySelector('#loading_title');
const slideBtns = document.querySelector('#button_wrap');
const slidePlayBtn = document.querySelector('#play_btn');
const slideInfoBtn = document.querySelector('#info_btn');

//이미지슬라이드 로직: setTimeOut 3초 뒤 이미지 전환
//랜덤 이미지 생성
const makeRandomData = async function () {
  //현재 상영작 데이터 fetch
  let nowPlayingUrl =
    'https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1';
  const data = await fetchMovies(nowPlayingUrl);

  //랜덤 데이터 이미지주소 반환
  let randomData = data[Math.floor(Math.random() * data.length)];
  return randomData;
};

//슬라이드 버튼 클릭 이벤트 : 아직 준비가 되지 않았다는 알람창 띄우기
const alertNotYet = function () {
  alert('아직 영화가 준비되지 않았습니다!');
};

slidePlayBtn.addEventListener('click', alertNotYet);
slideInfoBtn.addEventListener('click', alertNotYet);

//로딩 타이틀
setTimeout(() => {
  loadingTitle.style.transition = 'opacity 0.3s';
  loadingTitle.style.opacity = '0';
}, 3000);

//3초마다 이미지 바뀜
setInterval(async function () {
  //랜덤 데이터 - 제목+이미지 불러오기
  let randomData = await makeRandomData();

  let randomImg = randomData.backdrop_path;
  let randomTitle = randomData.title;

  //텍스트 요소 생성
  let randomImgTitle = document.querySelector('.random_title');
  if (!randomImgTitle) {
    randomImgTitle = document.createElement('h1');
    randomImgTitle.setAttribute('class', 'random_title');
    imgSlideWrap.appendChild(randomImgTitle);
  }
  randomImgTitle.innerText = randomTitle;

  //랜덤 이미지 유효하면 bg-img로 넣기 / 없으면 로딩타이틀 넣기
  const newImgUrl = randomImg
    ? `https://image.tmdb.org/t/p/w1280${randomImg}`
    : loadingTitle;

  //new Image() 생성자로 새로운 이미지 미리 로드하기
  const imgLoader = new Image();
  imgLoader.src = newImgUrl;

  imgLoader.onload = function () {
    // 로드가 완료되면 배경 이미지 업데이트 및 전환
    imgSlideWrap.style.transition = 'opacity 0.3s';
    imgSlideWrap.style.opacity = '0';
    randomImgTitle.style.transition = 'opacity 0.3s';
    randomImgTitle.style.opacity = '0';
  };
  setTimeout(function () {
    imgSlideWrap.style.backgroundImage = `url(${newImgUrl})`;
    imgSlideWrap.style.opacity = '1';
    randomImgTitle.style.opacity = '1';
    //버튼도 등장!
    slideBtns.style.transition = 'opacity 0.3s';
    slideBtns.style.opacity = '1';
  }, 300);
}, 4300);

// //실패!
// setInterval(async function () {
//   imgSlideWrap.style.opacity = '0';
//   imgSlideWrap.style.transition = 'opacity 0.3s';

//   let randomImg = await makeRandomImg();

//   imgSlideWrap.style.backgroundImage = https://image.tmdb.org/t/p/w1200${randomImg};
//   setTimeout(async function () {
//     imgSlideWrap.style.opacity = '1';
//   }, 3000);
// }, 3000);

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

    //더보기 버튼 활성화
    moreBtn.style.display = 'block';
    //메인화면 상단으로 이동
    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
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
    const star = '⭑'.repeat(count);

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
    `;

    movieCardWrap.appendChild(movieCard);

    // 클릭 - 모달 이벤트 추가
    movieCard.addEventListener('click', () => {
      activeModal(movieCard);
      closeModal(movieCard);
    });
  });
};

('https://image.tmdb.org/t/p/w500${posterImg}');

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
  //해당 데이터 렌더링
  await filterSearch(searchValue);

  //검색창 비우기
  searchInput.value = '';
  //메인화면 상단으로 이동
  window.scrollTo({ top: headerHeight, behavior: 'smooth' });
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

    //해당 데이터 렌더링
    await filterSearch(searchValue);

    //검색창 비우기
    searchInput.value = '';
    //메인화면 상단으로 이동
    window.scrollTo({ top: headerHeight, behavior: 'smooth' });
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
