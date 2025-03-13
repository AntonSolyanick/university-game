import { data } from "./assets/data";
import plusIconPath from "./assets/plus-icon.svg";
import maleIconPath from "./assets/male.png";
import femaleIconPath from "./assets/female.png";

const modal = document.getElementById("modal");
const ratingBlock = document.getElementById("ratingBlock");
const closeButton = document.getElementById("closeButton");
const ratingButton = document.getElementById("ratingButton");

function hideRatingBlock() {
  ratingBlock.classList.remove("show-rating-block");
  modal.classList.add("hide");
}
function showRatingBlock() {
  ratingBlock.classList.add("show-rating-block");
  modal.classList.remove("hide");
}

function chooseUserImagePath(initialPath) {
  let userImagePath = femaleIconPath;
  if (initialPath === "./male.png") userImagePath = maleIconPath;
  return userImagePath;
}

modal.addEventListener("click", hideRatingBlock);
closeButton.addEventListener("click", hideRatingBlock);
ratingButton.addEventListener("click", showRatingBlock);

//--------------------------------MOVE-STUDENT----------------------------------

const OFFSET_X = 2;
const OFFSET_Y = 64;
let currentStudentPosition = 1;
const sortedRatingList = data.rating.sort((a, b) => b.points - a.points);

window.addEventListener("load", () => {
  const mainSVG = document.getElementById("student-and-dots");
  const student = mainSVG.contentDocument.querySelector("#student");
  const dots = mainSVG.contentDocument.querySelector("#dots");
  const dotsTotalCount = dots.children.length;

  const moveStudent = () => {
    if (currentStudentPosition === dotsTotalCount) {
      alert("Победа! Обновите страницу для перезапуска игры.");
      return;
    }
    currentStudentPosition++;

    const currentDot = dots.querySelector(
      `use[href="#img${currentStudentPosition - 1}"]`
    );
    const destinationDot = dots.querySelector(
      `use[href="#img${currentStudentPosition}"]`
    );

    const currentX = currentDot.getBBox().x - OFFSET_X;
    const currentY = currentDot.getBBox().y - OFFSET_Y;
    const destinationX = destinationDot.getBBox().x - OFFSET_X;
    const destinationY = destinationDot.getBBox().y - OFFSET_Y;

    if (destinationX === currentX || destinationY === currentY) {
      moveStudent();
      return;
    }

    const duration = 350;
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const newX = currentX + (destinationX - currentX) * progress;
      const newY = currentY + (destinationY - currentY) * progress;
      student.setAttribute("x", newX);
      student.setAttribute("y", newY);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  };

  const buttonInUniversity = document.getElementById("inUniversity");
  buttonInUniversity.addEventListener("click", moveStudent);

  const ratingTable = document.getElementById("ratingTable");

  const friends = [...data.friends];

  const html = sortedRatingList.map((user, i) => {
    let userImagePath = chooseUserImagePath(user.img);

    const isFriend = friends.some((friend) => friend.id === user.id);
    return ` <li class="rating-table-raw ${isFriend && "highlighted"}">
<div class="column-1">${i + 1}</div>
<div class="column-2">
<img src="${userImagePath}" alt="user image"  class="user-image-small">
<span class="column-2-text">${user.name} ${user.lastName}<span/></div>
<div class="column-3">${user.points}</div>
</li>`;
  });

  html.unshift(
    `<li class="rating-table-head">
                  <div class="column-1">Место</div>
                  <div class="column-2" style="margin-left: 60px;">Имя Фамилия</div>
                  <div class="column-3">Опыт</div>
              </li>`
  );

  ratingTable.innerHTML = html.join("");
});

//---------------FRIENDS-BLOCK-CAROUSEL-------------------

let currentSlide = 0;
const friendsCarouselItems = document.getElementById("friendsCarouselItems");
const leftButtonCarousel = document.getElementById("leftButtonCarousel");
const rightButtonCarousel = document.getElementById("rightButtonCarousel");
const friendsCarouselItemsHTML = [...data.rating]
  .map((item) => {
    let userImagePath = chooseUserImagePath(item.img);

    return `<div class="carousel-item">
    <img class="carousel-user-image" src="${userImagePath}" alt="user image">
    <img  class="carousel-plus-icon" src="${plusIconPath}" alt="plus icon" >
    </div>
    `;
  })
  .join("");
friendsCarouselItems.innerHTML = friendsCarouselItemsHTML;

function moveCarousel(direction) {
  const carouselItems = document.querySelectorAll(".carousel-item");
  const totalSlides = sortedRatingList.length;

  if (currentSlide + 8 >= totalSlides && direction > 0) return;
  if (currentSlide <= 0 && direction < 0) return;

  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  carouselItems.forEach((item) => {
    item.style.transform = `translateX(-${currentSlide * 100 + 1}%)`;
  });
}

rightButtonCarousel.addEventListener("click", () => moveCarousel(1));
leftButtonCarousel.addEventListener("click", () => moveCarousel(-1));
