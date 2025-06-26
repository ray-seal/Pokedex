export const counties = [
  // ------------------ ENGLAND ------------------
  // South England
  { id: 'kent', name: 'Kent', country: 'England', region: 'South', description: '', prev: null, next: 'east_sussex' },
  { id: 'east_sussex', name: 'East Sussex', country: 'England', region: 'South', description: '', prev: 'kent', next: 'west_sussex' },
  { id: 'west_sussex', name: 'West Sussex', country: 'England', region: 'South', description: '', prev: 'east_sussex', next: 'surrey' },
  { id: 'surrey', name: 'Surrey', country: 'England', region: 'South', description: '', prev: 'west_sussex', next: 'hampshire' },
  { id: 'hampshire', name: 'Hampshire', country: 'England', region: 'South', description: '', prev: 'surrey', next: 'isle_of_wight' },
  { id: 'isle_of_wight', name: 'Isle of Wight', country: 'England', region: 'South', description: '', prev: 'hampshire', next: 'dorset' },
  { id: 'dorset', name: 'Dorset', country: 'England', region: 'South', description: '', prev: 'isle_of_wight', next: 'berkshire' },
  { id: 'berkshire', name: 'Berkshire', country: 'England', region: 'South', description: '', prev: 'dorset', next: 'oxfordshire' },
  { id: 'oxfordshire', name: 'Oxfordshire', country: 'England', region: 'South', description: '', prev: 'berkshire', next: 'buckinghamshire' },
  { id: 'buckinghamshire', name: 'Buckinghamshire', country: 'England', region: 'South', description: '', prev: 'oxfordshire', next: 'greater_london' },
  { id: 'greater_london', name: 'Greater London', country: 'England', region: 'South', description: '', prev: 'buckinghamshire', next: null },

  // West England
  { id: 'gloucestershire', name: 'Gloucestershire', country: 'England', region: 'West', description: '', prev: null, next: 'bristol' },
  { id: 'bristol', name: 'Bristol', country: 'England', region: 'West', description: '', prev: 'gloucestershire', next: 'wiltshire' },
  { id: 'wiltshire', name: 'Wiltshire', country: 'England', region: 'West', description: '', prev: 'bristol', next: 'somerset' },
  { id: 'somerset', name: 'Somerset', country: 'England', region: 'West', description: '', prev: 'wiltshire', next: 'devon' },
  { id: 'devon', name: 'Devon', country: 'England', region: 'West', description: '', prev: 'somerset', next: 'cornwall' },
  { id: 'cornwall', name: 'Cornwall', country: 'England', region: 'West', description: '', prev: 'devon', next: 'herefordshire' },
  { id: 'herefordshire', name: 'Herefordshire', country: 'England', region: 'West', description: '', prev: 'cornwall', next: null },

  // East England
  { id: 'essex', name: 'Essex', country: 'England', region: 'East', description: '', prev: null, next: 'cambridgeshire' },
  { id: 'cambridgeshire', name: 'Cambridgeshire', country: 'England', region: 'East', description: '', prev: 'essex', next: 'suffolk' },
  { id: 'suffolk', name: 'Suffolk', country: 'England', region: 'East', description: '', prev: 'cambridgeshire', next: 'norfolk' },
  { id: 'norfolk', name: 'Norfolk', country: 'England', region: 'East', description: '', prev: 'suffolk', next: 'bedfordshire' },
  { id: 'bedfordshire', name: 'Bedfordshire', country: 'England', region: 'East', description: '', prev: 'norfolk', next: 'hertfordshire' },
  { id: 'hertfordshire', name: 'Hertfordshire', country: 'England', region: 'East', description: '', prev: 'bedfordshire', next: 'peterborough' },
  { id: 'peterborough', name: 'Peterborough', country: 'England', region: 'East', description: '', prev: 'hertfordshire', next: null },

  // Midlands (Central England)
  { id: 'west_midlands', name: 'West Midlands', country: 'England', region: 'Midlands', description: '', prev: null, next: 'warwickshire' },
  { id: 'warwickshire', name: 'Warwickshire', country: 'England', region: 'Midlands', description: '', prev: 'west_midlands', next: 'staffordshire' },
  { id: 'staffordshire', name: 'Staffordshire', country: 'England', region: 'Midlands', description: '', prev: 'warwickshire', next: 'worcestershire' },
  { id: 'worcestershire', name: 'Worcestershire', country: 'England', region: 'Midlands', description: '', prev: 'staffordshire', next: 'shropshire' },
  { id: 'shropshire', name: 'Shropshire', country: 'England', region: 'Midlands', description: '', prev: 'worcestershire', next: 'nottinghamshire' },
  { id: 'nottinghamshire', name: 'Nottinghamshire', country: 'England', region: 'Midlands', description: '', prev: 'shropshire', next: 'derbyshire' },
  { id: 'derbyshire', name: 'Derbyshire', country: 'England', region: 'Midlands', description: '', prev: 'nottinghamshire', next: 'leicestershire' },
  { id: 'leicestershire', name: 'Leicestershire', country: 'England', region: 'Midlands', description: '', prev: 'derbyshire', next: 'rutland' },
  { id: 'rutland', name: 'Rutland', country: 'England', region: 'Midlands', description: '', prev: 'leicestershire', next: 'lincolnshire' },
  { id: 'lincolnshire', name: 'Lincolnshire', country: 'England', region: 'Midlands', description: '', prev: 'rutland', next: 'northamptonshire' },
  { id: 'northamptonshire', name: 'Northamptonshire', country: 'England', region: 'Midlands', description: '', prev: 'lincolnshire', next: null },

  // North West England
  { id: 'cheshire', name: 'Cheshire', country: 'England', region: 'North West', description: '', prev: null, next: 'merseyside' },
  { id: 'merseyside', name: 'Merseyside', country: 'England', region: 'North West', description: '', prev: 'cheshire', next: 'greater_manchester' },
  { id: 'greater_manchester', name: 'Greater Manchester', country: 'England', region: 'North West', description: '', prev: 'merseyside', next: 'lancashire' },
  { id: 'lancashire', name: 'Lancashire', country: 'England', region: 'North West', description: '', prev: 'greater_manchester', next: 'cumbria' },
  { id: 'cumbria', name: 'Cumbria', country: 'England', region: 'North West', description: '', prev: 'lancashire', next: null },

  // North East England
  { id: 'durham', name: 'County Durham', country: 'England', region: 'North East', description: '', prev: null, next: 'tyne_and_wear' },
  { id: 'tyne_and_wear', name: 'Tyne and Wear', country: 'England', region: 'North East', description: '', prev: 'durham', next: 'northumberland' },
  { id: 'northumberland', name: 'Northumberland', country: 'England', region: 'North East', description: '', prev: 'tyne_and_wear', next: null },

  // Yorkshire
  { id: 'south_yorkshire', name: 'South Yorkshire', country: 'England', region: 'Yorkshire', description: '', prev: null, next: 'west_yorkshire' },
  { id: 'west_yorkshire', name: 'West Yorkshire', country: 'England', region: 'Yorkshire', description: '', prev: 'south_yorkshire', next: 'north_yorkshire' },
  { id: 'north_yorkshire', name: 'North Yorkshire', country: 'England', region: 'Yorkshire', description: '', prev: 'west_yorkshire', next: 'east_riding' },
  { id: 'east_riding', name: 'East Riding of Yorkshire', country: 'England', region: 'Yorkshire', description: '', prev: 'north_yorkshire', next: null },

  // ------------------ WALES ------------------
  // South Wales
  { id: 'monmouthshire', name: 'Monmouthshire', country: 'Wales', region: 'South', description: '', prev: null, next: 'newport' },
  { id: 'newport', name: 'Newport', country: 'Wales', region: 'South', description: '', prev: 'monmouthshire', next: 'torfaen' },
  { id: 'torfaen', name: 'Torfaen', country: 'Wales', region: 'South', description: '', prev: 'newport', next: 'blaenau_gwent' },
  { id: 'blaenau_gwent', name: 'Blaenau Gwent', country: 'Wales', region: 'South', description: '', prev: 'torfaen', next: 'caerphilly' },
  { id: 'caerphilly', name: 'Caerphilly', country: 'Wales', region: 'South', description: '', prev: 'blaenau_gwent', next: 'cardiff' },
  { id: 'cardiff', name: 'Cardiff', country: 'Wales', region: 'South', description: '', prev: 'caerphilly', next: 'vale_of_glamorgan' },
  { id: 'vale_of_glamorgan', name: 'Vale of Glamorgan', country: 'Wales', region: 'South', description: '', prev: 'cardiff', next: 'bridgend' },
  { id: 'bridgend', name: 'Bridgend', country: 'Wales', region: 'South', description: '', prev: 'vale_of_glamorgan', next: 'rhondda' },
  { id: 'rhondda', name: 'Rhondda Cynon Taf', country: 'Wales', region: 'South', description: '', prev: 'bridgend', next: 'merthyr_tydfil' },
  { id: 'merthyr_tydfil', name: 'Merthyr Tydfil', country: 'Wales', region: 'South', description: '', prev: 'rhondda', next: 'swansea' },
  { id: 'swansea', name: 'Swansea', country: 'Wales', region: 'South', description: '', prev: 'merthyr_tydfil', next: 'neath_port_talbot' },
  { id: 'neath_port_talbot', name: 'Neath Port Talbot', country: 'Wales', region: 'South', description: '', prev: 'swansea', next: null },

  // West Wales
  { id: 'carmarthenshire', name: 'Carmarthenshire', country: 'Wales', region: 'West', description: '', prev: null, next: 'pembrokeshire' },
  { id: 'pembrokeshire', name: 'Pembrokeshire', country: 'Wales', region: 'West', description: '', prev: 'carmarthenshire', next: 'ceredigion' },
  { id: 'ceredigion', name: 'Ceredigion', country: 'Wales', region: 'West', description: '', prev: 'pembrokeshire', next: null },

  // Mid Wales
  { id: 'powys', name: 'Powys', country: 'Wales', region: 'Mid', description: '', prev: null, next: null },

  // North Wales
  { id: 'gwynedd', name: 'Gwynedd', country: 'Wales', region: 'North', description: '', prev: null, next: 'anglesey' },
  { id: 'anglesey', name: 'Isle of Anglesey', country: 'Wales', region: 'North', description: '', prev: 'gwynedd', next: 'conwy' },
  { id: 'conwy', name: 'Conwy', country: 'Wales', region: 'North', description: '', prev: 'anglesey', next: 'denbighshire' },
  { id: 'denbighshire', name: 'Denbighshire', country: 'Wales', region: 'North', description: '', prev: 'conwy', next: 'flintshire' },
  { id: 'flintshire', name: 'Flintshire', country: 'Wales', region: 'North', description: '', prev: 'denbighshire', next: 'wrexham' },
  { id: 'wrexham', name: 'Wrexham', country: 'Wales', region: 'North', description: '', prev: 'flintshire', next: 'snowdonia' },
  { id: 'snowdonia', name: 'Snowdonia', country: 'Wales', region: 'North', description: 'Mountainous region.', prev: 'wrexham', next: null },

  // ------------------ SCOTLAND ------------------
  // South Scotland
  { id: 'dumfries', name: 'Dumfries and Galloway', country: 'Scotland', region: 'South', description: '', prev: null, next: 'scottish_borders' },
  { id: 'scottish_borders', name: 'Scottish Borders', country: 'Scotland', region: 'South', description: '', prev: 'dumfries', next: null },

  // West Scotland
  { id: 'argyll_and_bute', name: 'Argyll and Bute', country: 'Scotland', region: 'West', description: '', prev: null, next: 'glasgow' },
  { id: 'glasgow', name: 'Glasgow City', country: 'Scotland', region: 'West', description: '', prev: 'argyll_and_bute', next: 'renfrewshire' },
  { id: 'renfrewshire', name: 'Renfrewshire', country: 'Scotland', region: 'West', description: '', prev: 'glasgow', next: 'inverclyde' },
  { id: 'inverclyde', name: 'Inverclyde', country: 'Scotland', region: 'West', description: '', prev: 'renfrewshire', next: 'dunbartonshire' },
  { id: 'dunbartonshire', name: 'Dunbartonshire', country: 'Scotland', region: 'West', description: '', prev: 'inverclyde', next: null },

  // Central Scotland
  { id: 'north_lanarkshire', name: 'North Lanarkshire', country: 'Scotland', region: 'Central', description: '', prev: null, next: 'south_lanarkshire' },
  { id: 'south_lanarkshire', name: 'South Lanarkshire', country: 'Scotland', region: 'Central', description: '', prev: 'north_lanarkshire', next: 'falkirk' },
  { id: 'falkirk', name: 'Falkirk', country: 'Scotland', region: 'Central', description: '', prev: 'south_lanarkshire', next: 'stirling' },
  { id: 'stirling', name: 'Stirling', country: 'Scotland', region: 'Central', description: '', prev: 'falkirk', next: 'clackmannanshire' },
  { id: 'clackmannanshire', name: 'Clackmannanshire', country: 'Scotland', region: 'Central', description: '', prev: 'stirling', next: null },

  // East Scotland
  { id: 'edinburgh', name: 'City of Edinburgh', country: 'Scotland', region: 'East', description: '', prev: null, next: 'east_lothian' },
  { id: 'east_lothian', name: 'East Lothian', country: 'Scotland', region: 'East', description: '', prev: 'edinburgh', next: 'midlothian' },
  { id: 'midlothian', name: 'Midlothian', country: 'Scotland', region: 'East', description: '', prev: 'east_lothian', next: 'west_lothian' },
  { id: 'west_lothian', name: 'West Lothian', country: 'Scotland', region: 'East', description: '', prev: 'midlothian', next: 'fife' },
  { id: 'fife', name: 'Fife', country: 'Scotland', region: 'East', description: '', prev: 'west_lothian', next: 'angus' },
  { id: 'angus', name: 'Angus', country: 'Scotland', region: 'East', description: '', prev: 'fife', next: 'perth_and_kinross' },
  { id: 'perth_and_kinross', name: 'Perth and Kinross', country: 'Scotland', region: 'East', description: '', prev: 'angus', next: 'aberdeenshire' },
  { id: 'aberdeenshire', name: 'Aberdeenshire', country: 'Scotland', region: 'East', description: '', prev: 'perth_and_kinross', next: 'aberdeen_city' },
  { id: 'aberdeen_city', name: 'Aberdeen City', country: 'Scotland', region: 'East', description: '', prev: 'aberdeenshire', next: 'moray' },
  { id: 'moray', name: 'Moray', country: 'Scotland', region: 'East', description: '', prev: 'aberdeen_city', next: null },

  // North Scotland
  { id: 'highland', name: 'Highland', country: 'Scotland', region: 'North', description: '', prev: null, next: 'na_h_eileanan_siar' },
  { id: 'na_h_eileanan_siar', name: 'Na h-Eileanan Siar (Western Isles)', country: 'Scotland', region: 'North', description: '', prev: 'highland', next: 'orkney' },
  { id: 'orkney', name: 'Orkney Islands', country: 'Scotland', region: 'North', description: '', prev: 'na_h_eileanan_siar', next: 'shetland' },
  { id: 'shetland', name: 'Shetland Islands', country: 'Scotland', region: 'North', description: '', prev: 'orkney', next: null },

  // ------------------ NORTHERN IRELAND ------------------
  // North
  { id: 'antrim', name: 'Antrim', country: 'Northern Ireland', region: 'North', description: '', prev: null, next: 'londonderry' },
  { id: 'londonderry', name: 'Londonderry', country: 'Northern Ireland', region: 'North', description: '', prev: 'antrim', next: null },

  // East
  { id: 'down', name: 'Down', country: 'Northern Ireland', region: 'East', description: '', prev: null, next: null },

  // West
  { id: 'fermanagh', name: 'Fermanagh', country: 'Northern Ireland', region: 'West', description: '', prev: null, next: null },

  // South
  { id: 'armagh', name: 'Armagh', country: 'Northern Ireland', region: 'South', description: '', prev: null, next: 'tyrone' },
  { id: 'tyrone', name: 'Tyrone', country: 'Northern Ireland', region: 'South', description: '', prev: 'armagh', next: null },
];
