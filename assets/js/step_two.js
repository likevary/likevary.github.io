var div2 = document.getElementsByClassName("item");

function handleClick(event) {
  event.stopPropagation();
  event.preventDefault();

  if (event.target.classList[1] === "clicked") {
    event.target.classList.remove("clicked");
  } else {
    for (var i = 0; i < div2.length; i++) {
      div2[i].classList.remove("clicked");
    }

    event.target.classList.add("clicked");
  }
}

function init() {
  for (var i = 0; i < div2.length; i++) {
    div2[i].addEventListener("click", handleClick);
  }
}

init();

document.addEventListener("DOMContentLoaded", function() {
  let scores = JSON.parse(localStorage.getItem("scores"));
  const nextBtn = document.querySelector('#btn-next');
  const prevBtn = document.querySelector('#btn-prev');

  localStorage.setItem("prevScores", JSON.stringify(scores));
  
  function setScore(type) {
    switch (type) {
      case "01":
        scores.type7.push(2);
        scores.type8.push(2);
        break;
      case "02":
        scores.type3.push(1);
        scores.type4.push(1);
        scores.type5.push(1);
        scores.type6.push(2);
        break;
      case "03":
        scores.type5.push(1);
        scores.type6.push(1);
        break;
      case "04":
        scores.type2.push(1);
        scores.type3.push(1);
        scores.type4.push(1);
        scores.type5.push(1);
        scores.type6.push(1);
        break;
      
      default:
        break;
    }
  }

  nextBtn.addEventListener('click', async function() {
    const target = document.querySelector('.clicked');
    const { type } = target.dataset;
      
    await setScore(type);
    await localStorage.setItem("scores", JSON.stringify(scores));
    window.location.href = '/test/step/three';
  });

  prevBtn.addEventListener('click', async function() {
    window.location.href = '/';
  });
});