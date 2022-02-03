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

  localStorage.setItem("scores7", JSON.stringify(scores));
  
  function setScore(type) {
    switch (type) {
      case "01":
        scores[5] = 2;
        scores[6] = 2;
        scores[7] = 2;
        break;
      case "02":
        scores[4] = 1;
        scores[5] = 1;
        scores[6] = 1;
        break;
    
      default:
        break;
    }
  }

  nextBtn.addEventListener('click', async function() {
    const target = document.querySelector('.clicked');
    const { type } = target.dataset;
      
    await setScore(type);
    await localStorage.setItem("scores7", JSON.stringify(scores));
    window.location.href = '/result';
  });

  prevBtn.addEventListener('click', async function() {
    window.location.href = '/test/step/six';
  });
});