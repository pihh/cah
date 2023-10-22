export const animationPageAnswerEnter = async function (controller: any) {

  controller.gameState = "enter-page-answer";
  controller.controls = false
  controller.lastAnswerPanY = 0
  controller.lastDeltaY = 0;



  controller.voteHidden = true
  controller.handHidden = false;
  controller.isAnswerSelected = false;
  controller.canAnswer = true;
  controller.selectedAnswer = -1
  controller.chosenAnswer = -1
  controller.pageMessage = false;


  controller.isAnswerSelected = false;
  await controller.wait(1)
  controller.playerHandSlider.nativeElement.scrollLeft = 10000000000

  await controller.wait(1000)
  controller.playerHandSlider.nativeElement.scrollTo({
    left: 0,
    behavior: 'smooth',
  })
  await controller.wait(1000)


  controller.controls = true;
  controller.isTransitioning = false;

  controller.gameState = "page-answer"
  controller.headerMessage = "Swipe up."
  controller.isInitialized = true
  controller.pageMessage = "Answer"

  setTimeout(() => {

    try {
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[5];
      msg.volume = 1; // From 0 to 1
      msg.rate = 1; // From 0.1 to 10
      msg.pitch = 1; // From 0 to 2
      msg.text = controller.gameService.game.episode.question.text;
      msg.lang = 'en';
      speechSynthesis.speak(msg);
    } catch (ex) {

    }
  }, 500)

}

export const animationPageAnswerLeave = async (controller: any) => {
  controller.playerHandSlider.nativeElement.scrollTo({
    left: 1000000,
    behavior: 'smooth',
  })
  await controller.wait(500)
  controller.handHidden = true;
}


