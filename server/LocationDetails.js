const LocationDetails = [
  {
    id: "B",
    zone: "0",
    name: "Train Station",
    neighbours: ["Hannover",  "Prague", "Posen", "Gestapo HQ", "Ministry of Propaganda", "Sportpalast", "Chancellery", "DeutschlandHalle", "Zeughaus", "Nuremberg"],
    lat:36.5,
    lng:44
  },
  {
    id: "GHQ",
    zone: "0",
    name: "Gestapo HQ",
    neighbours: ["Train Station", "Ministry of Propaganda", "Sportpalast", "Chancellery", "DeutschlandHalle", "Zeughaus"],
    textContent: ["-2 Suspicion", "(you only)", "for Intel"],
    lat:14.15,
    lng:28.2,
    itemState: "concealed"
  },
  {
    id: "BSport",
    zone: "0",
    name: "Sportpalast",
    neighbours: ["Train Station", "Gestapo HQ", "Ministry of Propaganda", "Chancellery", "DeutschlandHalle", "Zeughaus"],
    textContent: [
        "-2 Suspicion",
        "(you only)",
        "for Badge",
    ],
    lat:25.45,
    lng:33.8,
    itemState: "concealed"
  },
  {
    id: "BPropa",
    zone: "0",
    name: "Ministry of Propaganda",
    neighbours: ["Train Station", "Gestapo HQ", "Sportpalast", "Chancellery", "DeutschlandHalle", "Zeughaus"],
    textContent: [
        "-2 Suspicion",
        "(you only)",
        "for Signature",
    ],
    lat:36.45,
    lng:24.5,
    itemState: "concealed"
  },
  {
    id: "BChance",
    zone: "0",
    name: "Chancellery",
    neighbours: ["Train Station", "Gestapo HQ", "Ministry of Propaganda", "Sportpalast", "DeutschlandHalle", "Zeughaus"],
    textContent: [
        "-2 Suspicion",
        "(you only)",
        "for Weapons",
    ],
    lat:24.5,
    lng:18.35,
    itemState: "concealed"
  },
  {
    id: "BHalle",
    zone: "0",
    name: "DeutschlandHalle",
    neighbours: ["Train Station", "Gestapo HQ", "Ministry of Propaganda", "Sportpalast", "Chancellery", "Zeughaus"],
    textContent: [
        "-2 Suspicion",
        "(you only)",
        "for Map",
    ],
    lat:10.95,
    lng:13.7,
    itemState: "concealed"
  },
  {
    id: "BZeug",
    zone: "0",
    name: "Zeughaus",
    neighbours: ["Train Station", "Gestapo HQ", "Ministry of Propaganda", "Sportpalast", "Chancellery", "DeutschlandHalle"],
    textContent: [
        "-2 Suspicion",
        "(you only)",
        "for Keys",
    ],
    lat:34.7,
    lng:10.3,
    itemState: "concealed"
  },
  {
    id: "Hann",
    zone: "1",
    name: "Hannover",
    neighbours: ["Train Station", "Adlerhorst"],
    textContent: [
        "If any deputy",
        "is present,",
        "-2 Suspicion",
        "(you only)",
        "for any item",
    ],
    lat:24.2,
    lng:49,
    itemState: "concealed"
  },
  {
    id: "Nurem",
    zone: "1",
    name: "Nuremberg",
    neighbours: ["Train Station", "Adlerhorst", "Prague", "Munich"],
    textContent: [
        "If Hitler is",
        "present,",
        "-2 Suspicion",
        "(you only)",
        "for any item",
    ],
    lat:32.9,
    lng:62.5,
    itemState: "concealed"
  },
  {
    id: "Adler",
    zone: "1",
    name: "Adlerhorst",
    neighbours: ["Hannover", "Nuremberg", "Tannenberg", "Wolfsschlucht"],
    textContent: [
        "-2 Suspicion",
        "(you only) for",
        "Explosives",
    ],
    lat:20.5,
    lng:62.2,
    itemState: "concealed"
  },
  {
    id: "Tann",
    zone: "1",
    name: "Tannenberg",
    neighbours: ["Adlerhorst", "Munich"],
    textContent: [
        "-2 Suspicion",
        "(you only)",
        "for Poison",
    ],
    lat:22,
    lng:75.1,
    itemState: "concealed"
  },
  {
    id: "Munich",
    zone: "1",
    name: "Munich",
    neighbours: ["Nuremberg", "Tannenberg", "Berghof", "Vienna", "Zurich"],
    textContent: [
        "If stage 1,",
        "-2 Suspicion",
        "(you only)",
        "for any item",
    ],
    lat:33.9,
    lng:76.7,
    itemState: "concealed"
  },
  {
    id: "Berg",
    zone: "2",
    name: "Berghof",
    neighbours: ["Munich"],
    textContent: [
        "If Hitler is",
        "present,",
        "-2 Suspicion",
        "(you only)",
        "for any item",
    ],
    lat:39.9,
    lng:88,
    itemState: "concealed"
  },
  {
    id: "Vienna",
    zone: "2",
    name: "Vienna",
    neighbours: ["Munich", "Anlage Sud"],
    textContent: [
        "If stage 2,",
        "-2 Suspicion",
        "(you only)",
        "for any item",
    ],
    lat:46.5,
    lng:76.5,
    itemState: "concealed"
  },
  {
    id: "Posen",
    zone: "3",
    name: "Posen",
    neighbours: ["Train Station", "Wolfsschanze", "Warsaw"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Badge",
    ],
    lat:49.1,
    lng:45.5,
    itemState: "concealed"
  },
  {
    id: "Prague",
    zone: "3",
    name: "Prague",
    neighbours: ["Train Station", "Nuremberg", "Auschwitz"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Signature",
    ],
    lat:44,
    lng:60.5,
    itemState: "concealed"
  },
  {
    id: "Zurich",
    zone: "3",
    name: "Zurich",
    neighbours: ["Munich"],
    textContent: [
        "+1 Suspicion",
    ],
    lat:19.9,
    lng:86.8
  },
  {
    id: "Wolf",
    zone: "3",
    name: "Wolfsschanze",
    neighbours: ["Posen", "Warsaw", "Treblinka", "Riga", "Borisov"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Keys",
    ],
    restricted: true,
    lat:58.3,
    lng:31.8,
    itemState: "concealed"
  },
  {
    id: "Warsaw",
    zone: "3",
    name: "Warsaw",
    neighbours: ["Posen", "Wolfsschanze", "Anlage Sud", "Treblinka"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Intel",
    ],
    restricted: true,
    lat:61.85,
    lng:48,
    itemState: "concealed"
  },
  {
    id: "Anlage",
    zone: "3",
    name: "Anlage Sud",
    neighbours: ["Vienna", "Warsaw", "Auschwitz", "Wehrwolf"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Poison",
    ],
    restricted: true,
    lat:69.7,
    lng:61,
    itemState: "concealed"
  },
  {
    id: "Treblinka",
    zone: "4",
    name: "Treblinka",
    neighbours: ["Warsaw", "Wolfsschanze"],
    textContent: [
        "+2 Motivation",
        "+1 Suspicion",
    ],
    restricted: true,
    lat:67.9,
    lng:37.3,
    itemState: "concealed"
  },
  {
    id: "Wolfsschlucht",
    zone: "4",
    name: "Wolfsschlucht",
    neighbours: ["Adlerhorst", "Paris"],
    textContent: [
        "If Abwehr",
        "-2 Suspicion",
        "(you only)",
        "for any item",
    ],
    restricted: true,
    lat:8,
    lng:58.2,
    itemState: "concealed"
  },
  {
    id: "Paris",
    zone: "4",
    name: "Paris",
    neighbours: ["Wolfsschlucht"],
    textContent: [
        "-3 Suspicion",
        "+1 Hitler's Military Support",
    ],
    restricted: true,
    lat:4.75,
    lng:74.5
  },
  {
    id: "Riga",
    zone: "4",
    name: "Riga",
    neighbours: ["Wolfsschanze", "Stockholm", "Wasserburg"],
    textContent: [
      "If Civilian",
      "-2 Suspicion",
      "(you only)",
      "for any item",
    ],
    restricted: true,
    lat:73,
    lng:8.8,
    itemState: "concealed"
  },
  {
    id: "Stock",
    zone: "4",
    name: "Stockholm",
    neighbours: ["Riga"],
    textContent: [
        "+1 Suspicion",
    ],
    restricted: true,
    lat:50.45,
    lng:2.2
  },
  {
    id: "Auschwitz",
    zone: "4",
    name: "Auschwitz",
    neighbours: ["Prague", "Anlage Sud"],
    textContent: [
        "+2 Motivation",
        "+1 Suspicion",
    ],
    restricted: true,
    lat:58,
    lng:61
  },
  {
    id: "Borisov",
    zone: "5",
    name: "Borisov",
    neighbours: ["Wolfsschanze", "Wasserburg", "Smolensk"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Map",
    ],
    restricted: true,
    lat:77.1,
    lng:22,
    itemState: "concealed"
  },
  {
    id: "Smolensk",
    zone: "5",
    name: "Smolensk",
    neighbours: ["Borisov"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Explosives",
    ],
    restricted: true,
    lat:91.15,
    lng:22,
    itemState: "concealed"
  },
  {
    id: "Wasserburg",
    zone: "5",
    name: "Wasserburg",
    neighbours: ["Riga", "Borisov"],
    textContent: [
        "-3 Suspicion",
        "(distributed)",
        "for Weapons",
    ],
    restricted: true,
    lat:85.9,
    lng:3,
    itemState: "concealed"
  },
  {
    id: "Wehrwolf",
    zone: "5",
    name: "Wehrwolf",
    neighbours: ["Anlage Sud"],
    textContent: [
      "If Wehrmacht",
      "-2 Suspicion",
      "(you only)",
      "for any item",
    ],
    restricted: true,
    lat:89.6,
    lng:61.5,
    itemState: "concealed"
  },
  {
    id: "P",
    zone: "0",
    name: "Prison",
    lat:4,
    lng:27,
    neighbours: []
  },
  
];

module.exports = LocationDetails;