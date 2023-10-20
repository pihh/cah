export const CARD = {
  QUESTION: {
    "id": 508,
    "cardType": "Q",
    "text": "While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on _.",
    "numAnswers": 1,
    "expansion": "Base"
  }, ANSWERS: [
    {
      "id": 1197,
      "cardType": "A",
      "text": "Indescribable loneliness.",
      "numAnswers": 0,
      "expansion": "CAHe3"
    },
    {
      "id": 330,
      "cardType": "A",
      "text": "Foreskin.",
      "numAnswers": 0,
      "expansion": "Base"
    },
    {
      "id": 625,
      "cardType": "A",
      "text": "Being a busy adult with many important things to do.",
      "numAnswers": 0,
      "expansion": "CAHe1"
    },
    {
      "id": 331,
      "cardType": "A",
      "text": "Free samples.",
      "numAnswers": 0,
      "expansion": "Base"
    },
    {
      "id": 90,
      "cardType": "A",
      "text": "Swooping.",
      "numAnswers": 0,
      "expansion": "Base"
    },
    {
      "id": 953,
      "cardType": "A",
      "text": "Homura sniffing Madoka's panties.",
      "numAnswers": 0,
      "expansion": "CAHweeaboo"
    },
    {
      "id": 137,
      "cardType": "A",
      "text": "Michael Jackson.",
      "numAnswers": 0,
      "expansion": "Base"
    },
    {
      "id": 798,
      "cardType": "A",
      "text": "Bearded dwarven women.",
      "numAnswers": 0,
      "expansion": "CAHgrognards"
    },
    {
      "id": 254,
      "cardType": "A",
      "text": "BATMAN!!!",
      "numAnswers": 0,
      "expansion": "Base"
    },
    {
      "id": 839,
      "cardType": "A",
      "text": "Grinding levels.",
      "numAnswers": 0,
      "expansion": "CAHgrognards"
    },
    // {
    //   "id": 708,
    //   "cardType": "A",
    //   "text": "Boris the Soviet Love Hammer.",
    //   "numAnswers": 0,
    //   "expansion": "CAHe2"
    // }
  ]
}

export const PLAYER = {
  "game": "cd5f9153-aeeb-460d-a5d8-84b5d03375f0",
  "score": 0,
  "hand": CARD.ANSWERS,
  "canAnswer": true,
  "canVote": true,
  "socketId": "n0-zyxDwhP3mzmtxAAAB",
  "uuid": "9d1d4a55-f91e-40d8-9847-5831c6b3a06d1695806992404",
  "username": "prime_magenta_shark",
  "online": true,
  "firstConnection": true,
  "update": "draw"
}

export const GAME = {
  "eventName": "player-joined",
  "episode": {
    "question": CARD.QUESTION,
    "answers": [],
    "complete": false,
    "player_answers": [],
    "player_votes": [],
    "timeout":120,
    "result": {
      "state": "winner",
      "winner": {},
      "question": {},
      "answer": {},
      "votes": 0
    },
    "state": "answer"
  },
  "eventUuid": "abdb8e00-ff4d-44c4-b2bc-c42190191f61",
  "history": [],
  "lastEpisodeResult": {},
  "players": [
    PLAYER
  ]
}
