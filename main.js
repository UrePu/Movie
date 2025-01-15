//---API---
const api_token =
  

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${api_token}`,
  },
};

//---DOM ELEMENTS---
//url 관련 변수
let urlDetail = "";
let pageNum = 1;
//홈화면 변수
const homeLogo = document.querySelector("#home_logo");
const movieCardWrap = document.querySelector("#movie_card_wrap");
//네비 변수
const naviLis = document.querySelectorAll("#navi > li");
//더보기 변수
const moreBtn = document.querySelector("#more_btn");
//검색창 변수
const searchInput = document.querySelector("#search_input");
const searchBtn = document.querySelector("#searchBtn");
const headerHeight = document.querySelector("header").offsetHeight;
//모달창 변수
const modalLayer = document.querySelector("#modal_wrap");
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector(".modal_title");
const modalInfo = document.querySelector(".modal_info");
const modalDay = document.querySelector(".modal_day");
const modalStar = document.querySelector(".modal_star");
const modalBtn = document.querySelector("#close_btn");

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
    console.error("error data", err);
  }
};

//---INIT---
// 초기 렌더링 및 검색 기능 실행
const init = async function (urlDetail, pageNum) {
  //url 주소 리셋
  urlDetail = "popular";
  pageNum = 1;

  let url = `https://api.themoviedb.org/3/movie/${urlDetail}?language=ko-KR&page=${pageNum}`;

  //기존 카드 제거
  movieCardWrap.innerHTML = "";
  //영화 렌더링
  const movieData = await fetchMovies(url);
  renderMovie(movieData);

  //popular 활성화 + 다른 네비 비활성화
  naviLis.forEach(function (li) {
    li.classList.remove("activeNavi");
  });
  popular.classList.add("activeNavi");

  //화면 상단으로 올리기
  window.scrollTo({ top: 0, behavior: "smooth" });
  //검색창 리셋
  searchInput.value = "";
  //더보기 버튼 활성화
  moreBtn.style.display = "block";
};

init();

//---HEADER IMG SLIDE---
//이미지슬라이드 변수
const imgSlideWrap = document.querySelector("#imgslide_wrap");
const loadingTitle = document.querySelector("#loading_title");
const slideBtns = document.querySelector("#button_wrap");
const slidePlayBtn = document.querySelector("#play_btn");
const slideInfoBtn = document.querySelector("#info_btn");

//이미지슬라이드 로직: setTimeOut 3초 뒤 이미지 전환
//랜덤 이미지 생성
const makeRandomData = async function () {
  //현재 상영작 데이터 fetch
  let nowPlayingUrl =
    "https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1";
  const data = await fetchMovies(nowPlayingUrl);

  //랜덤 데이터 이미지주소 반환
  let randomData = data[Math.floor(Math.random() * data.length)];
  return randomData;
};

//슬라이드 버튼 클릭 이벤트 : 아직 준비가 되지 않았다는 알람창 띄우기
const alertNotYet = function () {
  alert("아직 영화가 준비되지 않았습니다!");
};

slidePlayBtn.addEventListener("click", alertNotYet);
slideInfoBtn.addEventListener("click", alertNotYet);

//로딩 타이틀
setTimeout(() => {
  loadingTitle.style.transition = "opacity 0.3s";
  loadingTitle.style.opacity = "0";
}, 3000);

