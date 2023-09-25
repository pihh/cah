class Player {
  hand = [];
  score = 0;
  active = true;
  canAnswer = true;
  canVote = true;
  id = "";
  uuid = "";
  name="";

  constructor(id,name,socketId) {
    this.id = id
    this.uuid = id
    this.name = name;
    this.socketId = socketId
    //this.id = id;
  }

  draw(card) {
    this.hand.push(card);
  }

  reset() {
    this.hand = [];
    this.score = 0;
  }

  answer(handId) {
    if(this.canAnswer){
        this.canAnswer = false
        //console.log(this.hand.length)
        return this.hand.splice(handId, 1)[0];
    }
    return false
  }

  vote() {
    if(this.canVote){
        this.canVote = false
        //console.log(this.hand.length)
        //return this.hand.splice(handId, 1)[0];
        return true
    }
    return false
  }
}

module.exports = Player;
