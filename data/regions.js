export const counties = [
  // South England
  {
    id: 'kent',
    name: 'Kent',
    country: 'England',
    region: 'South',
    description: '',
    prev: null,
    next: 'east_sussex'
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
  }
];
 // West England
{
  id: 'gloucestershire',
  name: 'Gloucestershire',
  country: 'England',
  region: 'West',
  description: '',
  prev: null,
  next: 'bristol'
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
  next: 'devon',
  arena: {
    name: 'Somerset Arena',
    medal: 'West England Medal',
    description: 'Defeat the Somerset Arena to unlock the East England region!'
  }
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
  next: 'herefordshire'
},
{
  id: 'herefordshire',
  name: 'Herefordshire',
  country: 'England',
  region: 'West',
  description: '',
  prev: 'cornwall',
  next: null
}
 // East England
{
  id: 'essex',
  name: 'Essex',
  country: 'England',
  region: 'East',
  description: '',
  prev: null,
  next: 'cambridgeshire'
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
  next: 'bedfordshire',
  arena: {
    name: 'Norfolk Arena',
    medal: 'East England Medal',
    description: 'Defeat the Norfolk Arena to unlock the Midlands region!'
  }
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
  next: null
}
  // Midlands (Central England)
{
  id: 'west_midlands',
  name: 'West Midlands',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: null,
  next: 'warwickshire'
},
{
  id: 'warwickshire',
  name: 'Warwickshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'west_midlands',
  next: 'staffordshire'
},
{
  id: 'staffordshire',
  name: 'Staffordshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'warwickshire',
  next: 'worcestershire'
},
{
  id: 'worcestershire',
  name: 'Worcestershire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'staffordshire',
  next: 'shropshire'
},
{
  id: 'shropshire',
  name: 'Shropshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'worcestershire',
  next: 'nottinghamshire'
},
{
  id: 'nottinghamshire',
  name: 'Nottinghamshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'shropshire',
  next: 'derbyshire'
},
{
  id: 'derbyshire',
  name: 'Derbyshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'nottinghamshire',
  next: 'leicestershire',
  arena: {
    name: 'Derbyshire Arena',
    medal: 'Midlands Medal',
    description: 'Defeat the Derbyshire Arena to unlock the North West England region!'
  }
},
{
  id: 'leicestershire',
  name: 'Leicestershire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'derbyshire',
  next: 'rutland'
},
{
  id: 'rutland',
  name: 'Rutland',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'leicestershire',
  next: 'lincolnshire'
},
{
  id: 'lincolnshire',
  name: 'Lincolnshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'rutland',
  next: 'northamptonshire'
},
{
  id: 'northamptonshire',
  name: 'Northamptonshire',
  country: 'England',
  region: 'Midlands',
  description: '',
  prev: 'lincolnshire',
  next: null
}
  // North West England
{
  id: 'cheshire',
  name: 'Cheshire',
  country: 'England',
  region: 'North West',
  description: '',
  prev: null,
  next: 'merseyside'
},
{
  id: 'merseyside',
  name: 'Merseyside',
  country: 'England',
  region: 'North West',
  description: '',
  prev: 'cheshire',
  next: 'greater_manchester'
},
{
  id: 'greater_manchester',
  name: 'Greater Manchester',
  country: 'England',
  region: 'North West',
  description: '',
  prev: 'merseyside',
  next: 'lancashire',
  arena: {
    name: 'Greater Manchester Arena',
    medal: 'North West England Medal',
    description: 'Defeat the Greater Manchester Arena to unlock the North East England region!'
  }
},
{
  id: 'lancashire',
  name: 'Lancashire',
  country: 'England',
  region: 'North West',
  description: '',
  prev: 'greater_manchester',
  next: 'cumbria'
},
{
  id: 'cumbria',
  name: 'Cumbria',
  country: 'England',
  region: 'North West',
  description: '',
  prev: 'lancashire',
  next: null
}
  // North East England
{
  id: 'durham',
  name: 'County Durham',
  country: 'England',
  region: 'North East',
  description: '',
  prev: null,
  next: 'tyne_and_wear'
},
{
  id: 'tyne_and_wear',
  name: 'Tyne and Wear',
  country: 'England',
  region: 'North East',
  description: '',
  prev: 'durham',
  next: 'northumberland',
  arena: {
    name: 'Tyne and Wear Arena',
    medal: 'North East England Medal',
    description: 'Defeat the Tyne and Wear Arena to unlock Yorkshire!'
  }
},
{
  id: 'northumberland',
  name: 'Northumberland',
  country: 'England',
  region: 'North East',
  description: '',
  prev: 'tyne_and_wear',
  next: null
}
 // Yorkshire
{
  id: 'south_yorkshire',
  name: 'South Yorkshire',
  country: 'England',
  region: 'Yorkshire',
  description: '',
  prev: null,
  next: 'west_yorkshire'
},
{
  id: 'west_yorkshire',
  name: 'West Yorkshire',
  country: 'England',
  region: 'Yorkshire',
  description: '',
  prev: 'south_yorkshire',
  next: 'north_yorkshire'
},
{
  id: 'north_yorkshire',
  name: 'North Yorkshire',
  country: 'England',
  region: 'Yorkshire',
  description: '',
  prev: 'west_yorkshire',
  next: 'east_riding'
},
{
  id: 'east_riding',
  name: 'East Riding of Yorkshire',
  country: 'England',
  region: 'Yorkshire',
  description: '',
  prev: 'north_yorkshire',
  next: null,
  arena: {
    name: 'East Riding Arena',
    medal: 'Yorkshire Medal',
    description: 'Defeat the East Riding Arena to complete England and unlock Wales! Your journey in Wales begins with South Wales.'
  }
}
  // ------------------ WALES ------------------
 // South Wales
{
  id: 'monmouthshire',
  name: 'Monmouthshire',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: null,
  next: 'newport'
},
{
  id: 'newport',
  name: 'Newport',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'monmouthshire',
  next: 'torfaen'
},
{
  id: 'torfaen',
  name: 'Torfaen',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'newport',
  next: 'blaenau_gwent'
},
{
  id: 'blaenau_gwent',
  name: 'Blaenau Gwent',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'torfaen',
  next: 'caerphilly'
},
{
  id: 'caerphilly',
  name: 'Caerphilly',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'blaenau_gwent',
  next: 'cardiff'
},
{
  id: 'cardiff',
  name: 'Cardiff',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'caerphilly',
  next: 'vale_of_glamorgan',
  arena: {
    name: 'Cardiff Arena',
    medal: 'South Wales Medal',
    description: 'Defeat the Cardiff Arena to unlock the West Wales region!'
  }
},
{
  id: 'vale_of_glamorgan',
  name: 'Vale of Glamorgan',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'cardiff',
  next: 'bridgend'
},
{
  id: 'bridgend',
  name: 'Bridgend',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'vale_of_glamorgan',
  next: 'rhondda'
},
{
  id: 'rhondda',
  name: 'Rhondda Cynon Taf',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'bridgend',
  next: 'merthyr_tydfil'
},
{
  id: 'merthyr_tydfil',
  name: 'Merthyr Tydfil',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'rhondda',
  next: 'swansea'
},
{
  id: 'swansea',
  name: 'Swansea',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'merthyr_tydfil',
  next: 'neath_port_talbot'
},
{
  id: 'neath_port_talbot',
  name: 'Neath Port Talbot',
  country: 'Wales',
  region: 'South',
  description: '',
  prev: 'swansea',
  next: null
}
 // West Wales
{
  id: 'ceredigion',
  name: 'Ceredigion',
  country: 'Wales',
  region: 'West',
  description: '',
  prev: null,
  next: 'carmarthenshire'
},
{
  id: 'carmarthenshire',
  name: 'Carmarthenshire',
  country: 'Wales',
  region: 'West',
  description: '',
  prev: 'ceredigion',
  next: 'pembrokeshire'
},
{
  id: 'pembrokeshire',
  name: 'Pembrokeshire',
  country: 'Wales',
  region: 'West',
  description: '',
  prev: 'carmarthenshire',
  next: 'powys',
  arena: {
    name: 'Pembrokeshire Arena',
    medal: 'West Wales Medal',
    description: 'Defeat the Pembrokeshire Arena to unlock the North Wales region!'
  }
},
{
  id: 'powys',
  name: 'Powys',
  country: 'Wales',
  region: 'West',
  description: '',
  prev: 'pembrokeshire',
  next: null
}
  // Mid Wales
{
  id: 'ceredigion',
  name: 'Ceredigion',
  country: 'Wales',
  region: 'Mid',
  description: '',
  prev: null,
  next: 'powys'
},
{
  id: 'powys',
  name: 'Powys',
  country: 'Wales',
  region: 'Mid',
  description: '',
  prev: 'ceredigion',
  next: 'wrexham',
  arena: {
    name: 'Powys Arena',
    medal: 'Mid Wales Medal',
    description: 'Defeat the Powys Arena to unlock the North Wales region!'
  }
},
{
  id: 'wrexham',
  name: 'Wrexham',
  country: 'Wales',
  region: 'Mid',
  description: '',
  prev: 'powys',
  next: null
}
  // North Wales
{
  id: 'wrexham',
  name: 'Wrexham',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: null,
  next: 'flintshire'
},
{
  id: 'flintshire',
  name: 'Flintshire',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: 'wrexham',
  next: 'denbighshire'
},
{
  id: 'denbighshire',
  name: 'Denbighshire',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: 'flintshire',
  next: 'conwy'
},
{
  id: 'conwy',
  name: 'Conwy',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: 'denbighshire',
  next: 'anglesey'
},
{
  id: 'anglesey',
  name: 'Anglesey',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: 'conwy',
  next: 'gwynedd'
},
{
  id: 'gwynedd',
  name: 'Gwynedd',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: 'anglesey',
  next: 'snowdonia'
},
{
  id: 'snowdonia',
  name: 'Snowdonia',
  country: 'Wales',
  region: 'North',
  description: '',
  prev: 'gwynedd',
  next: null,
  arena: {
    name: 'Snowdonia Arena',
    medal: 'North Wales Medal',
    description: 'Defeat the Snowdonia Arena to complete Wales and unlock South Scotland!'
  }
}
  // ------------------ SCOTLAND ------------------
 // South Scotland
{
  id: 'scottish_borders',
  name: 'Scottish Borders',
  country: 'Scotland',
  region: 'South',
  description: '',
  prev: null,
  next: 'dumfries'
},
{
  id: 'dumfries',
  name: 'Dumfries and Galloway',
  country: 'Scotland',
  region: 'South',
  description: '',
  prev: 'scottish_borders',
  next: 'south_ayrshire',
  arena: {
    name: 'Dumfries Arena',
    medal: 'South Scotland Medal',
    description: 'Defeat the Dumfries Arena to unlock Central Scotland!'
  }
},
{
  id: 'south_ayrshire',
  name: 'South Ayrshire',
  country: 'Scotland',
  region: 'South',
  description: '',
  prev: 'dumfries',
  next: null
}
  // West Scotland
{
  id: 'east_ayrshire',
  name: 'East Ayrshire',
  country: 'Scotland',
  region: 'West',
  description: '',
  prev: null,
  next: 'north_ayrshire'
},
{
  id: 'north_ayrshire',
  name: 'North Ayrshire',
  country: 'Scotland',
  region: 'West',
  description: '',
  prev: 'east_ayrshire',
  next: 'glasgow'
},
{
  id: 'glasgow',
  name: 'Glasgow',
  country: 'Scotland',
  region: 'West',
  description: '',
  prev: 'north_ayrshire',
  next: 'renfrewshire',
  arena: {
    name: 'Glasgow Arena',
    medal: 'West Scotland Medal',
    description: 'Defeat the Glasgow Arena to unlock the Highlands!'
  }
},
{
  id: 'renfrewshire',
  name: 'Renfrewshire',
  country: 'Scotland',
  region: 'West',
  description: '',
  prev: 'glasgow',
  next: null
}
 // Central Scotland
{
  id: 'stirling',
  name: 'Stirling',
  country: 'Scotland',
  region: 'Central',
  description: '',
  prev: null,
  next: 'clackmannanshire'
},
{
  id: 'clackmannanshire',
  name: 'Clackmannanshire',
  country: 'Scotland',
  region: 'Central',
  description: '',
  prev: 'stirling',
  next: 'falkirk'
},
{
  id: 'falkirk',
  name: 'Falkirk',
  country: 'Scotland',
  region: 'Central',
  description: '',
  prev: 'clackmannanshire',
  next: 'perth_and_kinross',
  arena: {
    name: 'Falkirk Arena',
    medal: 'Central Scotland Medal',
    description: 'Defeat the Falkirk Arena to unlock the North Scotland region!'
  }
},
{
  id: 'perth_and_kinross',
  name: 'Perth and Kinross',
  country: 'Scotland',
  region: 'Central',
  description: '',
  prev: 'falkirk',
  next: null
}
  // East Scotland
{
  id: 'angus',
  name: 'Angus',
  country: 'Scotland',
  region: 'East',
  description: '',
  prev: null,
  next: 'dundee'
},
{
  id: 'dundee',
  name: 'Dundee',
  country: 'Scotland',
  region: 'East',
  description: '',
  prev: 'angus',
  next: 'aberdeenshire'
},
{
  id: 'aberdeenshire',
  name: 'Aberdeenshire',
  country: 'Scotland',
  region: 'East',
  description: '',
  prev: 'dundee',
  next: 'fife'
},
{
  id: 'fife',
  name: 'Fife',
  country: 'Scotland',
  region: 'East',
  description: '',
  prev: 'aberdeenshire',
  next: 'aberdeen_city',
  arena: {
    name: 'Fife Arena',
    medal: 'East Scotland Medal',
    description: 'Defeat the Fife Arena to unlock the Highlands!'
  }
},
{
  id: 'aberdeen_city',
  name: 'Aberdeen City',
  country: 'Scotland',
  region: 'East',
  description: '',
  prev: 'fife',
  next: null
}
 // North Scotland
{
  id: 'moray',
  name: 'Moray',
  country: 'Scotland',
  region: 'North',
  description: '',
  prev: null,
  next: 'highlands'
},
{
  id: 'highlands',
  name: 'Highlands',
  country: 'Scotland',
  region: 'North',
  description: '',
  prev: 'moray',
  next: 'orkney',
  arena: {
    name: 'Highlands Arena',
    medal: 'North Scotland Medal',
    description: 'Defeat the Highlands Arena to complete Scotland and unlock Ireland!'
  }
},
{
  id: 'orkney',
  name: 'Orkney',
  country: 'Scotland',
  region: 'North',
  description: '',
  prev: 'highlands',
  next: 'shetland'
},
{
  id: 'shetland',
  name: 'Shetland',
  country: 'Scotland',
  region: 'North',
  description: '',
  prev: 'orkney',
  next: null
}
  // ------------------ NORTHERN IRELAND ------------------
 // North Ireland
{
  id: 'antrim',
  name: 'Antrim',
  country: 'Ireland',
  region: 'North',
  description: '',
  prev: null,
  next: 'londonderry'
},
{
  id: 'londonderry',
  name: 'Londonderry',
  country: 'Ireland',
  region: 'North',
  description: '',
  prev: 'antrim',
  next: 'donegal',
  arena: {
    name: 'Londonderry Arena',
    medal: 'North Ireland Medal',
    description: 'Defeat the Londonderry Arena to unlock the West Ireland region!'
  }
},
{
  id: 'donegal',
  name: 'Donegal',
  country: 'Ireland',
  region: 'North',
  description: '',
  prev: 'londonderry',
  next: null
}
 // East Ireland
{
  id: 'louth',
  name: 'Louth',
  country: 'Ireland',
  region: 'East',
  description: '',
  prev: null,
  next: 'meath'
},
{
  id: 'meath',
  name: 'Meath',
  country: 'Ireland',
  region: 'East',
  description: '',
  prev: 'louth',
  next: 'down'
},
{
  id: 'down',
  name: 'Down',
  country: 'Ireland',
  region: 'East',
  description: '',
  prev: 'meath',
  next: 'dublin',
  arena: {
    name: 'Down Arena',
    medal: 'East Ireland Medal',
    description: 'Defeat the Down Arena to unlock South Ireland!'
  }
},
{
  id: 'dublin',
  name: 'Dublin',
  country: 'Ireland',
  region: 'East',
  description: '',
  prev: 'down',
  next: null
}
  // West Ireland
{
  id: 'mayo',
  name: 'Mayo',
  country: 'Ireland',
  region: 'West',
  description: '',
  prev: null,
  next: 'fermanagh'
},
{
  id: 'fermanagh',
  name: 'Fermanagh',
  country: 'Ireland',
  region: 'West',
  description: '',
  prev: 'mayo',
  next: 'galway',
  arena: {
    name: 'Fermanagh Arena',
    medal: 'West Ireland Medal',
    description: 'Defeat the Fermanagh Arena to unlock East Ireland!'
  }
},
{
  id: 'galway',
  name: 'Galway',
  country: 'Ireland',
  region: 'West',
  description: '',
  prev: 'fermanagh',
  next: null
}
  // South Ireland
{
  id: 'kilkenny',
  name: 'Kilkenny',
  country: 'Ireland',
  region: 'South',
  description: '',
  prev: null,
  next: 'armagh'
},
{
  id: 'armagh',
  name: 'Armagh',
  country: 'Ireland',
  region: 'South',
  description: '',
  prev: 'kilkenny',
  next: 'cork',
  arena: {
    name: 'Armagh Arena',
    medal: 'South Ireland Medal',
    description: 'Defeat the Armagh Arena to complete Ireland!'
  }
},
{
  id: 'cork',
  name: 'Cork',
  country: 'Ireland',
  region: 'South',
  description: '',
  prev: 'armagh',
  next: null
}
];
