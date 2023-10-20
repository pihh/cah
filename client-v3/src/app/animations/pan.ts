
const types: any = {
  answer: {
    lastPanY: 'lastAnswerPanY',
    isSelected: 'isAnswerSelected',
    isPan: 'isAnswerPan',
    selected: 'selectedAnswer',
    chosen: 'chosenAnswer',
    lastDeltaY: "lastAnswerDeltaY",
    can: "canAnswer",
    discard: "onDiscardAnswer",
    confirm: "onConfirmAnswer",
    translate: "getAnswerTranslate",
    panLimit: 200,
    confirmAction: "answer"
  }, vote: {
    lastPanY: 'lastVotePanY',
    isSelected: 'isVoteSelected',
    isPan: 'isVotePan',
    selected: 'selectedVote',
    chosen: 'chosenVote',
    lastDeltaY: "lastVoteDeltaY",
    can: "canVote",
    discard: "onDiscardVote",
    confirm: "onConfirmVote",
    translate: "getVoteTranslate",
    panLimit: 100,
    confirmAction: "vote"
  }
}
export const onPanStart = (controller: any, type: string, $event: any, i: any) => {
  let keys = types[type]
  if (!$event.additionalEvent || ['panleft', 'panright'].indexOf($event.additionalEvent) > -1) return;
  if (controller[keys.lastPanY] == -keys.panLimit && $event.additionalEvent == "pandown" && controller[keys.isSelected]) {
    controller[keys.isPan] = false;
    controller[keys.isSelected] = false;
  }
  if (controller[keys.isPan] || controller[keys.isSelected] || ['panleft', 'panright'].indexOf($event.additionalEvent) > -1) return;

  controller[keys.isPan] = true;
  if (controller[keys.selected] === i) {
    controller[keys.lastDeltaY] = $event.deltaY
  } else {
    controller[keys.selected] = i
    controller[keys.lastPanY] = $event.deltaY
    controller[keys.lastDeltaY] = $event.deltaY
  }

}
export const onPanMove = (controller: any, type: string, $event: any) => {
  let keys = types[type]
  if (!controller[keys.isPan] || controller[keys.isSelected]) return;
  if (!$event.additionalEvent || ['panleft', 'panright'].indexOf($event.additionalEvent) > -1) return;
  // console.log('panMove',$event)

  controller[keys.lastPanY] += ($event.deltaY - controller[keys.lastDeltaY])
  controller[keys.lastDeltaY] = $event.deltaY
  controller[keys.lastPanY] = Math.min(0, Math.max(-keys.panLimit, controller[keys.lastPanY]))
}
export const onPanEnd = async (controller: any, type: string, $event: any) => {
  let keys = types[type]
  // console.clear()
  // console.log('panEnd', {keys, can: controller[keys.can],isPan:controller[keys.isPan], isSelected:controller[keys.isSelected],lastPanY:controller[keys.lastPanY],isTransitioning:controller.isTransitioning} )
  if (!controller[keys.isPan] || controller[keys.isSelected]) return;
  // console.log('here ???')
  controller[keys.isPan] = false
  if (controller[keys.lastPanY] < -keys.panLimit/2 && controller[keys.can]) {
    controller.isTransitioning = true;
    await controller.wait(1)
    controller[keys.lastPanY] = -keys.panLimit
    controller.controls = false;
    await controller.wait(200)
    controller.isTransitioning = false;
    controller[keys.isSelected] = true;
    controller.controls = true;

  } else {
    // console.log('WILL DISCARD',keys.discard)
    controller[keys.discard]()

  }
}
export const onSwipe = (controller: any, type: string, $event: any) => {
  let keys = types[type]
  if (!controller[keys.isSelected]) return;
  controller.controls = false
  if ($event.overallVelocityY > 0) {
    controller[keys.discard]()
  } else {
    controller[keys.confirm]()
  }
}

export const getTranslate = (controller:any, type:string, i:any)=>{
  let keys = types[type]

  if (controller[keys.selected]  == i) {
    return `${controller[keys.lastPanY] }px`
  } else {
    return '0px'
  }
}

export const getCardVisibility = (controller:any, type:string,i:any)=>{
  let keys = types[type]
  if(controller[keys.chosen] == i){
    return true
  }else{
    return false
  }
}


export const onDiscard = async (controller:any, type:string)=>{
  console.log('onDiscard',type)
  let keys = types[type]
  controller.isTransitioning = true;
  await controller.wait(1)
  controller[keys.lastPanY] = 0
  await controller.wait(200)
  controller[keys.isSelected] = false;
  controller[keys.selected] = -1
  controller.controls = true;
  controller.isTransitioning = false;
}

export const onConfirm = async (controller:any, type:string) => {
  let keys = types[type]
     // console.log('chosed vote')
    // this.chosenVote = this.selectedVote;
    // this.canVote = false;
    // // this.isAnswerSelected = false;
    // this.isVoteSelected = false
    // this.selectedVote = -1
    // await this.wait(1000)
    // this.pageResultsEnter()
    // //this.pageAnswerEnter()

    controller[keys.can] = false;
    controller.isTransitioning = true;
    await controller.wait(1)
    controller[keys.lastPanY] -= 1000
    await controller.wait(200)
    controller.isTransitioning = false
    controller[keys.isSelected] = false;
    controller.controls = true;
    controller[keys.chosen] = controller[keys.selected]

    controller.wait(1000);
    controller.gameService[keys.confirmAction](controller[keys.selected])

}
