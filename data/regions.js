export const counties = [
  // South England (start region - unlocked)
  {
    id: 'kent',
    name: 'Kent',
    country: 'England',
    region: 'South',
    description: '',
    prev: null,
    next: 'east_sussex',
    locked: false
  },
  {
    id: 'east_sussex',
    name: 'East Sussex',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'kent',
    next: 'west_sussex',
    arena: {
      name: 'Brighton Arena',
      medal: 'South England Medal',
      description: 'Defeat the Brighton Arena to unlock the West England region!'
    }
  },
  {
    id: 'west_sussex',
    name: 'West Sussex',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'east_sussex',
    next: 'surrey'
  },
  {
    id: 'surrey',
    name: 'Surrey',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'west_sussex',
    next: 'hampshire'
  },
  {
    id: 'hampshire',
    name: 'Hampshire',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'surrey',
    next: 'isle_of_wight'
  },
  {
    id: 'isle_of_wight',
    name: 'Isle of Wight',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'hampshire',
    next: 'dorset'
  },
  {
    id: 'dorset',
    name: 'Dorset',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'isle_of_wight',
    next: 'berkshire'
  },
  {
    id: 'berkshire',
    name: 'Berkshire',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'dorset',
    next: 'oxfordshire'
  },
  {
    id: 'oxfordshire',
    name: 'Oxfordshire',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'berkshire',
    next: 'buckinghamshire'
  },
  {
    id: 'buckinghamshire',
    name: 'Buckinghamshire',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'oxfordshire',
    next: 'greater_london'
  },
  {
    id: 'greater_london',
    name: 'Greater London',
    country: 'England',
    region: 'South',
    description: '',
    prev: 'buckinghamshire',
    next: null
  },
];
  // --- West England (locked until South England Medal) ---
  {
    id: 'gloucestershire',
    name: 'Gloucestershire',
    country: 'England',
    region: 'West',
    description: '',
    prev: null,
    next: 'bristol',
    locked: true
  },
  {
    id: 'bristol',
    name: 'Bristol',
    country: 'England',
    region: 'West',
    description: '',
    prev: 'gloucestershire',
    next: 'wiltshire'
  },
  {
    id: 'wiltshire',
    name: 'Wiltshire',
    country: 'England',
    region: 'West',
    description: '',
    prev: 'bristol',
    next: 'somerset'
  },
  {
    id: 'somerset',
    name: 'Somerset',
    country: 'England',
    region: 'West',
    description: '',
    prev: 'wiltshire',
    next: 'devon'
  },
  {
    id: 'devon',
    name: 'Devon',
    country: 'England',
    region: 'West',
    description: '',
    prev: 'somerset',
    next: 'cornwall'
  },
  {
    id: 'cornwall',
    name: 'Cornwall',
    country: 'England',
    region: 'West',
    description: '',
    prev: 'devon',
    next: null,
    arena: {
      name: 'Cornwall Arena',
      medal: 'West England Medal',
      description: 'Defeat the Cornwall Arena to unlock the North England region!'
    }
  },
