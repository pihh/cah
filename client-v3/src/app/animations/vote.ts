export const animationPageVoteEnter = async function(controller:any){

    controller.gameState = "enter-page-vote";
    controller.controls = false
    controller.canVote = true;
    controller.selectedVote = -1
    controller.chosenVote = -1
    controller.isVoteSelected = false


    await controller.wait(1)
    controller.pageMessage = false;

    await controller.pageAnswerLeave();

    controller.voteListSlider.nativeElement.scrollLeft = 0;

    // Show vote list
    await controller.wait(1)
    controller.voteHidden = false;

    // Do cards animation
    controller.voteListCardsAnimation = true;

    // Slide the list
    await controller.wait(2250);

    controller.voteListSlider.nativeElement.scrollTo({
      left: 1000000,
      behavior: 'smooth',
    })
    await controller.wait(1000);

    controller.controls = true
    controller.gameState = "page-vote"
    controller.headerMessage = "Select the best answer."
    //controller.isAnswerSelected = true;
    controller.pageMessage = "Vote"


}

export const animationPageVoteLeave = async (controller:any)=>{
  controller.isVotePageLeaving = true;
  await controller.wait(1)
  controller.voteListSlider.nativeElement.scrollTo({
    left: 0,
    behavior: 'smooth',
  })
  await controller.wait(2000)
  // controller.gameState = "";
  await controller.wait(1)
  controller.isVotePageLeaving = false;
}
