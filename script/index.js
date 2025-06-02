// console.log("Index connected.")
const showLoader = () => {
    document.getElementById('loader').classList.remove("hidden");
    document.getElementById('video-container').classList.add("hidden");
};
const hideLoader = () => {
    document.getElementById('loader').classList.add("hidden");
    document.getElementById('video-container').classList.remove("hidden");
};


function removeActiveClass() {
    const activeButtons = document.getElementsByClassName("active");
    for (let btn of activeButtons) {
        btn.classList.remove("active");
    }
}

function loadCategories() {
    // ftech the data
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
        .then((response) => response.json())
        .then((data) => displayCategories(data.categories));
}

// video display

function loadVideos(searchText="") {
    showLoader()
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
        .then((response) => response.json())
        .then((data) => {
            removeActiveClass()
            const activeButton = document.getElementById("btn-all");
            activeButton.classList.add("active");
            displayVideos(data.videos)
        });
}

function loadCategoryVideos(id) {
    showLoader();
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            removeActiveClass();
            const clickedButton = document.getElementById(`btn-${id}`);
            clickedButton.classList.add("active");
            console.log(clickedButton);
            displayVideos(data.category)
        });
}


// load video details
const loadVideoDetails = (video_id) => {
    console.log(video_id);
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${video_id}
    `;
    fetch(url)
        .then(response => response.json())
        .then((data => displayVideoDetails(data.video)));
};

const displayVideoDetails = (video) => {
    console.log(video);
    document.getElementById('video_details').showModal();

    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML =
        `<div class="card bg-base-100 image-full shadow-sm">
            <figure>
                <img class="w-full h-[150px] object-cover"
                src="${video.thumbnail}"
                alt="video image" />
            </figure>
            <div class="card-body">
                <h2 class="card-title">${video.video_id}</h2>
                <h2 class="card-title">${video.title}</h2>
                <p>${video.description}</p>
            </div>
        </div>
    `
};


// thumbnail
// : 
// "https://i.ibb.co/f9FBQwz/smells.jpg"
// title
// : 
// "Smells Like Teen Spirit"
// video_id
// : 
// "aaad"



function displayCategories(categories) {
    // console.log(categories);
    // get the container
    const categoryContainer = document.getElementById("category-container");

    // loop operation on array of object
    for (let cat of categories) {
        console.log(cat);

        // create element
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML =
            `
        <button id="btn-${cat.category_id}" onclick="loadCategoryVideos(${cat.category_id})" 
        class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white ">${cat.category}</button>
        `;

        // Append div to the category-container
        categoryContainer.appendChild(categoryDiv);
    }
}

loadCategories();


const displayVideos = (videos) => {
    const videoContainer = document.getElementById("video-container");

    videoContainer.innerHTML = "";

    if (videos.length == 0) {
        videoContainer.innerHTML = `
            <div class="col-span-full text-center flex flex-col justify-center items-center py-25">
            <img class="" src="assets/Icon.png" alt="">
            <h2 class="font-bold text-4xl py-10">Oops!! Sorry, There is no content here</h2>
        </div>
        `;
        hideLoader();
        return;
    }

    videos.forEach(video => {
        console.log(video);

        const videoCard = document.createElement("div");

        videoCard.innerHTML =
            `
        <div class="card bg-base-100">
            <figure class="relative">
                <img class="w-full h-[150px] object-cover" src="${video.thumbnail}" alt="image" />
                <span class="absolute bottom-2 right-2 bg-black text-white rounded p-1">3 hrs 56 min ago</span>

            </figure>
            <div class="flex p-5">
                <div class="avatar">
                    <div class="w-24 h-24 rounded-full">
                        <img src="${video.authors[0].profile_picture}" />
                    </div>
                </div>
                <div class="px-3">
                    <h2 class="card-title">${video.title}
                    </h2>
                    <div>
                        <p class="flex text-gray-400 text-sm gap-1">${video.authors[0].profile_name}

                        ${video.authors[0].verified == true ? `<img class="w-5 h-5" src="assets/verified.png" alt="">` : ``}
                        </p>
                    </div>
                    <p class="text-gray-400 text-sm">${video.others.views}</p>
                </div>
            </div>
            <button onclick="loadVideoDetails('${video.video_id}')" class="btn">Video Details</button>
        </div>
        `

        videoContainer.appendChild(videoCard);
    });
    hideLoader();
}

document.getElementById('search-input').addEventListener("keyup",(event)=>{
    const input = event.target.value;
    loadVideos(input);
});