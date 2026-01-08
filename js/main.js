$(function () {
  $('a').click(function (e) {
    if ($(this).attr('href') === '#') {
      e.preventDefault();
    }
  })

  let heroSwiperLength = $(".hero-slide").children().length;
  let roomSwiperTop = $(".room-swiper").offset().top;
  let eventSwiperTop = $(".event-swiper").offset().top;
  let behindUlTop = $("section.behind .behinds").offset().top;
  let footerTop = $("footer").offset().top;
  let windowHeight = $(window).height();

  $(window).scroll(function () {
    let curScroll = $(window).scrollTop();
    let windowBottom = curScroll + windowHeight;

    if (curScroll >= eventSwiperTop - 170) {
      $("main").addClass("dark");
    } else {
      $("main").removeClass("dark");
    }
    if (windowBottom >= behindUlTop) {
      $("main").removeClass("dark");
    }

    if (windowBottom >= roomSwiperTop) {
      $(".go-top").addClass("active");
    } else {
      $(".go-top").removeClass("active");
    }

    if (windowBottom >= footerTop) {
      $(".go-top").addClass("bottom");
    } else {
      $(".go-top").removeClass("bottom");
    }
  })

  // header
  $(".select-lan").click(function () {
    $(this).toggleClass("on");
  })
  $(".select-lan ul li").click(function () {
    $(".select-lan ul li").removeClass("selected");
    $(this).addClass("selected");
    const newLan = $(this).text();
    $(".select-lan span").text(newLan);
  })

  $(".header-icon.search").click(function () {
    $(this).find("svg").addClass("clicked");
    $(".search-popup").addClass("open");
  })

  $(".header-icon.share").click(function () {
    $(this).find("svg").toggleClass("clicked");
    $(this).find("ul").toggleClass("open");
  })

  $(".search-popup .close-popup").click(function () {
    $(".header-icon.search svg").removeClass("clicked");
    $(".search-popup").removeClass("open");
  })

  // room, item swiper 커서
  let isCursorChange = false;
  $(".room-swiper").mouseenter(function () {
    $(".custom-cursor").addClass("active");
    isCursorChange = true;
  })
  $(".room-swiper").mouseleave(function () {
    $(".custom-cursor").removeClass("active");
    isCursorChange = false;
  })
  $(".item-swiper").mouseenter(function () {
    $(".custom-cursor").addClass("active");
    isCursorChange = true;
  })
  $(".item-swiper").mouseleave(function () {
    $(".custom-cursor").removeClass("active");
    isCursorChange = false;
  })

  $(window).mousemove(function (e) {
    if (isCursorChange) {
      $(".custom-cursor").css({
        "transform": `translate(${e.clientX}px, ${e.clientY}px)`
      })
    }
  })

  // hero
  const prevIndexes = [0, 2, 0, 1];
  const curIndexes = [0, 0, 1, 2];
  const nextIndexes = [0, 1, 2, 0];

  let heroCurNum = 1;
  let heroInterval = null;

  function getNum(num) {
    return num < 10 ? '0' + num : num;
  }

  function moveToPrevSlide(prevI, curI, curN) {
    $(".hero-control .progress .cur-num").text(getNum(curN));
    $("section.hero .section-title h2").eq(curI).hide();
    $("section.hero .section-title h2").eq(prevI).show();
    $("section.hero .hero-slide img").eq(curI).fadeOut(750);
    $("section.hero .hero-slide img").eq(prevI).fadeIn(750);
    resetHeroSlideAutoplay();
  }

  function moveToNextSlide(nextI, curI, curN) {
    $(".hero-control .progress .cur-num").text(getNum(curN));
    $("section.hero .section-title h2").eq(curI).hide();
    $("section.hero .section-title h2").eq(nextI).show();
    $("section.hero .hero-slide img").eq(curI).fadeOut(750);
    $("section.hero .hero-slide img").eq(nextI).fadeIn(750);
    resetHeroSlideAutoplay();
  }

  function startHeroSlideAutoplay() {
    heroInterval = setInterval(function () {
      const curI = curIndexes[heroCurNum];
      const nextI = nextIndexes[heroCurNum];
      heroCurNum = (heroCurNum % heroSwiperLength) + 1;
      moveToNextSlide(nextI, curI, heroCurNum);
    }, 5000);
  }

  function resetHeroSlideProgressBar() {
    const $bar = $("section.hero .hero-control .progress .progress-bar > span");
    $bar.css({
      "animation": "none",
    });

    // 강제 reflow
    $bar[0].offsetHeight;

    $bar.css({
      "animation": "progressBar 5s linear infinite",
    })
  }

  function resetHeroSlideAutoplay() {
    clearInterval(heroInterval);
    resetHeroSlideProgressBar();
    startHeroSlideAutoplay();
  }

  startHeroSlideAutoplay();
  resetHeroSlideProgressBar();

  $(".hero-control .progress .last-num").text(getNum(heroSwiperLength));

  $("section.hero i.fa-arrow-left").click(function () {
    const prevI = prevIndexes[heroCurNum];
    const curI = curIndexes[heroCurNum];
    heroCurNum = ((heroCurNum + 1) % heroSwiperLength) + 1;
    moveToPrevSlide(prevI, curI, heroCurNum);
  })

  $("section.hero i.fa-arrow-right").click(function () {
    const curI = curIndexes[heroCurNum];
    const nextI = nextIndexes[heroCurNum];
    heroCurNum = (heroCurNum % heroSwiperLength) + 1;
    moveToNextSlide(nextI, curI, heroCurNum);
  })

  let startX = 0;
  let isDragging = false;

  $(".hero-slide")
    .on("dragstart", e => e.preventDefault())
    .on("mousedown", function (e) {
      startX = e.pageX;
      isDragging = true;
    });

  $(".hero-slide").on("mouseup", function (e) {
    if (!isDragging) return;

    const endX = e.pageX;
    const diffX = endX - startX;

    if (Math.abs(diffX) > 150) {
      const prevI = prevIndexes[heroCurNum];
      const curI = curIndexes[heroCurNum];
      const nextI = nextIndexes[heroCurNum];

      if (diffX > 0) {
        // 이전 슬라이드 불러오기
        heroCurNum = ((heroCurNum + 1) % heroSwiperLength) + 1;
        moveToPrevSlide(prevI, curI, heroCurNum);
      } else {
        // 다음 슬라이드 불러오기
        heroCurNum = (heroCurNum % heroSwiperLength) + 1;
        moveToNextSlide(nextI, curI, heroCurNum);
      }
    }

    isDragging = false;
  });
  /*
  */

  // event
  $("section.event .pagination a").click(function () {
    const i = $(this).index();
    $('.event-pagination .swiper-pagination-bullet').eq(i).trigger('click');
    $("section.event .pagination a").removeClass("selected");
    $(this).addClass("selected");
  })

  // 자동 슬라이드시 탭에 on 클래스 추가/제거
  window.updateItemPagination = (i) => {
    $("section.event .pagination a").removeClass("selected");
    $("section.event .pagination a").eq(i).addClass("selected");
  }

  // behind
  function getImageDeg() {
    // -20 ~ 20 사이의 랜덤한 정수
    return Math.floor(Math.random() * 41) - 20;
  }

  $(".behinds ul li").mouseenter(function () {
    const i = $(this).index();
    const deg = getImageDeg();

    $(".behind-img img").removeClass("active");
    $(".behind-img img").eq(i).addClass("active");

    $(".behind-img img").eq(i).css({
      transform: `rotate(${deg}deg)`,
    })
  })

  // go top
  $(".go-top").click(() => {
    $("html, body").animate(
      { scrollTop: 0 },
      300,
    );
  })

  // footer
  $("footer .sns ul li a").mouseenter(function () {
    const src = $(this).find("img").attr("src").replace(".svg", "-hover.svg");
    $(this).find("img").attr("src", src);
  })
  $("footer .sns ul li a").mouseleave(function () {
    const src = $(this).find("img").attr("src").replace("-hover.svg", ".svg");
    $(this).find("img").attr("src", src);
  })
})