// --- North England (locked until West England Medal) ---
{
  id: 'cumbria',
  name: 'Cumbria',
  country: 'England',
  region: 'North',
  description: '',
  prev: null,
  next: 'lancashire',
  locked: true
},
{
  id: 'lancashire',
  name: 'Lancashire',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'cumbria',
  next: 'greater_manchester'
},
{
  id: 'greater_manchester',
  name: 'Greater Manchester',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'lancashire',
  next: 'merseyside'
},
{
  id: 'merseyside',
  name: 'Merseyside',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'greater_manchester',
  next: 'cheshire'
},
{
  id: 'cheshire',
  name: 'Cheshire',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'merseyside',
  next: 'west_yorkshire'
},
{
  id: 'west_yorkshire',
  name: 'West Yorkshire',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'cheshire',
  next: 'south_yorkshire'
},
{
  id: 'south_yorkshire',
  name: 'South Yorkshire',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'west_yorkshire',
  next: 'east_riding_of_yorkshire'
},
{
  id: 'east_riding_of_yorkshire',
  name: 'East Riding of Yorkshire',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'south_yorkshire',
  next: 'north_yorkshire'
},
{
  id: 'north_yorkshire',
  name: 'North Yorkshire',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'east_riding_of_yorkshire',
  next: 'tyne_and_wear'
},
{
  id: 'tyne_and_wear',
  name: 'Tyne and Wear',
  country: 'England',
  region: 'North',
  description: '',
  prev: 'north_yorkshire',
  next: null,
  arena: {
    name: 'Tyne and Wear Arena',
    medal: 'North England Medal',
    description: 'Defeat the Tyne and Wear Arena to unlock East England!'
  }
},
// --- East England (locked until North England Medal) ---
{
  id: 'essex',
  name: 'Essex',
  country: 'England',
  region: 'East',
  description: '',
  prev: null,
  next: 'cambridgeshire',
  locked: true
},
{
  id: 'cambridgeshire',
  name: 'Cambridgeshire',
  country: 'England',
  region: 'East',
  description: '',
  prev: 'essex',
  next: 'suffolk'
},
{
  id: 'suffolk',
  name: 'Suffolk',
  country: 'England',
  region: 'East',
  description: '',
  prev: 'cambridgeshire',
  next: 'norfolk'
},
{
  id: 'norfolk',
  name: 'Norfolk',
  country: 'England',
  region: 'East',
  description: '',
  prev: 'suffolk',
  next: 'bedfordshire'
},
{
  id: 'bedfordshire',
  name: 'Bedfordshire',
  country: 'England',
  region: 'East',
  description: '',
  prev: 'norfolk',
  next: 'hertfordshire'
},
{
  id: 'hertfordshire',
  name: 'Hertfordshire',
  country: 'England',
  region: 'East',
  description: '',
  prev: 'bedfordshire',
  next: 'peterborough'
},
{
  id: 'peterborough',
  name: 'Peterborough',
  country: 'England',
  region: 'East',
  description: '',
  prev: 'hertfordshire',
  next: null,
  arena: {
    name: 'Peterborough Arena',
    medal: 'East England Medal',
    description: 'Defeat the Peterborough Arena to complete England and unlock Wales!'
  }
},
// ------------------ WALES ------------------
// --- South Wales (locked until East England Medal) ---
{
  id: 'monmouthshire',
  name: 'Monmouthshire',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: null,
  next: 'newport',
  locked: true
},
{
  id: 'newport',
  name: 'Newport',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'monmouthshire',
  next: 'cardiff'
},
{
  id: 'cardiff',
  name: 'Cardiff',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'newport',
  next: 'vale_of_glamorgan'
},
{
  id: 'vale_of_glamorgan',
  name: 'Vale of Glamorgan',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'cardiff',
  next: 'bridgend'
},
{
  id: 'bridgend',
  name: 'Bridgend',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'vale_of_glamorgan',
  next: 'rhondda_cynon_taf'
},
{
  id: 'rhondda_cynon_taf',
  name: 'Rhondda Cynon Taf',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'bridgend',
  next: 'merthyr_tydfil'
},
{
  id: 'merthyr_tydfil',
  name: 'Merthyr Tydfil',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'rhondda_cynon_taf',
  next: 'caerphilly'
},
{
  id: 'caerphilly',
  name: 'Caerphilly',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'merthyr_tydfil',
  next: 'blaenau_gwent'
},
{
  id: 'blaenau_gwent',
  name: 'Blaenau Gwent',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'caerphilly',
  next: 'torfaen'
},
{
  id: 'torfaen',
  name: 'Torfaen',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'blaenau_gwent',
  next: 'swansea'
},
{
  id: 'swansea',
  name: 'Swansea',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'torfaen',
  next: 'neath_port_talbot'
},
{
  id: 'neath_port_talbot',
  name: 'Neath Port Talbot',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'swansea',
  next: 'carmarthenshire'
},
{
  id: 'carmarthenshire',
  name: 'Carmarthenshire',
  country: 'Wales',
  region: 'South Wales',
  description: '',
  prev: 'neath_port_talbot',
  next: null,
  arena: {
    name: 'Carmarthenshire Arena',
    medal: 'South Wales Medal',
    description: 'Defeat the Carmarthenshire Arena to unlock West Wales!'
  }
}, 
// --- West Wales (locked until South Wales Medal) ---
{
  id: 'ceredigion',
  name: 'Ceredigion',
  country: 'Wales',
  region: 'West Wales',
  description: '',
  prev: null,
  next: 'pembrokeshire',
  locked: true
},
{
  id: 'pembrokeshire',
  name: 'Pembrokeshire',
  country: 'Wales',
  region: 'West Wales',
  description: '',
  prev: 'ceredigion',
  next: 'carmarthenshire'
},
{
  id: 'carmarthenshire_west',
  name: 'Carmarthenshire (West)',
  country: 'Wales',
  region: 'West Wales',
  description: '',
  prev: 'pembrokeshire',
  next: 'powys'
},
{
  id: 'powys',
  name: 'Powys',
  country: 'Wales',
  region: 'West Wales',
  description: '',
  prev: 'carmarthenshire_west',
  next: null,
  arena: {
    name: 'Powys Arena',
    medal: 'West Wales Medal',
    description: 'Defeat the Powys Arena to unlock the next region!'
  }
},
// --- North Wales (locked until West Wales Medal) ---
{
  id: 'gwynedd',
  name: 'Gwynedd',
  country: 'Wales',
  region: 'North Wales',
  description: '',
  prev: null,
  next: 'anglesey',
  locked: true
},
{
  id: 'anglesey',
  name: 'Isle of Anglesey',
  country: 'Wales',
  region: 'North Wales',
  description: '',
  prev: 'gwynedd',
  next: 'conwy'
},
{
  id: 'conwy',
  name: 'Conwy',
  country: 'Wales',
  region: 'North Wales',
  description: '',
  prev: 'anglesey',
  next: 'denbighshire'
},
{
  id: 'denbighshire',
  name: 'Denbighshire',
  country: 'Wales',
  region: 'North Wales',
  description: '',
  prev: 'conwy',
  next: 'flintshire'
},
{
  id: 'flintshire',
  name: 'Flintshire',
  country: 'Wales',
  region: 'North Wales',
  description: '',
  prev: 'denbighshire',
  next: 'wrexham'
},
{
  id: 'wrexham',
  name: 'Wrexham',
  country: 'Wales',
  region: 'North Wales',
  description: '',
  prev: 'flintshire',
  next: null,
  arena: {
    name: 'Wrexham Arena',
    medal: 'North Wales Medal',
    description: 'Defeat the Wrexham Arena to unlock East Wales!'
  }
},
// --- East Wales (locked until North Wales Medal) ---
{
  id: 'herefordshire',
  name: 'Herefordshire',
  country: 'Wales',
  region: 'East Wales',
  description: '',
  prev: null,
  next: 'shropshire',
  locked: true
},
{
  id: 'shropshire',
  name: 'Shropshire',
  country: 'Wales',
  region: 'East Wales',
  description: '',
  prev: 'herefordshire',
  next: 'monmouthshire_east'
},
{
  id: 'monmouthshire_east',
  name: 'Monmouthshire (East)',
  country: 'Wales',
  region: 'East Wales',
  description: '',
  prev: 'shropshire',
  next: 'torfaen'
},
{
  id: 'torfaen',
  name: 'Torfaen',
  country: 'Wales',
  region: 'East Wales',
  description: '',
  prev: 'monmouthshire_east',
  next: null,
  arena: {
    name: 'Torfaen Arena',
    medal: 'East Wales Medal',
    description: 'Defeat the Torfaen Arena to complete Wales and unlock South Scotland!'
  }
},
  // ------------------ SCOTLAND ------------------
