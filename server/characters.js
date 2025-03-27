const characters = {
    'General Ludgwig Beck':{
        name: 'General Ludgwig Beck',
        section: 'WEHRMACHT',
        ability: () => {/* Unaffected by penalties *//* Add a die to a plot attempt in your space */},
        itemLimit: 4,
    },
    'Dietrich Bonhoeffer':{
        name: 'Dietrich Bonhoeffer',
        section: 'ABWEHR',
        ability: () => {/* Raise the motivation of all other conspirators in your space by 1. (Limit once per turn) */},
        itemLimit: 4,
    },
    'Admiral Wilhelm Canaris':{
        name: 'Admiral Wilhelm Canaris',
        section: 'ABWEHR',
        ability: () => {/* Discard an item to lower one conspirator's suspicion by 1 */},
        itemLimit: 4,
    },
    'Carl Goerdeler':{
        name: 'Carl Goerdeler',
        section: 'CIVILIAN',
        ability: () => {/* At the start of your turn, add 3 cards to your dossier. Your dossier limit is increased by 2 */},
        itemLimit: 4,
    },
    'Erich Kordt':{
        name: 'Erich Kordt',
        section: 'CIVILIAN',
        ability: () => {/* Reveal the top three cards of the current stage's event deck and replace them in any order. */},
        itemLimit: 4,
    },
    'General Friedrich Olbricht':{
        name: 'General Friedrich Olbricht',
        section: 'WERMACHT',
        ability: () => {/* Move two spaces.*/ /* Move another conspirator one space */},
        itemLimit: 4,
    },
    'General Hans Oster':{
        name: 'General Hans Oster',
        section: 'ABWEHR',
        ability: () => {/* Reveal the top two cards of the conspirator deck. Add one to your dossier and discard the other.*/},
        itemLimit: 4,
    },
    'Claus Von Stauffenberg':{
        name: 'Claus Von Stauffenberg',
        section: 'WERMACHT',
        ability: () => {/* Take an additional action during your turn */},
        itemLimit: 4,
    },
    'Henning Von Tresckow':{
        name: 'Hening Von Tresckow',
        section: 'WERMACHT',
        ability: () => {/* You can carry one additional item. *//* -> Collect an unrevealed item in your space. */},
        itemLimit: 4,
    }
};

module.exports = characters;