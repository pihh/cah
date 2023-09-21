import "./style.scss";
import Glide from "@glidejs/glide";

//new Glide('.glide').mount()
/*
class GameClient{
    
    get $hand(){
        return document.querySelector('#cards-hand');
    }
    get $cards(){
        try{
            return [... this.$hand.querySelectorAll('.card-answer')]
        }catch(e){
            return []
        }
    }
    constructor(){
        this.draw()
    }

    draw(){
        const len = this.$cards.length
        for (let i = len; i < 10; i++){
            const $card = document.createElement('div')
            $card.classList.add('card-answer')
            this.$hand.appendChild($card)
        }
    }

}

	/**
	 *
	 *  Page Annuaire - Carousel circulaire handcrafted
	 *
	 *
	function infiniteCarousel (containerId, carouselId, activeKeyboard) {
		this.containerId = containerId;
		this.carouselId = carouselId;
		this.activeKeyboard = activeKeyboard || false;
		this.selected = $(this.carouselId + ' .selected');

		// Gère le deplacement des items par ajout de classes
		this.moveToSelected = function (element) {

			// Permet d'eviter bug si on clique plus d'une dizaine de fois sur une lettre présente sur un bord en limitant le deplacement à 1x1 lettre
			if (typeof element == 'object') {
				if(element.hasClass('nextRightSecond') || element.hasClass('next')){
					element = 'next';
				}	else if(element.hasClass('prevLeftSecond') || element.hasClass('prev') )	{
					element = 'prev';
				}	else {
					var selected = element;
				}
			}

			if(typeof element == 'string') {
				if (element == 'next') {
					var selected = $(this.carouselId + ' .selected').next();
				} else if (element == 'prev') {
					var selected = $(this.carouselId + ' .selected').prev();
				}
			}

			// Changement d'element selectionné en fonction de la direction


			// On reattribut les classes sur les elements pour créer l'effet de slide
			var next = $(selected).next();
			var prev = $(selected).prev();
			var prevSecond = $(prev).prev();
			var nextSecond = $(next).next();

			$(selected).removeClass().addClass('selected');

			$(prev).removeClass().addClass('prev');
			$(next).removeClass().addClass('next');

			$(nextSecond).removeClass().addClass('nextRightSecond');
			$(prevSecond).removeClass().addClass('prevLeftSecond');

			$(nextSecond).nextAll().removeClass().addClass('hideRight');
			$(prevSecond).prevAll().removeClass().addClass('hideLeft');

			// Si on va vers la droite, on prend la premiere lettre de la liste et on l'ajoute a la fin de la liste
			if(element == 'next'){
				var htmlToAppend = $(this.carouselId + ' > div:first-child');
				$(this.carouselId).append(htmlToAppend);
				$(this.carouselId + ' > div:last-child').removeClass().addClass('hideRight');
			}

			// Si on va vers la gauche, on prend la derniere lettre de la liste et on l'ajoute au debut de la liste
			if(element == 'prev'){
				var htmlToAppend = $(this.carouselId + ' > div:last-child');
				$(this.carouselId).prepend(htmlToAppend);
				$(this.carouselId + ' > div:first-child').removeClass().addClass('hideLeft');
			}

			// Met à jour element ciblé et lance une fonction traitement Ajax
			this.selected = $(selected);
			this.doAjaxRequest();

		},

			// Possibilité d'insérer du contenu dans la grille en recuperant les données à aller chercher via requete Ajax
			this.doAjaxRequest = function()	{

				var ajaxUrl = this.selected.data('ajax-url');
				// Simule requete Ajax (visuel cosmétique uniquement)
				$('.awk-liste-marques').removeClass('visible');
				setTimeout(function(){
					$('.awk-liste-marques').addClass('visible');
				}, 300);

			},

			// Initialiser les evenements
			this.initEvents = function () {
				var that = this;

				// Events clavier | Permet de naviguer dans le carousel au clavier
				if(this.activeKeyboard){
					$(document).keydown(function(e) {
						switch(e.which) {
							case 37: // left
								that.moveToSelected('prev');
								break;
							case 39: // right
								that.moveToSelected('next');
								break;
							default: return;
						}
						e.preventDefault();
					});
				}

				// Events mouse | Clic sur une lettre, on centre la lettre
				$(this.carouselId + ' div').click(function() {
					that.moveToSelected($(this));
				});

				// Clic sur precedent
				$(this.containerId + ' .awk-prev').click(function() {
					that.moveToSelected('prev');
				});

				// Clic sur suivant
				$(this.containerId + ' .awk-next').click(function() {
					that.moveToSelected('next');
				});
			},
			// Initialiser le carousel
			this.init = function () {
				this.moveToSelected();
				this.initEvents();
			}
	};



let $Game;
(function(){
    $Game = new GameClient()


	/*  Code du slider réutilisable en créant une nouvelle instance, avec des arguments différents   *
	var carouselAlphabet = new infiniteCarousel('#awk-carousel-container', '#awk-circular-carousel', true);
	carouselAlphabet.init();
})()

<button class="glide__bullet" data-glide-dir="=0"></button>
*/
(function () {
  /*
  const $hand = document.getElementById("player-hand-cards");
  const $handControls = document.getElementById("player-hand-bullets");
  for (let i = 0; i < 10; i++) {
    const $card = document.createElement("li");
    $card.classList.add("glide__slide");
    $card.classList.add("player-card");
    $card.innerHTML = i;
    $hand.appendChild($card);

    const $bullet = document.createElement("button");
    $bullet.classList.add("glide__bullet");
    $bullet.setAttribute("data-glide-dir", "=" + i);
    $handControls.appendChild($bullet);
  }
  const glide = new Glide(".glide", {
    type: "carousel",
    startAt: 0,
    focusAt: "center",
    perView: 3,
  });


  glide.on(['mount.before', 'run'], function(e) {
    // Handler logic ...
    console.log('eh',e, glide)
  })

  glide.mount();
  //new Glide('.glide').mount()
  */
  /*
  function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };
  let x0 = null;

  function lock(e) { x0 = unify(e).clientX };

  let i = 0;

  function move(e) {
    if(x0 || x0 === 0) {
      let dx = unify(e).clientX - x0, s = Math.sign(dx);
      console.log(dx)
      //if((i > 0 || s < 0) && (i < N - 1 || s > 0))
      //  _C.style.setProperty('--i', i -= s);
      
      x0 = null
    }
  };

  const $hand = document.getElementById("player-hand");
  $hand.addEventListener("mousedown", lock, false);
  $hand.addEventListener("touchstart", lock, false);

  $hand.addEventListener("mouseup", move, false);
  $hand.addEventListener("touchend", move, false);
  */
 const $handButtonMid = document.querySelector('.player-hand-controls__mid');
 const $handButtonLeft = document.querySelector('.player-hand-controls__left');
 const $handButtonRight = document.querySelector('.player-hand-controls__right');

 function nextCard(){

 }

 function prevCard(){}


})();

