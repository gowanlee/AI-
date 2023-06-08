// swiper
const swiper = new Swiper(".swiper" , {
    autoplay: true,
    pagination: {
        el: ".swiper-pagination",
        bulletClass : "swiper-pagination-bullet",
        bulletActiveClass: "swiper-pagination-bullet-active",
        clickable :true,
    },
    breakpoints: {
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 20
        }
    }
})

// back to top
const backToTop = document.querySelector(".back-to-top");
backToTop.addEventListener("click",e => {
    e.preventDefault();
    window. scrollTo(0,0);
})

// data api
const apiPath = "https://2023-engineer-camp.zeabur.app";
const data = {
    type: "",
    sort: 0,
    page: 1,
    search: ""
}

let worksData = [];
let pagesData = {};

// 串接API取得資料
function getData({type,sort,page,search}) {
    const apiUrl = `${apiPath}/api/v1/works?${type ? `type=${type}&`: "" }&sort=${sort}&page=${page}&${search ? `search=${search}&` : ""}`;

    axios.get(apiUrl)
        .then(res => {
            worksData = res.data.ai_works.data;
            pagesData = res.data.ai_works.page;

            getCategoryData();
            renderWorksData();
            renderPagination();
            changeSort();
            searchKeyword();
        })
        .catch(error => {
            console.log(error);
        }) 
}
getData(data);

// 資料渲染至畫面
function renderWorksData() {
    const productsCard = document.querySelector(".productsCard");
    let products = "";

    worksData.forEach(item => {
        products += /* html */
        `<li class="col-md-6 col-lg-4">
            <div class="card h-100">
                <div class="overflow-hidden"><img src="${item.imageUrl}" class="card-img-top" alt="${item.title}"></div>
                <div class="card-body px-8 py-5 border-bottom border-gray-200">
                    <h4 class="card-title text-black fw-bolder mb-3">${item.title}</h4>
                    <p class="card-text text-gray-dark fs-sm lh-base">${item.description}</p>
                </div>
                <div class="px-8 py-5 d-flex justify-content-between text-black border-bottom border-gray-200"> 
                    <h5 class="fw-bold">${item.model}</h5>
                    <p>${item.discordId}</p>
                </div>
                <div class="px-8 py-5 d-flex justify-content-between text-black">
                    <h6>#${item.type}</h6>
                    <a target="_blank" class="stretched-link" href="${item.link}"><span class="material-icons text-black">share</span></a>
                </div>
            </div>
        </li>`
    })
    productsCard.innerHTML = products;
}

// pagination渲染至畫面
function renderPagination() {
    const pagination = document.querySelector(".pagination");

    const preBtn = /* html */ `<li class="page-item"><a data-page="pre" class="page-link fs-sm fw-bold lh-base" href="#"><span class="material-icons fs-sm fw-bold align-middle">keyboard_arrow_left</span></a>
    </li>`;
    const nextBtn = /* html */ `<li class="page-item"><a data-page="next" class="page-link fs-sm fw-bold lh-base" href="#"><span class="material-icons fs-sm fw-bold align-middle">keyboard_arrow_right</span></a></li>`;

    let str = "";
    for(let i=0; i<pagesData.total_pages; i++) {
        str+= /* html */
        `<li class="page-item">
            <a data-page="${i+1}" class="page-link fs-sm fw-bold lh-base ${pagesData.current_page == i+1 ? "active" : ""}" href="#">${i+1}</a>
        </li>`
    }

    pagination.innerHTML = `${pagesData.has_pre ? preBtn : ""} ${str} ${pagesData.has_next ? nextBtn : ""}`;

    changePage();
}

// 切換分頁
function changePage() {
    const pageLinks = document.querySelectorAll(".page-link");
    let page = "";

    pageLinks.forEach(item => {
        item.addEventListener("click",e => {
            e.preventDefault();
            page = e.target.dataset.page;

            if (!(isNaN(Number(page)))) {
                data.page = Number(page);
            }
            if (page === "pre") {
                data.page = Number(pagesData.current_page) - 1;
            }
            if (page === "next") {
                console.log(pagesData.current_page + 1);
                data.page = Number(pagesData.current_page) + 1;
            }

            getData(data);
        })
    })
}

// 切換作品順序
function changeSort() {
    const btnSort = document.querySelector(".btnSort");
    const btnSortText = document.querySelector(".btnSortText");

    btnSort.addEventListener("click" , e => {
        e.preventDefault();
        
        if (e.target.textContent === "由新到舊") {
            data.sort = 0;
            data.page = 1;
            btnSortText.textContent = "由新到舊";
        }
        if (e.target.textContent === "由舊到新") {
            data.sort = 1;
            data.page = 1;
            btnSortText.textContent = "由舊到新";
        }

        getData(data);
    })
}

let categoryType = new Set();

// 取得分類
function getCategoryData() {
    let pages = [];
    for (let i=0; i<pagesData.total_pages; i++) {
        pages[i] = i+1;
    }

    // 創建一個初始的已解决 Promise
    let promiseChain = Promise.resolve();

    pages.forEach(page => {
        promiseChain = promiseChain.then(() => {
            const apiUrl = `${apiPath}/api/v1/works?page=${page}`;
            return axios.get(apiUrl);
        }).then(res => {
            res.data.ai_works.data.forEach(item => {
                categoryType.add(item.type);
            })
        })
    })

    promiseChain.then(() => {
        renderCategoryType();
    })
}

const category = document.querySelector(".category");
const filter = document.querySelector(".filter");

// 渲染分類至畫面
function renderCategoryType() {
    const categoryAll = /* html */ `<li><a href="#" class="lh-base link-gray text-nowrap d-block py-2 px-4 category-link ${data.type === "" ? "active" : ""}">全部</a></li>`;

    const filterHeader = /* html */ `<li><a class="dropdown-header py-2 px-10 d-block fw-bold fs-12 text-gray pt-4" href="#">類型</a></li>`;
    const filterCategoryAll = /* html */ `<li><a class="dropdown-item px-10 d-block lh-base" href="#">所有類型</a></li>`;

    let categoryStr = "";
    let filterStr = "";

    categoryType.forEach(item => {
        categoryStr += /* html */ `<li><a href="#" class="lh-base link-gray text-nowrap d-block py-2 px-4 category-link ${data.type === item ? "active" : ""}">${item}</a></li>`;

        filterStr += /* html */ `<li><a class="dropdown-item px-10 d-block lh-base" href="#">${item}</a></li>`;
    })


    category.innerHTML = categoryAll + categoryStr;
    filter.innerHTML = filterHeader + filterCategoryAll + filterStr;

    changeCategory();
}

// 切換分類
function changeCategory() {
    category.addEventListener("click", e => {
        e.preventDefault();
        if (e.target.textContent === "全部") {
            data.type = "";
        } 
        else {
            data.type = e.target.textContent;
        }
        getData(data);
    })

    filter.addEventListener("click", e => {
        e.preventDefault();
        if (e.target.textContent === "所有類型") {
            data.type = "";
        }
        else {
            data.type = e.target.textContent
        }
        getData(data);
    })
}

// 關鍵字搜尋
function searchKeyword() {
    const search = document.querySelector("input[type='search']");
    search.addEventListener("keydown" , e => {
        // keyCode 13 is enter
        if (e.keyCode === 13) {
            console.log(e.target.value);
            data.search = e.target.value;
            data.page = 1;
            getData(data);
        }
    })
}