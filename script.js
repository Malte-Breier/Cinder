//Generating Image List
//Define total number of Images
const totalImages = 38; //Adjustable to match the total number of images in Folder

//Generate Image Paths
const images = [];
for (let i = 0; i < totalImages; i++) {
    const filename = i.toString().padStart(5, '0') + '.png'; //Pad the Number to 5 Digits
    images.push('cats/' + filename); // Add to te images array
}

// Randomize image order
let currentImages = [...images];
currentImages = currentImages.sort(() => Math.random () - 0.5); // Shuffle Array

let likedCats = JSON.parse(localStorage.getItem ('likedCats')) || [];
let dislikedCats = JSON.parse(localStorage.getItem('dislikedCats')) || [];

//Elements
const catImage = document.getElementById("catImage");
const likeButton = document.getElementById("likeButton");
const dislikeButton = document.getElementById("dislikeButton");
const modeToggle = document.getElementById("modeToggle");
const statusMessage = document.getElementById("statusMessage");

// Function to load next image
function loadNextImage() {
    if (currentImages.length === 0) {
        statusMessage.innerText = "You swiped all Cats! More coming soon. :)";
        likeButton.disabled = true
        dislikeButton.disabled = true
        document.getElementById('resetButton').style.display = 'inline-block';
    } else {
        const nextImage = currentImages.pop();
        catImage.src = nextImage;
        catImage.classList.remove('pop-in'); //restart animation
        void catImage.offsetWidth; //force reflow
        catImage.classList.add('pop-in');
    }
}

// Handle Like button
likeButton.addEventListener('click', () => {
    const currentCat = catImage.src.split('/').pop();
    localStorage.setItem('likedCats', JSON.stringify(likedCats));
    loadNextImage();
});

// Handle Dislike Button
dislikeButton.addEventListener('click', () => {
    const currentCat = catImage.src.split('/').pop();
    dislikedCats.push(currentCat);
    localStorage.setItem('dislikedCats', JSON.stringify(dislikedCats));
    loadNextImage();
});

// Toggle light/dark mode
modeToggle.addEventListener('click', () => {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        modeToggle.innerText = "Switch to Light Mode";
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        modeToggle.innerText = "Switch to Dark Mode";
    }
});

let startX = 0;
let isDragging = false;

function handleSwipe(diffX) {
    if (diffX > 100) {
        // Swipe Right → Like
        catImage.classList.add('swipe-right');
        setTimeout(() => {
            catImage.classList.remove('swipe-right');
            likeButton.click();
        }, 300);
    } else if (diffX < -100) {
        // Swipe Left → Dislike
        catImage.classList.add('swipe-left');
        setTimeout(() => {
            catImage.classList.remove('swipe-left');
            dislikeButton.click();
        }, 300);
    }
}

// MOUSE SUPPORT
catImage.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isDragging = true;
});

document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    handleSwipe(diffX);
    isDragging = false;
});

// TOUCH SUPPORT
catImage.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

catImage.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diffX = e.changedTouches[0].clientX - startX;
    handleSwipe(diffX);
    isDragging = false;
});


loadNextImage();

//Rest Button Handler
document.getElementById('resetButton').addEventListener('click', () => {
    //Clear saved dat in memory
    likedCats = [];
    dislikedCats = [];

    // clear from LocalStorage
    localStorage.removeItem('likedCats');
    localStorage.removeItem('dislikedCats');

    //Shuffle and reset ui + load next image
    currentImages = [...images].sort(() => Math.random() - 0.5); //shuffle again
    likeButton.disabled = false;
    dislikeButton.disabled = false;
    statusMessage.innerText = "";
    document.getElementById('resetButton').style.display = 'none';
    loadNextImage();
})