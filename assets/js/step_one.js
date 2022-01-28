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
  let scores = {
      type1: [],
      type2: [],
      type3: [],
      type4: [],
      type5: [],
      type6: [],
      type7: [],
      type8: [],
      type9: [],
  }
  const nextBtn = document.querySelector('#btn-next');
  
  function setScore(type) {
      switch (type) {
          case "01":
              scores.type1.push(1);
              break;
          case "02":
              scores.type1.push(1);
              break;
          case "03":
              scores.type1.push(1);
              break;
          case "04":
              scores.type2.push(1);
              scores.type7.push(1);
              scores.type8.push(1);
              scores.type9.push(1);
              break;
          case "05":
              scores.type2.push(1);
              scores.type7.push(1);
              scores.type8.push(1);
              scores.type9.push(1);
              break;
          case "06":
              scores.type2.push(1);
              scores.type7.push(1);
              scores.type8.push(1);
              scores.type9.push(1);
              break;
          case "07":
              scores.type2.push(1);
              scores.type7.push(1);
              scores.type8.push(1);
              scores.type9.push(1);
              break;
      
          default:
              break;
      }
  }

  nextBtn.addEventListener('click', async function(e) {
      // let { type } = e.target.dataset;
      const target = document.querySelector('.clicked');
      const { type } = target.dataset;
      
      await setScore(type);
      await localStorage.setItem("scores", JSON.stringify(scores));
      // window.location.href = 'step2.html';
  });
});