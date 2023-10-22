export const pageResultsEnter = async (controller:any)=> {
  controller.pageVoteLeave()
  controller.isResultsShowing = true;
  await controller.wait(1)
  controller.isResultsEntering = true;
  await controller.wait(2000)

  controller.isResultsEntered = true;

  setTimeout(() => {

    try {
      var msg = new SpeechSynthesisUtterance();
      var voices = window.speechSynthesis.getVoices();
      msg.voice = voices[4];
      msg.volume = 1; // From 0 to 1
      msg.rate = 1; // From 0.1 to 10
      msg.pitch = 1; // From 0 to 2
      msg.text = controller.episodeQuestion;
      msg.lang = 'en';
      speechSynthesis.speak(msg);
      setTimeout(() => {

        try {
          var msg = new SpeechSynthesisUtterance();
          var voices = window.speechSynthesis.getVoices();
          msg.voice = voices[5];
          msg.volume = 1; // From 0 to 1
          msg.rate = 1; // From 0.1 to 10
          msg.pitch = 1; // From 0 to 2
          msg.text = controller.episodeAnswer;
          msg.lang = 'en';
          speechSynthesis.speak(msg);
        } catch (ex) {

        }
      }, 500)
    } catch (ex) {

    }
  }, 500)

  await controller.wait(4000)
  controller.isResultsEntered = false;
  controller.pageResultsLeave()
}

export const pageResultsLeave = async  (controller:any)=> {


  await controller.wait(1)
  controller.isResultsLeaving = true;
  await controller.wait(2500)
  // controller.pageAnswerEnter()
  controller.isResultsShowing = false;
  await controller.wait(1)

  controller.isResultsEntering = false;
  controller.isResultsLeaving = false;
}
