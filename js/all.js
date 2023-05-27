$(document).ready(function () {
    $(".category-link").click(function(e){
        e.preventDefault();
        $(this).addClass("active");
        $(".category-link").not($(this)).removeClass("active");
    });

    $(".page-link-toggle").click(function(e){
        e.preventDefault();
        $(this).addClass("active");
        $(".page-link-toggle").not($(this)).removeClass("active");
    });
    
    $(".back-to-top").click(function(){
        $("html,body").animate({scrollTop:0},600);
    });
});

const swiper = new Swiper(".swiper" , {
    autoplay: true,
    fadeEffect: {
        crossFade: true,
    },
    pagination: {
        el: ".swiper-pagination",
        bulletClass : "swiper-pagination-bullet",
        bulletActiveClass: "swiper-pagination-bullet-active",
        clickable :true,
    },
    breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
    }
})