//3초마다 이미지 바뀜
setInterval(async function () {
  //랜덤 데이터 - 제목+이미지 불러오기
  let randomData = await makeRandomData();

  let randomImg = randomData.backdrop_path;
  let randomTitle = randomData.title;

  //텍스트 요소 생성
  let randomImgTitle = document.querySelector(".random_title");
  if (!randomImgTitle) {
    randomImgTitle = document.createElement("h1");
    randomImgTitle.setAttribute("class", "random_title");
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
    imgSlideWrap.style.transition = "opacity 0.3s";
    imgSlideWrap.style.opacity = "0";
    randomImgTitle.style.transition = "opacity 0.3s";
    randomImgTitle.style.opacity = "0";
  };
  setTimeout(function () {
    imgSlideWrap.style.backgroundImage = `url(${newImgUrl})`;
    imgSlideWrap.style.opacity = "1";
    randomImgTitle.style.opacity = "1";
    //버튼도 등장!
    slideBtns.style.transition = "opacity 0.3s";
    slideBtns.style.opacity = "1";
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
homeLogo.addEventListener("click", init);

//---NAVI---
//navi 누르면 해당 영화목록 렌더링
naviLis.forEach(async function (naviLi) {
  naviLi.addEventListener("click", async function () {
    //기존 활성화된 active 제거
    naviLis.forEach(function (li) {
      li.classList.remove("activeNavi");
    });
    //기존 활성화된 pageNum 리셋
    pageNum = 1;

    //li 클릭시 active 부여
    if (!naviLi.classList.contains("activeNavi")) {
      naviLi.classList.add("activeNavi");
    }

    //해당 url로 설정해서 데이터 fetch하는 로직
    let naviUrl = `https://api.themoviedb.org/3/movie/${naviLi.id}?language=ko-KR&page=${pageNum}`;
    const naviData = await fetchMovies(naviUrl);
    //기존 카드 제거 후 해당 데이터로 다시 렌더링
    movieCardWrap.innerHTML = "";
    renderMovie(naviData);

    //더보기 버튼 활성화
    moreBtn.style.display = "block";
    //메인화면 상단으로 이동
    window.scrollTo({ top: headerHeight, behavior: "smooth" });
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
    const id = movie.id;

    // 별점 계산
    const count = Math.floor(rate / 2) + (rate % 2 !== 0 ? 1 : 0);
    const star = "⭑".repeat(count);

    // 영화 카드 생성
    const movieCard = document.createElement("li");

    // 영화 카드에 속성 추가
    movieCard.setAttribute("class", "movie_card");
    movieCard.setAttribute("data-id", id);
    movieCard.setAttribute("data-title", title);
    movieCard.setAttribute("data-poster", posterImg);
    movieCard.setAttribute("data-info", info);
    movieCard.setAttribute("data-release", releaseDate);
    movieCard.setAttribute("data-star", star);
    movieCard.setAttribute("data-image", bgImg);

    // 영화 카드에 내용 넣기
    movieCard.innerHTML = `
      <img src='https://image.tmdb.org/t/p/w500${posterImg}' alt='${title} image'>
    `;

    movieCardWrap.appendChild(movieCard);

    // 클릭 - 모달 이벤트 실행
    movieCard.addEventListener("click", () => {
      activeModal(movieCard);
      closeModal(movieCard);
    });
    return movieCard;
  });
};

//---SEARCH---
//검색창 이벤트 : 검색창에 영화 타이틀을 검색하면 해당 카드만 보이도록 정렬
//키워드 해당 데이터로 필터링하는 함수
const filterSearch = async function () {
  //더보기 버튼 삭제
  moreBtn.style.display = "none";

  //search data 렌더링하기
  const searchValue = searchInput.value.trim();
  let data = await searchMovie(searchValue);

  //검색 결과 필터링
  const filteredMovies = data.filter((movie) =>
    movie.title.includes(searchValue)
  );

  //기존 카드 제거
  movieCardWrap.innerHTML = "";
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
searchBtn.addEventListener("click", async function (event) {
  const searchValue = searchInput.value.trim();
  if (searchValue === "") {
    alert("검색어를 입력해주세요!");
    return;
  }
  //해당 데이터 렌더링
  await filterSearch(searchValue);

  //검색창 비우기
  searchInput.value = "";
  //메인화면 상단으로 이동
  window.scrollTo({ top: headerHeight, behavior: "smooth" });
});

//enter키 누를시 해당 영화 필터링
searchInput.addEventListener("keypress", async function (event) {
  const searchValue = searchInput.value.trim();
  if (event.key === "Enter") {
    event.preventDefault();

    if (searchValue === "") {
      alert("검색어를 입력해주세요!");
      return;
    }

    //해당 데이터 렌더링
    await filterSearch(searchValue);

    //검색창 비우기
    searchInput.value = "";
    //메인화면 상단으로 이동
    window.scrollTo({ top: headerHeight, behavior: "smooth" });
  }
});

//---MODAL---
//모달 이벤트 : 해당 카드를 클릭하면 영화 상세정보 모달창 팝업
//모달창 활성화 함수
let selectedCard;
const activeModal = function (movieCard) {
  //모달창에 카드 속성 가져오기
  selectedCard = movieCard;
  const posterImg = movieCard.getAttribute("data-poster");
  const title = movieCard.getAttribute("data-title");
  const info = movieCard.getAttribute("data-info");
  const releaseDate = movieCard.getAttribute("data-release");
  const star = movieCard.getAttribute("data-star");
  const bgImg = movieCard.getAttribute("data-image");

  if (!posterImg || !title || !info || !releaseDate || !star || !bgImg) {
    console.error("Missing data for modal!");
    alert("아직 해당 영화의 정보가 업로드 되지 않았습니다!");
    return;
  }

  //모달창에 데이터 반영
  modal.style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280${bgImg})`;
  // modalTitle.innerText = title;
  // modalInfo.innerText = info;
  // modalDay.innerText = releaseDate;
  // modalStar.innerText = star;

  const details = [title, info, releaseDate, star];

  let modalDetails = document.querySelectorAll(".modal_detail");
  modalDetails.forEach((detail, idx) => {
    detail.innerText = details[idx];
  });

  //모달창 활성화
  modalLayer.classList.add("activeModal");

  //버튼 상태 확인 및 스타일 변경
  const addBookmarkBtn = document.querySelector("#add_bookmark_btn");

  //모달창 북마크 추가 버튼 이벤트 : 북마크 버튼 클릭시 해당 데이터를 로컬스토리지 북마크에 저장

  // addBookmarkBtn.addEventListener("click", handleBookmark);
  // addBookmarkBtn.removeEventListener('click', handleBookmark);

  const bookmarked = isBookmarked(movieCard);
  if (!bookmarked) {
    addBookmarkBtn.style.backgroundImage = `url(./images/bookmark_white.png)`;
    addBookmarkBtn.style.opacity = "0.5";
  } else {
    addBookmarkBtn.style.backgroundImage = `url(./images/fullheart_yellow.png)`;
    addBookmarkBtn.style.opacity = "1";
  }
};

//모달창 북마크 리스너
const addBookmark = () => {
  let bookBtn = document.querySelector("#add_bookmark_btn");

  bookBtn.addEventListener("click", (e) => {
    if (selectedCard) {
      addToBookmark(selectedCard);
    }
  });
};
addBookmark();
//모달창 비활성화 함수
const closeModal = function (movieCard) {
  modalBtn.addEventListener("click", () => {
    //모달창 비활성화
    modalLayer.classList.remove("activeModal");
  });
};

//---MORE MOVIE---
//영화더보기 이벤트 : 더보기 버튼 클릭하면 페이지 1장씩 추가
//각 카테고리 안에서 개별적으로 적용!
//페이지 추가 함수
async function addPage(activeLi, pageNum) {
  let addedUrl = `https://api.themoviedb.org/3/movie/${activeLi}?language=ko-KR&page=${pageNum}`;

  //영화 렌더링
  const addData = await fetchMovies(addedUrl);
  renderMovie(addData);
}

//더보기 버튼 클릭 이벤트
moreBtn.addEventListener("click", () => {
  const activeLi = document.querySelector(".activeNavi").id;
  pageNum++;
  addPage(activeLi, pageNum);
});

//---BOOKMARK---
//북마크 이벤트 : 하트로 추가 / 북마크 버튼으로 목록 확인 / 북마크 페이지에서 삭제 가능
//모달창 : 하트를 클릭하면 북마크에 추가
//서치바 : 북마크 버튼을 클릭하면 북마크에 추가된 리스트 볼 수 있음
//북마크 페이지 : 삭제 기능 구현

//북마크 변수
const bookmarkBtn = document.querySelector("#bookmark_btn");

//movieCard에 있는 dataset 속성을 객체로 묶어 반환하는 함수 : 로컬스토리지에 넣기 위한 작업
const getMovieDataFromCard = function (movieCard) {
  return {
    id: movieCard.getAttribute("data-id"),
    title: movieCard.getAttribute("data-title"),
    poster: movieCard.getAttribute("data-poster"),
    info: movieCard.getAttribute("data-info"),
    releaseDate: movieCard.getAttribute("data-release"),
    star: movieCard.getAttribute("data-star"),
    bgImg: movieCard.getAttribute("data-image"),
  };
};

const isBookmarked = function (movieCard) {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const movieData = getMovieDataFromCard(movieCard);

  return bookmarks.some((item) => item.id === movieData.title);
};

//북마크 추가 함수 : 로컬 스토리지에 저장
const addToBookmark = function (movieCard) {
  const addBookmarkBtn = document.querySelector("#add_bookmark_btn");

  //기존 로컬 스토리지에 저장된 북마크 데이터 불러오기
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
  const movieData = getMovieDataFromCard(movieCard);
  // console.log('moviecard', movieCard);

  if (!movieData) return console.error("addbookmark에서 movieData 안불러짐");

  //movieCard의 타이틀로 비교 >> 기존에 없으면 북마크배열에 추가 / 있으면 알람창 띄우기
  const alreadyBookmarkedIdx = bookmarks.findIndex(
    (item) => item.id === movieData.id
  );

  // addBookmarkBtn.removeEventListener("click", handleBookmark);

  if (alreadyBookmarkedIdx === -1) {
    //로컬스토리지에 저장
    bookmarks.push(movieData);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert("북마크에 추가되었습니다!");

    // //버튼 이미지 (노란색 하트)업데이트
    // addBookmarkBtn.style.backgroundImage = `url(./images/fullheart_yellow.png)`;
    // addBookmarkBtn.style.opacity = '1';
  } else {
    bookmarks.splice(alreadyBookmarkedIdx, 1);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    alert("북마크에서 영화가 삭제 되었습니다!");

    // // 버튼 이미지 (흰색 빈 하트) 업데이트
    // addBookmarkBtn.style.backgroundImage = `url(./images/bookmark_white.png)`;
    // addBookmarkBtn.style.opacity = '0.7';
  }
};

//북마크 렌더링 함수
const renderBookmarks = function () {
  //로컬 스토리지에 저장된 북마크 데이터 불러오기
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

  //북마크 목록이 없다면 메세지 띄우기
  if (bookmarks.length === 0) {
    bookmarkContainer.innerHTML = "<p>아직 관심있는 영화가 없으시군요!</p>";
    return;
  }
  console.log(bookmarks);
  //북마크된 영화 렌더링하기
  renderMovie(bookmarks);
};

bookmarkBtn.addEventListener("click", () => {
  //기존 영화 카드 지워주기
  movieCardWrap.innerHTML = ``;

  //북마크된 영화 렌더링
  renderBookmarks();
});
