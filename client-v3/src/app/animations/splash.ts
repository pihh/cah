export const animationSplashLeave = async function (controller: any) {


  controller.controls = false;
  // Splash animation paint start
  controller.isSplashHidding = true;
  await controller.wait(1000)

  // Splash transparent + start enter game page
  controller.isSplashHidding = false;
  controller.isSplashHidden = true;
  // controller.pageAnswerEnter()
  await controller.wait(500)

  // Remove splash screen
  controller.isSplashComplete = true

}
