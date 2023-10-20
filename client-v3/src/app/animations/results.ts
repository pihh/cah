export const pageResultsEnter = async (controller:any)=> {
  controller.pageVoteLeave()
  controller.isResultsShowing = true;
  await controller.wait(1)
  controller.isResultsEntering = true;
  await controller.wait(2000)

  controller.isResultsEntered = true;

  await controller.wait(3000)
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