// --- South Scotland (locked until East Wales Medal) ---
{
  id: 'dumfries_and_galloway',
  name: 'Dumfries and Galloway',
  country: 'Scotland',
  region: 'South Scotland',
  description: '',
  prev: null,
  next: 'scottish_borders',
  locked: true
},
{
  id: 'scottish_borders',
  name: 'Scottish Borders',
  country: 'Scotland',
  region: 'South Scotland',
  description: '',
  prev: 'dumfries_and_galloway',
  next: 'south_ayrshire'
},
{
  id: 'south_ayrshire',
  name: 'South Ayrshire',
  country: 'Scotland',
  region: 'South Scotland',
  description: '',
  prev: 'scottish_borders',
  next: 'east_ayrshire'
},
{
  id: 'east_ayrshire',
  name: 'East Ayrshire',
  country: 'Scotland',
  region: 'South Scotland',
  description: '',
  prev: 'south_ayrshire',
  next: 'north_ayrshire'
},
{
  id: 'north_ayrshire',
  name: 'North Ayrshire',
  country: 'Scotland',
  region: 'South Scotland',
  description: '',
  prev: 'east_ayrshire',
  next: null,
  arena: {
    name: 'Ayrshire Arena',
    medal: 'South Scotland Medal',
    description: 'Defeat the Ayrshire Arena to unlock West Scotland!'
  }
},
// --- West Scotland (locked until South Scotland Medal) ---
{
  id: 'glasgow',
  name: 'Glasgow',
  country: 'Scotland',
  region: 'West Scotland',
  description: '',
  prev: null,
  next: 'renfrewshire',
  locked: true
},
{
  id: 'renfrewshire',
  name: 'Renfrewshire',
  country: 'Scotland',
  region: 'West Scotland',
  description: '',
  prev: 'glasgow',
  next: 'east_dunbartonshire'
},
{
  id: 'east_dunbartonshire',
  name: 'East Dunbartonshire',
  country: 'Scotland',
  region: 'West Scotland',
  description: '',
  prev: 'renfrewshire',
  next: 'west_dunbartonshire'
},
{
  id: 'west_dunbartonshire',
  name: 'West Dunbartonshire',
  country: 'Scotland',
  region: 'West Scotland',
  description: '',
  prev: 'east_dunbartonshire',
  next: 'argyll_and_bute'
},
{
  id: 'argyll_and_bute',
  name: 'Argyll and Bute',
  country: 'Scotland',
  region: 'West Scotland',
  description: '',
  prev: 'west_dunbartonshire',
  next: null,
  arena: {
    name: 'Argyll and Bute Arena',
    medal: 'West Scotland Medal',
    description: 'Defeat the Argyll and Bute Arena to unlock North Scotland!'
  }
},
// --- North Scotland (locked until West Scotland Medal) ---
{
  id: 'highland',
  name: 'Highland',
  country: 'Scotland',
  region: 'North Scotland',
  description: '',
  prev: null,
  next: 'moray',
  locked: true
},
{
  id: 'moray',
  name: 'Moray',
  country: 'Scotland',
  region: 'North Scotland',
  description: '',
  prev: 'highland',
  next: 'aberdeenshire'
},
{
  id: 'aberdeenshire',
  name: 'Aberdeenshire',
  country: 'Scotland',
  region: 'North Scotland',
  description: '',
  prev: 'moray',
  next: 'orkney'
},
{
  id: 'orkney',
  name: 'Orkney Islands',
  country: 'Scotland',
  region: 'North Scotland',
  description: '',
  prev: 'aberdeenshire',
  next: 'shetland'
},
{
  id: 'shetland',
  name: 'Shetland Islands',
  country: 'Scotland',
  region: 'North Scotland',
  description: '',
  prev: 'orkney',
  next: null,
  arena: {
    name: 'Shetland Arena',
    medal: 'North Scotland Medal',
    description: 'Defeat the Shetland Arena to unlock East Scotland!'
  }
},
// --- East Scotland (locked until North Scotland Medal) ---
{
  id: 'aberdeen_city',
  name: 'Aberdeen City',
  country: 'Scotland',
  region: 'East Scotland',
  description: '',
  prev: null,
  next: 'angus',
  locked: true
},
{
  id: 'angus',
  name: 'Angus',
  country: 'Scotland',
  region: 'East Scotland',
  description: '',
  prev: 'aberdeen_city',
  next: 'dundee_city'
},
{
  id: 'dundee_city',
  name: 'Dundee City',
  country: 'Scotland',
  region: 'East Scotland',
  description: '',
  prev: 'angus',
  next: 'perth_and_kinross'
},
{
  id: 'perth_and_kinross',
  name: 'Perth and Kinross',
  country: 'Scotland',
  region: 'East Scotland',
  description: '',
  prev: 'dundee_city',
  next: 'fife'
},
{
  id: 'fife',
  name: 'Fife',
  country: 'Scotland',
  region: 'East Scotland',
  description: '',
  prev: 'perth_and_kinross',
  next: null,
  arena: {
    name: 'Fife Arena',
    medal: 'East Scotland Medal',
    description: 'Defeat the Fife Arena to complete Scotland and unlock Northern Ireland!'
  }
},
// --- Northern Ireland (locked until East Scotland Medal) ---
{
  id: 'northern_ireland',
  name: 'Northern Ireland',
  country: 'Northern Ireland',
  region: 'Northern Ireland',
  description: '',
  prev: null,
  next: null,
  locked: true,
  arena: {
    name: 'Northern Ireland Arena',
    medal: 'Northern Ireland Medal',
    description: 'Defeat the Northern Ireland Arena to complete your journey and finish the game!'
  }
},
