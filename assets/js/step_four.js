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
  let scores = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  const nextBtn = document.querySelector('#btn-next');
  const prevBtn = document.querySelector('#btn-prev');

  localStorage.setItem("scores4", JSON.stringify(scores));
  
  function setScore(type) {
    switch (type) {
      case "01":
        scores[2] = 2;
        scores[3] = 2;
        scores[4] = 2;
        break;
      case "02":
        scores[2] = 1;
        scores[3] = 1;
        scores[4] = 1;
        break;
      case "03":
        scores[0] = 1;
        scores[1] = 1;
        scores[5] = 1;
        scores[6] = 1;
        scores[7] = 1;
        break;
      
      default:
        break;
    }
  }

  nextBtn.addEventListener('click', async function() {
    const target = document.querySelector('.clicked');
    const { type } = target.dataset;
      
    await setScore(type);
    await localStorage.setItem("scores4", JSON.stringify(scores));
    window.location.href = '/test/step/five';
  });

  prevBtn.addEventListener('click', async function() {
    window.location.href = '/test/step/three';
  });
});