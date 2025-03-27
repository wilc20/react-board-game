const defaultGameState = {
    turn: 0,
    stage: 0,
    player1: {
        character: null,
        inventory: [],
        dossier: [],
        motivation: null,
        suspicion: null,
        imprisoned: false,
        location: "Train Station",
        tokenColour: "Red",
    },
    player2: {
        character: null,
        inventory: [],
        dossier: [],
        motivation: null,
        suspicion: null,
        imprisoned: false,
        location: "Train Station",
        tokenColour: "Blue",
    },
    player3: {
        character: null,
        inventory: [],
        dossier: [],
        motivation: null,
        suspicion: null,
        imprisoned: false,
        location: "Train Station",
        tokenColour: "Green",
    },
    player4: {
        character: null,
        inventory: [],
        dossier: [],
        motivation: null,
        suspicion: null,
        imprisoned: false,
        location: "Train Station",
        tokenColour: "Orange",
    },
    militarySupport: 0,
    dissent: 0,


}

export default defaultGameState;