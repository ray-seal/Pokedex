// data/regions.js

// Major routes (simplified for demo)
export const routes = [
  { id: "m20", name: "M20 Motorway", from: "Kent", to: "London" },
  { id: "m25", name: "M25 Motorway", from: "London", to: "Surrey" },
  { id: "a12", name: "A12", from: "London", to: "Essex" },
  { id: "m11", name: "M11 Motorway", from: "London", to: "Cambridgeshire" },
  { id: "m1", name: "M1 Motorway", from: "London", to: "Hertfordshire" },
  { id: "a23", name: "A23", from: "London", to: "Sussex" },
  // Add more routes as desired
];

// UK Counties (small subset for demo, expand as desired)
export const counties = [
  {
    id: "Kent",
    name: "Kent",
    description: "The Garden of England.",
    arena: {
      name: "Canterbury Arena",
      reward: "Kent Wildlife Badge"
    },
    neighbours: ["London"]
  },
  {
    id: "London",
    name: "London",
    description: "The bustling capital.",
    arena: {
      name: "O2 Arena",
      reward: "London Wildlife Badge"
    },
    neighbours: ["Kent", "Surrey", "Essex", "Cambridgeshire", "Hertfordshire", "Sussex"]
  },
  {
    id: "Essex",
    name: "Essex",
    description: "Known for its coastline.",
    arena: {
      name: "Colchester Arena",
      reward: "Essex Wildlife Badge"
    },
    neighbours: ["London"]
  },
  {
    id: "Surrey",
    name: "Surrey",
    description: "Leafy suburb of London.",
    arena: {
      name: "Guildford Arena",
      reward: "Surrey Wildlife Badge"
    },
    neighbours: ["London"]
  },
  {
    id: "Cambridgeshire",
    name: "Cambridgeshire",
    description: "Historic university county.",
    arena: {
      name: "Cambridge Arena",
      reward: "Cambridge Wildlife Badge"
    },
    neighbours: ["London"]
  },
  {
    id: "Hertfordshire",
    name: "Hertfordshire",
    description: "Green belt county north of London.",
    arena: {
      name: "St Albans Arena",
      reward: "Hertfordshire Wildlife Badge"
    },
    neighbours: ["London"]
  },
  {
    id: "Sussex",
    name: "Sussex",
    description: "Coastal county to the south.",
    arena: {
      name: "Brighton Arena",
      reward: "Sussex Wildlife Badge"
    },
    neighbours: ["London"]
  },
  // ... Add more counties as needed
];
