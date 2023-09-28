// @ts-nocheck
export default function (gsap: any, Draggable: any, picker: any, parent: any) {
  // var picker = document.querySelector('.picker');
  var cells = document.querySelectorAll('.cell');
  var proxy = document.createElement('div');

  var cellWidth = 225;
  var rotation = -90;

  var numCells = cells.length;
  var cellStep = 1 / numCells;
  var wrapWidth = (cellWidth * numCells) / 2;
  var wrapIndex = gsap.utils.wrap(0, cells.length);


  var baseTl = gsap.timeline({ paused: true });

  gsap.set(picker, {
    perspective: 1100,
    width: wrapWidth - cellWidth,
  });

  for (var i = 0; i < cells.length; i++) {
    initCell(cells[i], i);
  }

  let distance = 1;
  let easeInArray = [];
  let lastDistance = distance;
  for (let i = 0; i < 20; i++) {
    lastDistance = lastDistance / 1.2;
    easeInArray.push(lastDistance);
  }

  easeInArray = easeInArray.sort();
  easeInArray.push(1);

  let cardIndex = 4;
  parent.cardIndex = 4;
  var animation = gsap
    .timeline({ repeat: -1, paused: true })
    .add(baseTl.tweenFromTo(1, 2))
    .progress(1);

  var draggable = new Draggable(proxy, {
    allowContextMenu: true,
    type: 'x',
    trigger: picker,
    inertia: true,
    //   edgeResistance: 0.65,

    snap: {
      x: function (x: any) {
        return Math.round(x / cellWidth) * cellWidth;
      },
    },
    onDrag: updateProgress,
    onThrowUpdate: updateProgress,

    onDragEnd: function () {
      const i = wrapIndex((-this.endX / wrapWidth) * cells.length - 5);
    },
  });

  function snapX(x) {
    return Math.round(x / cellWidth) * cellWidth;
  }

  function updateProgress() {
    let prevCardIndex = cardIndex;
    let i = wrapIndex((-this.x / wrapWidth) * cells.length - 5) - 1;
    i = Math.round(Math.min(Math.max(0, i), 9));
    cardIndex = i;
    parent.cardIndex = cardIndex;
    if (cardIndex != prevCardIndex) {
      console.log('cardIndex changed', prevCardIndex, cardIndex);

    }
    let newProg = this.x / wrapWidth;
    newProg = newProg - Math.floor(newProg);
    animation.progress(newProg);
  }

  function initCell(element, index) {
    // console.log(element, index)
    gsap.set(element, {
      width: cellWidth,
      scale: 0.9,
      opacity: 0.5,
      rotation: rotation,
      x: -cellWidth,
    });

    var tl = gsap
      .timeline({ repeat: 1 })
      .to(element, 1, { x: '+=' + wrapWidth, rotation: -rotation }, 0)
      .to(
        element,
        cellStep,
        { scale: 1, opacity: 1, repeat: 1, yoyo: true },
        0.5 - cellStep
      );

    baseTl.add(tl, index * -cellStep);

    var touchstartY = 0;
    var touchendY  = 0;
    var touching = false;

    // var elements = [...document.querySelectorAll('.game-player-card')];
    var elements = [document.querySelector('.main')];
    var cards = [...document.querySelectorAll('.game-player-card')];

    for (let card of cards) {
      card.setAttribute('total-diff', 0);
    }
    let selectedCard = 0;

    function isTouchDevice() {
      return (('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0) ||
         (navigator.msMaxTouchPoints > 0));
    }
    let touchstart = "mousedown";
    let touchend = "mouseup";
    let touchmove = "mousemove";
    let isTouch = false
    if(isTouchDevice()){
      touchstart = "touchstart";
      touchend = "touchend";
      touchmove = "touchmove";
      isTouch = true
    }



    // element.addEventListener(
    //   touchstart,
    //   function (event) {
    //     touchstartX = event.screenX;
    //     touchstartY = event.screenY;
    //   },
    //   false
    // );

    // element.addEventListener(
    //   'touchend',
    //   function (event) {
    //     touchendX = event.screenX;
    //     touchendY = event.screenY;
    //     handleGesure();
    //   },
    //   false
    // );

    let lastTranslateY = 0;
    element.addEventListener(
      touchstart,
      function (event) {

        // touchstartX = event.screenX;
        selectedCard = cardIndex;
        touching = true;
        if(isTouch){
          touchstartY = event.touches[0].screenY
        }else{
          touchstartY = event.screenY;

        }
        lastTranslateY = touchstartY;
        let card = cards[selectedCard];
        card.style.transition = '';
      },
      false
    );

    element.addEventListener(
      touchmove,
      function (event) {
        // touchendX = event.screenX;
        if (touching) {

          if(isTouch){
            touchendY = event.touches[0].screenY
          }else{
            touchendY = event.screenY;

          }

          let diff = lastTranslateY - touchendY;

          lastTranslateY = touchendY;
          // console.log({ diff });

          let card = cards[selectedCard];

          let newDiff = Math.max(
            0,
            Math.min(parseInt(card.getAttribute('total-diff')) + diff, 150)
          );

          card.setAttribute('total-diff', newDiff);
          card.style.marginTop = -card.getAttribute('total-diff') + 'px';
        }
        //handleGesure();
      },
      false
    );
    element.addEventListener(
      touchend,
      function (event) {
        // touchendX = event.screenX;
        let card = cards[selectedCard];
        if (cardIndex != selectedCard) {
          card.setAttribute('total-diff', 0);
          card.style.transition = 'margin 300ms';
          card.style.marginTop = -card.getAttribute('total-diff') + 'px';
          card.classList.remove('selectable');
        } else {
          card.classList.add('selectable');
        }

        touching = false;

        if(isTouch){
          touchendY = event.touches[0].screenY
        }else{
          touchendY = event.screenY;

        }
        handleGesure();

      },
      false
    );
  }

  function handleMove() {}

  function handleGesure() {
    var swiped = 'swiped: ';
    /*
    // if (touchendX < touchstartX) {
    //     alert(swiped + 'left!');
    // }
    // if (touchendX > touchstartX) {
    //     alert(swiped + 'right!');
    // }

    let diff = Math.abs(touchendY - touchstartY);
    if (touchendY < touchstartY) {
      // alert(swiped + 'up!'+diff);
    }
    if (touchendY > touchstartY) {
      // alert(swiped + 'down!'+diff);
    }
    // if (touchendY == touchstartY) {
    //     alert('tap!');
    // }
    */
  }
}
