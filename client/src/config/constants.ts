export const LOCAL_STORAGE = {
  bookingData: '_booking_data',
  isOneTime: '_is_one_time',
  profileComplete: '_profile_complete',
  referenceNumber: '_reference_number',
  payCancelled: '_pay_cancelled',
  timeSlot: '_time_slot',
  permissions: '_permissions',
};
export const PASSWORD_PATTERN = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!$%^&+=])(?=\\S+$).{8,20}$';

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MESSAGES = {
  txn_init: 'Authorization URL created',
  cancelText: `Are you sure you want to carry out this action? 
  If you agree to do this, the affected entity, will not be able to execute certain features on the app.`,
  internalError: 'An error occurred. Please contact support',
};

export const MOBILE_PLAN = 'Mobile';
export const DRIVE_IN_PLAN = 'Drive-in';
export const HYBRID_PLAN = 'Hybrid';

export const MAIN_OFFICE = 'No. 10, 45 Road, off 1st Avenue Gwarimpa';
export const INVENTORY = 'Inventory';
export const REPORT = 'Report';
export const ESTIMATE = 'Estimate';

export const APPOINTMENT_STATUS = {
  pending: 'Pending',
  complete: 'Complete',
  inProgress: 'In-Progress',
  reject: 'Rejected',
  cancel: 'Canceled',
};

export const BOOK_APPOINTMENT = 'event:BOOK_APPOINTMENT';
export const RESCHEDULE_APPOINTMENT = 'event:RESCHEDULE_APPOINTMENT';
export const CANCEL_APPOINTMENT = 'event:CANCEL_APPOINTMENT';
export const AGENDA_COLLECTION_NAME = 'appointmentJobs';

export const ONE_TIME_SUB = 'One Time';
export const HOUSE_HOLD_SUB = 'House Hold';
export const FAF_SUB = 'Family & Friends';
export const PICK_ME_UP_SUB = 'Pick Me Up';

export const MOBILE_CATEGORY = 'Mobile';
export const DRIVE_IN_CATEGORY = 'Drive-in';
export const HYBRID_CATEGORY = 'Hybrid';
export const GARAGE_CATEGORY = 'Garage';
export const RIDE_SHARE_CATEGORY = 'Ride-Share';

export const JOB_STATUS = {
  ...APPOINTMENT_STATUS,
};

export const DRAWER_WIDTH = 240;
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

export const REQUIRED_PARTNER_SETTINGS = {
  phone: null,
  totalStaff: null,
  totalTechnicians: null,
  brands: null,
  cac: null,
  nameOfDirector: null,
  nameOfManager: null,
  logo: null,
  googleMap: null,
  bankName: null,
  accountName: null,
  accountNumber: null,
  workingHours: null,
};

export const STATES = [
  {
    id: 6,
    name: 'Abia',
    alias: 'abia',
    districts: [
      {
        id: 166,
        name: 'Aba North',
      },
      {
        id: 167,
        name: 'Aba South',
      },
      {
        id: 169,
        name: 'Arochukwu',
      },
      {
        id: 170,
        name: 'Bende',
      },
      {
        id: 171,
        name: 'Ikwuano',
      },
      {
        id: 172,
        name: 'Isiala Ngwa',
      },
      {
        id: 173,
        name: 'Isuikwuato',
      },
      {
        id: 174,
        name: 'Obi Ngwa',
      },
      {
        id: 175,
        name: 'Ohafia',
      },
      {
        id: 176,
        name: 'Osisioma Ngwa',
      },
      {
        id: 177,
        name: 'Ugwunagbo',
      },
      {
        id: 178,
        name: 'Ukwa',
      },
      {
        id: 179,
        name: 'Umu Nneochi',
      },
      {
        id: 168,
        name: 'Umuahia',
      },
    ],
  },
  {
    id: 1,
    name: 'Abuja (FCT)',
    alias: 'abuja',
    districts: [
      {
        id: 6,
        name: 'Abaji',
      },
      {
        id: 7,
        name: 'Apo District',
      },
      {
        id: 8,
        name: 'Asokoro',
      },
      {
        id: 9,
        name: 'Bwari',
      },
      {
        id: 1,
        name: 'Central Business District',
      },
      {
        id: 10,
        name: 'Dakibiyu',
      },
      {
        id: 11,
        name: 'Dakwo District',
      },
      {
        id: 12,
        name: 'Dei-Dei',
      },
      {
        id: 13,
        name: 'Duboyi',
      },
      {
        id: 14,
        name: 'Durumi',
      },
      {
        id: 15,
        name: 'Dutse-Alhaji',
      },
      {
        id: 16,
        name: 'Gaduwa',
      },
      {
        id: 17,
        name: 'Galadimawa',
      },
      {
        id: 18,
        name: 'Garki 1',
      },
      {
        id: 19,
        name: 'Garki 2',
      },
      {
        id: 20,
        name: 'Gudu',
      },
      {
        id: 21,
        name: 'Guzape District',
      },
      {
        id: 22,
        name: 'Gwagwa',
      },
      {
        id: 23,
        name: 'Gwagwalada',
      },
      {
        id: 2,
        name: 'Gwarinpa',
      },
      {
        id: 24,
        name: 'Idu Industrial',
      },
      {
        id: 25,
        name: 'Jabi',
      },
      {
        id: 26,
        name: 'Jahi',
      },
      {
        id: 27,
        name: 'Jikwoyi',
      },
      {
        id: 28,
        name: 'Jiwa',
      },
      {
        id: 29,
        name: 'Kabusa',
      },
      {
        id: 30,
        name: 'Kado',
      },
      {
        id: 31,
        name: 'Karmo',
      },
      {
        id: 32,
        name: 'Karshi',
      },
      {
        id: 33,
        name: 'Karu',
      },
      {
        id: 34,
        name: 'Katampe',
      },
      {
        id: 35,
        name: 'Kaura',
      },
      {
        id: 36,
        name: 'Kpeyegyi',
      },
      {
        id: 3,
        name: 'Kubwa',
      },
      {
        id: 37,
        name: 'Kuchigoro',
      },
      {
        id: 38,
        name: 'Kuje',
      },
      {
        id: 39,
        name: 'Kurudu',
      },
      {
        id: 40,
        name: 'Kwali',
      },
      {
        id: 41,
        name: 'Lokogoma',
      },
      {
        id: 42,
        name: 'Lugbe District',
      },
      {
        id: 43,
        name: 'Mabushi',
      },
      {
        id: 44,
        name: 'Maitama',
      },
      {
        id: 45,
        name: 'Mararaba',
      },
      {
        id: 46,
        name: 'Masaka',
      },
      {
        id: 47,
        name: 'Mbora',
      },
      {
        id: 48,
        name: 'Mpape',
      },
      {
        id: 49,
        name: 'Nyanya',
      },
      {
        id: 50,
        name: 'Okanje',
      },
      {
        id: 51,
        name: 'Orozo',
      },
      {
        id: 52,
        name: 'Pyakasa',
      },
      {
        id: 53,
        name: 'Sabo Gida',
      },
      {
        id: 54,
        name: 'Utako',
      },
      {
        id: 55,
        name: 'Wumba',
      },
      {
        id: 4,
        name: 'Wuse',
      },
      {
        id: 5,
        name: 'Wuse 2',
      },
      {
        id: 56,
        name: 'Wuye',
      },
      {
        id: 57,
        name: 'Zuba',
      },
    ],
  },
  {
    id: 7,
    name: 'Adamawa',
    alias: 'adamawa',
    districts: [
      {
        id: 182,
        name: 'Demsa',
      },
      {
        id: 183,
        name: 'Fufore',
      },
      {
        id: 184,
        name: 'Ganye',
      },
      {
        id: 185,
        name: 'Girei',
      },
      {
        id: 186,
        name: 'Gombi',
      },
      {
        id: 187,
        name: 'Guyuk',
      },
      {
        id: 188,
        name: 'Hong',
      },
      {
        id: 189,
        name: 'Jada',
      },
      {
        id: 190,
        name: 'Lamurde',
      },
      {
        id: 191,
        name: 'Madagali',
      },
      {
        id: 192,
        name: 'Maiha',
      },
      {
        id: 193,
        name: 'Mayo-Belwa',
      },
      {
        id: 194,
        name: 'Michika',
      },
      {
        id: 195,
        name: 'Mubi North',
      },
      {
        id: 196,
        name: 'Mubi South',
      },
      {
        id: 197,
        name: 'Numan',
      },
      {
        id: 198,
        name: 'Shelleng',
      },
      {
        id: 199,
        name: 'Song',
      },
      {
        id: 200,
        name: 'Toungo',
      },
      {
        id: 180,
        name: 'Yola North',
      },
      {
        id: 181,
        name: 'Yola South',
      },
    ],
  },
  {
    id: 8,
    name: 'Akwa Ibom',
    alias: 'akwa_ibom',
    districts: [
      {
        id: 201,
        name: 'Abak',
      },
      {
        id: 205,
        name: 'Eastern Obolo',
      },
      {
        id: 206,
        name: 'Esit-Eket',
      },
      {
        id: 207,
        name: 'Essien Udim',
      },
      {
        id: 208,
        name: 'Etim-Ekpo',
      },
      {
        id: 209,
        name: 'Etinan',
      },
      {
        id: 210,
        name: 'Ibeno',
      },
      {
        id: 211,
        name: 'Ibesikpo Asutan',
      },
      {
        id: 212,
        name: 'Ibiono Ibom',
      },
      {
        id: 213,
        name: 'Ika',
      },
      {
        id: 214,
        name: 'Ikono',
      },
      {
        id: 215,
        name: 'Ikot Abasi',
      },
      {
        id: 202,
        name: 'Ikot Ekpene',
      },
      {
        id: 216,
        name: 'Ini',
      },
      {
        id: 217,
        name: 'Itu',
      },
      {
        id: 218,
        name: 'Mbo',
      },
      {
        id: 219,
        name: 'Mkpat Enin',
      },
      {
        id: 220,
        name: 'Nsit Atai',
      },
      {
        id: 221,
        name: 'Nsit Ibom',
      },
      {
        id: 222,
        name: 'Nsit Ubium',
      },
      {
        id: 223,
        name: 'Obot Akara',
      },
      {
        id: 224,
        name: 'Okobo',
      },
      {
        id: 225,
        name: 'Onna',
      },
      {
        id: 203,
        name: 'Oron',
      },
      {
        id: 226,
        name: 'Oruk Anam',
      },
      {
        id: 227,
        name: 'Udung Uko',
      },
      {
        id: 228,
        name: 'Ukanafun',
      },
      {
        id: 229,
        name: 'Uquo-Ibeno',
      },
      {
        id: 230,
        name: 'Uruan',
      },
      {
        id: 231,
        name: 'Urue-Offong/Oruko',
      },
      {
        id: 204,
        name: 'Uyo',
      },
    ],
  },
  {
    id: 9,
    name: 'Anambra',
    alias: 'anambra',
    districts: [
      {
        id: 236,
        name: 'Aghamelu',
      },
      {
        id: 237,
        name: 'Aguata',
      },
      {
        id: 238,
        name: 'Anambra East',
      },
      {
        id: 239,
        name: 'Anambra West',
      },
      {
        id: 240,
        name: 'Anaocha',
      },
      {
        id: 232,
        name: 'Awka',
      },
      {
        id: 241,
        name: 'Ayamelum',
      },
      {
        id: 242,
        name: 'Dunukofia',
      },
      {
        id: 243,
        name: 'Ekwusigo',
      },
      {
        id: 233,
        name: 'Idemili',
      },
      {
        id: 244,
        name: 'Ihiala',
      },
      {
        id: 245,
        name: 'Njikoka',
      },
      {
        id: 234,
        name: 'Nnewi',
      },
      {
        id: 246,
        name: 'Ogbaru',
      },
      {
        id: 235,
        name: 'Onitsha',
      },
      {
        id: 247,
        name: 'Orumba',
      },
    ],
  },
  {
    id: 10,
    name: 'Bauchi',
    alias: 'bauchi',
    districts: [
      {
        id: 250,
        name: 'Alkaleri',
      },
      {
        id: 248,
        name: 'Bauchi LGA',
      },
      {
        id: 249,
        name: 'Bogoro',
      },
      {
        id: 251,
        name: 'Damban',
      },
      {
        id: 252,
        name: 'Darazo',
      },
      {
        id: 253,
        name: 'Dass',
      },
      {
        id: 254,
        name: 'Gamawa',
      },
      {
        id: 255,
        name: 'Ganjuwa',
      },
      {
        id: 256,
        name: 'Giade',
      },
      {
        id: 257,
        name: 'Itas/Gadau',
      },
      {
        id: 258,
        name: 'Jama are',
      },
      {
        id: 259,
        name: 'Katagum',
      },
      {
        id: 260,
        name: 'Kirfi',
      },
      {
        id: 261,
        name: 'Misau',
      },
      {
        id: 262,
        name: 'Ningi',
      },
      {
        id: 263,
        name: 'Shira',
      },
      {
        id: 264,
        name: 'Toro',
      },
      {
        id: 265,
        name: 'Warji',
      },
      {
        id: 266,
        name: 'Zaki',
      },
    ],
  },
  {
    id: 11,
    name: 'Bayelsa',
    alias: 'bayelsa',
    districts: [
      {
        id: 268,
        name: 'Brass',
      },
      {
        id: 269,
        name: 'Ekeremor',
      },
      {
        id: 270,
        name: 'Kolokuma/Opokuma',
      },
      {
        id: 271,
        name: 'Nembe',
      },
      {
        id: 272,
        name: 'Ogbia',
      },
      {
        id: 273,
        name: 'Sagbama',
      },
      {
        id: 274,
        name: 'Southern Ijaw',
      },
      {
        id: 267,
        name: 'Yenagoa',
      },
    ],
  },
  {
    id: 12,
    name: 'Benue',
    alias: 'benue',
    districts: [
      {
        id: 279,
        name: 'Ado',
      },
      {
        id: 280,
        name: 'Agatu',
      },
      {
        id: 281,
        name: 'Apa',
      },
      {
        id: 282,
        name: 'Buruku',
      },
      {
        id: 275,
        name: 'Gboko',
      },
      {
        id: 283,
        name: 'Guma',
      },
      {
        id: 284,
        name: 'Gwer',
      },
      {
        id: 276,
        name: 'Katsina-Ala',
      },
      {
        id: 285,
        name: 'Konshisha',
      },
      {
        id: 286,
        name: 'Kwande',
      },
      {
        id: 287,
        name: 'Logo',
      },
      {
        id: 277,
        name: 'Makurdi',
      },
      {
        id: 288,
        name: 'Obi',
      },
      {
        id: 289,
        name: 'Ogbadibo',
      },
      {
        id: 290,
        name: 'Ohimini',
      },
      {
        id: 291,
        name: 'Oju',
      },
      {
        id: 292,
        name: 'Okpokwu',
      },
      {
        id: 278,
        name: 'Otukpo',
      },
      {
        id: 293,
        name: 'Tarka',
      },
      {
        id: 294,
        name: 'Ukum',
      },
      {
        id: 295,
        name: 'Ushongo',
      },
      {
        id: 296,
        name: 'Vandeikya',
      },
    ],
  },
  {
    id: 13,
    name: 'Borno',
    alias: 'borno',
    districts: [
      {
        id: 298,
        name: 'Abadam',
      },
      {
        id: 299,
        name: 'Askira/Uba',
      },
      {
        id: 300,
        name: 'Bama',
      },
      {
        id: 301,
        name: 'Bayo',
      },
      {
        id: 302,
        name: 'Biu',
      },
      {
        id: 303,
        name: 'Chibok',
      },
      {
        id: 304,
        name: 'Damboa',
      },
      {
        id: 305,
        name: 'Dikwa',
      },
      {
        id: 306,
        name: 'Gubio',
      },
      {
        id: 307,
        name: 'Guzamala',
      },
      {
        id: 308,
        name: 'Gwoza',
      },
      {
        id: 309,
        name: 'Hawul',
      },
      {
        id: 310,
        name: 'Jere',
      },
      {
        id: 311,
        name: 'Kaga',
      },
      {
        id: 312,
        name: 'Kala/Balge',
      },
      {
        id: 313,
        name: 'Konduga',
      },
      {
        id: 314,
        name: 'Kukawa',
      },
      {
        id: 315,
        name: 'Kwaya Kusar',
      },
      {
        id: 316,
        name: 'Mafa',
      },
      {
        id: 317,
        name: 'Magumeri',
      },
      {
        id: 297,
        name: 'Maiduguri',
      },
      {
        id: 318,
        name: 'Marte',
      },
      {
        id: 319,
        name: 'Mobbar',
      },
      {
        id: 320,
        name: 'Monguno',
      },
      {
        id: 321,
        name: 'Ngala',
      },
      {
        id: 322,
        name: 'Nganzai',
      },
      {
        id: 323,
        name: 'Shani',
      },
    ],
  },
  {
    id: 14,
    name: 'Cross',
    alias: 'cross_river',
    districts: [
      {
        id: 327,
        name: 'Abi',
      },
      {
        id: 328,
        name: 'Akamkpa',
      },
      {
        id: 329,
        name: 'Akpabuyo',
      },
      {
        id: 330,
        name: 'Bakassi',
      },
      {
        id: 331,
        name: 'Bekwara',
      },
      {
        id: 332,
        name: 'Biase',
      },
      {
        id: 333,
        name: 'Boki',
      },
      {
        id: 324,
        name: 'Calabar',
      },
      {
        id: 334,
        name: 'Etung',
      },
      {
        id: 325,
        name: 'Ikom',
      },
      {
        id: 335,
        name: 'Obanliku',
      },
      {
        id: 336,
        name: 'Obubra',
      },
      {
        id: 337,
        name: 'Obudu',
      },
      {
        id: 338,
        name: 'Odukpani',
      },
      {
        id: 326,
        name: 'Ogoja',
      },
      {
        id: 339,
        name: 'Yakuur',
      },
      {
        id: 340,
        name: 'Yala',
      },
    ],
  },
  {
    id: 15,
    name: 'Delta',
    alias: 'delta',
    districts: [
      {
        id: 346,
        name: 'Aniocha North',
      },
      {
        id: 347,
        name: 'Aniocha South',
      },
      {
        id: 348,
        name: 'Bomadi',
      },
      {
        id: 349,
        name: 'Burutu',
      },
      {
        id: 350,
        name: 'Ethiope East',
      },
      {
        id: 351,
        name: 'Ethiope West',
      },
      {
        id: 352,
        name: 'Ika North East',
      },
      {
        id: 353,
        name: 'Ika South',
      },
      {
        id: 354,
        name: 'Isoko',
      },
      {
        id: 355,
        name: 'Ndokwa East',
      },
      {
        id: 356,
        name: 'Ndokwa West',
      },
      {
        id: 357,
        name: 'Okpe',
      },
      {
        id: 358,
        name: 'Oshimili North',
      },
      {
        id: 341,
        name: 'Oshimili South',
      },
      {
        id: 359,
        name: 'Patani',
      },
      {
        id: 342,
        name: 'Sapele',
      },
      {
        id: 360,
        name: 'Udu',
      },
      {
        id: 343,
        name: 'Ugheli',
      },
      {
        id: 344,
        name: 'Uvwie',
      },
      {
        id: 345,
        name: 'Warri',
      },
    ],
  },
  {
    id: 16,
    name: 'Ebonyi',
    alias: 'ebonyi',
    districts: [
      {
        id: 361,
        name: 'Abakaliki',
      },
      {
        id: 362,
        name: 'Afikpo North',
      },
      {
        id: 363,
        name: 'Afikpo South',
      },
      {
        id: 364,
        name: 'Ebonyi',
      },
      {
        id: 365,
        name: 'Ezza',
      },
      {
        id: 366,
        name: 'Ikwo',
      },
      {
        id: 367,
        name: 'Ishielu',
      },
      {
        id: 368,
        name: 'Ivo',
      },
      {
        id: 369,
        name: 'Izzi',
      },
      {
        id: 370,
        name: 'Ohaozara',
      },
      {
        id: 371,
        name: 'Ohaukwu',
      },
      {
        id: 372,
        name: 'Onicha',
      },
    ],
  },
  {
    id: 17,
    name: 'Edo',
    alias: 'edo',
    districts: [
      {
        id: 378,
        name: 'Akoko-Edo',
      },
      {
        id: 379,
        name: 'Auchi',
      },
      {
        id: 373,
        name: 'Benin City',
      },
      {
        id: 374,
        name: 'Egor',
      },
      {
        id: 375,
        name: 'Ekpoma',
      },
      {
        id: 380,
        name: 'Esan North East',
      },
      {
        id: 381,
        name: 'Fugar',
      },
      {
        id: 382,
        name: 'Igueben',
      },
      {
        id: 376,
        name: 'Ikpoba-Okha',
      },
      {
        id: 383,
        name: 'Irrua',
      },
      {
        id: 377,
        name: 'Okada',
      },
      {
        id: 384,
        name: 'Orhionmwon',
      },
      {
        id: 385,
        name: 'Ovia South',
      },
      {
        id: 386,
        name: 'Owan',
      },
      {
        id: 387,
        name: 'Ubiaja',
      },
      {
        id: 388,
        name: 'Uhunmwonde',
      },
    ],
  },
  {
    id: 18,
    name: 'Ekiti',
    alias: 'ekiti',
    districts: [
      {
        id: 389,
        name: 'Ado Ekiti',
      },
      {
        id: 394,
        name: 'Aiyekire (Gbonyin)',
      },
      {
        id: 395,
        name: 'Aramoko',
      },
      {
        id: 396,
        name: 'Efon',
      },
      {
        id: 397,
        name: 'Emure',
      },
      {
        id: 390,
        name: 'Ido-Osi',
      },
      {
        id: 398,
        name: 'Ijero',
      },
      {
        id: 391,
        name: 'Ikere',
      },
      {
        id: 392,
        name: 'Ikole',
      },
      {
        id: 393,
        name: 'Ilawe',
      },
      {
        id: 399,
        name: 'Ilejemeje',
      },
      {
        id: 400,
        name: 'Irepodun/Ifelodun',
      },
      {
        id: 401,
        name: 'Ise/Orun',
      },
      {
        id: 402,
        name: 'Moba',
      },
      {
        id: 403,
        name: 'Omuo',
      },
      {
        id: 404,
        name: 'Oye',
      },
    ],
  },
  {
    id: 19,
    name: 'Enugu',
    alias: 'enugu',
    districts: [
      {
        id: 409,
        name: 'Aninri',
      },
      {
        id: 410,
        name: 'Awgu',
      },
      {
        id: 405,
        name: 'Enugu',
      },
      {
        id: 411,
        name: 'Ezeagu',
      },
      {
        id: 412,
        name: 'Igbo Eze South',
      },
      {
        id: 413,
        name: 'Igbo-Etiti',
      },
      {
        id: 414,
        name: 'Igbo-Eze North',
      },
      {
        id: 415,
        name: 'Isi-Uzo',
      },
      {
        id: 416,
        name: 'Nkanu East',
      },
      {
        id: 406,
        name: 'Nkanu West',
      },
      {
        id: 407,
        name: 'Nsukka',
      },
      {
        id: 417,
        name: 'Oji-River',
      },
      {
        id: 418,
        name: 'Udenu',
      },
      {
        id: 408,
        name: 'Udi',
      },
      {
        id: 419,
        name: 'Uzo-Uwani',
      },
    ],
  },
  {
    id: 20,
    name: 'Gombe',
    alias: 'gombe',
    districts: [
      {
        id: 421,
        name: 'Akko',
      },
      {
        id: 422,
        name: 'Balanga',
      },
      {
        id: 423,
        name: 'Billiri',
      },
      {
        id: 424,
        name: 'Dukku',
      },
      {
        id: 425,
        name: 'Funakaye',
      },
      {
        id: 420,
        name: 'Gombe LGA',
      },
      {
        id: 426,
        name: 'Kaltungo',
      },
      {
        id: 427,
        name: 'Kwami',
      },
      {
        id: 428,
        name: 'Nafada',
      },
      {
        id: 429,
        name: 'Shomgom',
      },
      {
        id: 430,
        name: 'Yamaltu/Deba',
      },
    ],
  },
  {
    id: 21,
    name: 'Imo',
    alias: 'imo',
    districts: [
      {
        id: 436,
        name: 'Aboh-Mbaise',
      },
      {
        id: 437,
        name: 'Ahiazu-Mbaise',
      },
      {
        id: 438,
        name: 'Ehime-Mbano',
      },
      {
        id: 439,
        name: 'Ezinihitte',
      },
      {
        id: 440,
        name: 'Ezinihitte Mbaise',
      },
      {
        id: 441,
        name: 'Ideato North',
      },
      {
        id: 442,
        name: 'Ideato South',
      },
      {
        id: 443,
        name: 'Ihitte/Uboma',
      },
      {
        id: 431,
        name: 'Ikeduru',
      },
      {
        id: 444,
        name: 'Isiala Mbano',
      },
      {
        id: 445,
        name: 'Isu',
      },
      {
        id: 432,
        name: 'Mbaitoli',
      },
      {
        id: 446,
        name: 'Ngor-Okpala',
      },
      {
        id: 447,
        name: 'Njaba',
      },
      {
        id: 448,
        name: 'Nkwerre',
      },
      {
        id: 449,
        name: 'Nwangele',
      },
      {
        id: 450,
        name: 'Obowo',
      },
      {
        id: 451,
        name: 'Oguta',
      },
      {
        id: 452,
        name: 'Ohaji/Egbema',
      },
      {
        id: 433,
        name: 'Okigwe',
      },
      {
        id: 453,
        name: 'Onuimo',
      },
      {
        id: 434,
        name: 'Orlu',
      },
      {
        id: 454,
        name: 'Orsu',
      },
      {
        id: 455,
        name: 'Oru',
      },
      {
        id: 435,
        name: 'Owerri',
      },
    ],
  },
  {
    id: 22,
    name: 'Jigawa',
    alias: 'jigawa',
    districts: [
      {
        id: 458,
        name: 'Auyo',
      },
      {
        id: 459,
        name: 'Babura',
      },
      {
        id: 460,
        name: 'Biriniwa',
      },
      {
        id: 461,
        name: 'Buji',
      },
      {
        id: 456,
        name: 'Dutse-Jigawa',
      },
      {
        id: 462,
        name: 'Gagarawa',
      },
      {
        id: 457,
        name: 'Garki',
      },
      {
        id: 463,
        name: 'Gumel',
      },
      {
        id: 464,
        name: 'Guri',
      },
      {
        id: 465,
        name: 'Gwaram',
      },
      {
        id: 466,
        name: 'Gwiwa',
      },
      {
        id: 467,
        name: 'Hadejia',
      },
      {
        id: 468,
        name: 'Jahun',
      },
      {
        id: 469,
        name: 'Kafin Hausa',
      },
      {
        id: 470,
        name: 'Kaugama',
      },
      {
        id: 471,
        name: 'Kazaure',
      },
      {
        id: 472,
        name: 'Kiri Kasamma',
      },
      {
        id: 473,
        name: 'Kiyawa',
      },
      {
        id: 474,
        name: 'Maigatari',
      },
      {
        id: 475,
        name: 'Malam Madori',
      },
      {
        id: 476,
        name: 'Miga',
      },
      {
        id: 477,
        name: 'Ringim',
      },
      {
        id: 478,
        name: 'Roni',
      },
      {
        id: 479,
        name: 'Sule-Tankarkar',
      },
      {
        id: 480,
        name: 'Taura',
      },
      {
        id: 481,
        name: 'Yankwashi',
      },
    ],
  },
  {
    id: 23,
    name: 'Kaduna',
    alias: 'kaduna',
    districts: [
      {
        id: 486,
        name: 'Birnin-Gwari',
      },
      {
        id: 482,
        name: 'Chikun',
      },
      {
        id: 487,
        name: 'Giwa',
      },
      {
        id: 483,
        name: 'Igabi',
      },
      {
        id: 488,
        name: 'Ikara',
      },
      {
        id: 489,
        name: 'Jaba',
      },
      {
        id: 490,
        name: 'Jema a',
      },
      {
        id: 491,
        name: 'Kachia',
      },
      {
        id: 484,
        name: 'Kaduna / Kaduna State',
      },
      {
        id: 492,
        name: 'Kagarko',
      },
      {
        id: 493,
        name: 'Kajuru',
      },
      {
        id: 494,
        name: 'Kaura-Kaduna',
      },
      {
        id: 495,
        name: 'Kauru',
      },
      {
        id: 496,
        name: 'Kubau',
      },
      {
        id: 497,
        name: 'Kudan',
      },
      {
        id: 498,
        name: 'Lere',
      },
      {
        id: 499,
        name: 'Makarfi',
      },
      {
        id: 500,
        name: 'Sanga',
      },
      {
        id: 501,
        name: 'Soba',
      },
      {
        id: 502,
        name: 'Zango-Kataf',
      },
      {
        id: 485,
        name: 'Zaria',
      },
    ],
  },
  {
    id: 24,
    name: 'Kano',
    alias: 'kano',
    districts: [
      {
        id: 507,
        name: 'Ajingi',
      },
      {
        id: 508,
        name: 'Albasu',
      },
      {
        id: 509,
        name: 'Bagwai',
      },
      {
        id: 510,
        name: 'Bebeji',
      },
      {
        id: 511,
        name: 'Bichi',
      },
      {
        id: 512,
        name: 'Bunkure',
      },
      {
        id: 513,
        name: 'Dala',
      },
      {
        id: 514,
        name: 'Dambatta',
      },
      {
        id: 515,
        name: 'Dawakin Kudu',
      },
      {
        id: 516,
        name: 'Dawakin Tofa',
      },
      {
        id: 517,
        name: 'Doguwa',
      },
      {
        id: 503,
        name: 'Fagge',
      },
      {
        id: 518,
        name: 'Gabasawa',
      },
      {
        id: 519,
        name: 'Garko',
      },
      {
        id: 520,
        name: 'Garum Mallam',
      },
      {
        id: 521,
        name: 'Garun Mallam',
      },
      {
        id: 522,
        name: 'Gaya',
      },
      {
        id: 523,
        name: 'Gezawa',
      },
      {
        id: 524,
        name: 'Gwale',
      },
      {
        id: 525,
        name: 'Gwarzo',
      },
      {
        id: 526,
        name: 'Kabo',
      },
      {
        id: 504,
        name: 'Kano Municipal',
      },
      {
        id: 527,
        name: 'Karaye',
      },
      {
        id: 528,
        name: 'Kibiya',
      },
      {
        id: 529,
        name: 'Kiru',
      },
      {
        id: 530,
        name: 'Kumbotso',
      },
      {
        id: 531,
        name: 'Kunchi',
      },
      {
        id: 532,
        name: 'Kura',
      },
      {
        id: 533,
        name: 'Madobi',
      },
      {
        id: 534,
        name: 'Makoda',
      },
      {
        id: 535,
        name: 'Minjibir',
      },
      {
        id: 505,
        name: 'Nasarawa-Kano',
      },
      {
        id: 536,
        name: 'Rano',
      },
      {
        id: 537,
        name: 'Rimin Gado',
      },
      {
        id: 538,
        name: 'Rogo',
      },
      {
        id: 539,
        name: 'Shanono',
      },
      {
        id: 540,
        name: 'Sumaila',
      },
      {
        id: 541,
        name: 'Takai',
      },
      {
        id: 506,
        name: 'Tarauni',
      },
      {
        id: 542,
        name: 'Tofa',
      },
      {
        id: 543,
        name: 'Tsanyawa',
      },
      {
        id: 544,
        name: 'Tudun Wada',
      },
      {
        id: 545,
        name: 'Ungogo',
      },
      {
        id: 546,
        name: 'Warawa',
      },
      {
        id: 547,
        name: 'Wudil',
      },
    ],
  },
  {
    id: 25,
    name: 'Katsina',
    alias: 'katsina',
    districts: [
      {
        id: 552,
        name: 'Bakori',
      },
      {
        id: 553,
        name: 'Batagarawa',
      },
      {
        id: 554,
        name: 'Batsari',
      },
      {
        id: 555,
        name: 'Baure',
      },
      {
        id: 556,
        name: 'Bindawa',
      },
      {
        id: 557,
        name: 'Charanchi',
      },
      {
        id: 558,
        name: 'Dan Musa',
      },
      {
        id: 559,
        name: 'Dandume',
      },
      {
        id: 548,
        name: 'Danja',
      },
      {
        id: 549,
        name: 'Daura',
      },
      {
        id: 560,
        name: 'Dutsi',
      },
      {
        id: 561,
        name: 'Dutsin-Ma',
      },
      {
        id: 562,
        name: 'Faskari',
      },
      {
        id: 563,
        name: 'Funtua',
      },
      {
        id: 564,
        name: 'Ingawa',
      },
      {
        id: 565,
        name: 'Jibia',
      },
      {
        id: 566,
        name: 'Kafur',
      },
      {
        id: 567,
        name: 'Kaita',
      },
      {
        id: 568,
        name: 'Kankara',
      },
      {
        id: 569,
        name: 'Kankia',
      },
      {
        id: 550,
        name: 'Katsina',
      },
      {
        id: 570,
        name: 'Kurfi',
      },
      {
        id: 571,
        name: 'Kusada',
      },
      {
        id: 572,
        name: 'Mai adua',
      },
      {
        id: 573,
        name: 'Malumfashi',
      },
      {
        id: 574,
        name: 'Mani',
      },
      {
        id: 575,
        name: 'Mashi',
      },
      {
        id: 576,
        name: 'Matazu',
      },
      {
        id: 577,
        name: 'Musawa',
      },
      {
        id: 578,
        name: 'Rimi',
      },
      {
        id: 579,
        name: 'Sabuwa',
      },
      {
        id: 580,
        name: 'Safana',
      },
      {
        id: 581,
        name: 'Sandamu',
      },
      {
        id: 551,
        name: 'Zango',
      },
    ],
  },
  {
    id: 26,
    name: 'Kebbi',
    alias: 'kebbi',
    districts: [
      {
        id: 585,
        name: 'Aleiro',
      },
      {
        id: 586,
        name: 'Arewa-Dandi',
      },
      {
        id: 587,
        name: 'Argungu',
      },
      {
        id: 588,
        name: 'Augie',
      },
      {
        id: 589,
        name: 'Bagudo',
      },
      {
        id: 582,
        name: 'Birnin Kebbi',
      },
      {
        id: 590,
        name: 'Bunza',
      },
      {
        id: 591,
        name: 'Dandi',
      },
      {
        id: 592,
        name: 'Fakai',
      },
      {
        id: 593,
        name: 'Gwandu',
      },
      {
        id: 583,
        name: 'Jega',
      },
      {
        id: 594,
        name: 'Kalgo',
      },
      {
        id: 595,
        name: 'Koko/Besse',
      },
      {
        id: 596,
        name: 'Maiyama',
      },
      {
        id: 597,
        name: 'Ngaski',
      },
      {
        id: 598,
        name: 'Sakaba',
      },
      {
        id: 599,
        name: 'Shanga',
      },
      {
        id: 600,
        name: 'Suru',
      },
      {
        id: 601,
        name: 'Wasagu/Danko',
      },
      {
        id: 602,
        name: 'Yauri',
      },
      {
        id: 584,
        name: 'Zuru',
      },
    ],
  },
  {
    id: 27,
    name: 'Kogi',
    alias: 'kogi',
    districts: [
      {
        id: 605,
        name: 'Adavi',
      },
      {
        id: 606,
        name: 'Ajaokuta',
      },
      {
        id: 607,
        name: 'Ankpa',
      },
      {
        id: 608,
        name: 'Bassa',
      },
      {
        id: 609,
        name: 'Dekina',
      },
      {
        id: 610,
        name: 'Ibaji',
      },
      {
        id: 611,
        name: 'Idah',
      },
      {
        id: 612,
        name: 'Igala Mela',
      },
      {
        id: 613,
        name: 'Igalamela-Odolu',
      },
      {
        id: 614,
        name: 'Ijumu',
      },
      {
        id: 615,
        name: 'Kabba/Bunu',
      },
      {
        id: 616,
        name: 'Kogi LGA',
      },
      {
        id: 617,
        name: 'Koton Karfe',
      },
      {
        id: 603,
        name: 'Lokoja',
      },
      {
        id: 618,
        name: 'Mopa-Muro',
      },
      {
        id: 619,
        name: 'Ofu',
      },
      {
        id: 620,
        name: 'Ogori/Magongo',
      },
      {
        id: 621,
        name: 'Okehi',
      },
      {
        id: 604,
        name: 'Okene',
      },
      {
        id: 622,
        name: 'Olamaboro',
      },
      {
        id: 623,
        name: 'Omala',
      },
      {
        id: 624,
        name: 'Yagba East',
      },
      {
        id: 625,
        name: 'Yagba West',
      },
    ],
  },
  {
    id: 28,
    name: 'Kwara',
    alias: 'kwara',
    districts: [
      {
        id: 629,
        name: 'Asa',
      },
      {
        id: 630,
        name: 'Baruten',
      },
      {
        id: 631,
        name: 'Edu',
      },
      {
        id: 632,
        name: 'Ekiti-Kwara',
      },
      {
        id: 633,
        name: 'Ifelodun-Kwara',
      },
      {
        id: 626,
        name: 'Ilorin East',
      },
      {
        id: 627,
        name: 'Ilorin South',
      },
      {
        id: 628,
        name: 'Ilorin West',
      },
      {
        id: 634,
        name: 'Irepodun-Kwara',
      },
      {
        id: 635,
        name: 'Isin',
      },
      {
        id: 636,
        name: 'Kaiama',
      },
      {
        id: 637,
        name: 'Moro',
      },
      {
        id: 638,
        name: 'Oke-Ero',
      },
      {
        id: 639,
        name: 'Oyun',
      },
      {
        id: 640,
        name: 'Pategi',
      },
    ],
  },
  {
    id: 2,
    name: 'Lagos',
    alias: 'lagos',
    districts: [
      {
        id: 63,
        name: 'Abule Egba',
      },
      {
        id: 64,
        name: 'Agbara-Igbesan',
      },
      {
        id: 65,
        name: 'Agboyi/Ketu',
      },
      {
        id: 66,
        name: 'Agege',
      },
      {
        id: 58,
        name: 'Ajah',
      },
      {
        id: 59,
        name: 'Alimosho',
      },
      {
        id: 67,
        name: 'Amuwo-Odofin',
      },
      {
        id: 68,
        name: 'Badagry',
      },
      {
        id: 69,
        name: 'Egbe Idimu',
      },
      {
        id: 70,
        name: 'Ejigbo',
      },
      {
        id: 71,
        name: 'Eko Atlantic',
      },
      {
        id: 72,
        name: 'Epe',
      },
      {
        id: 73,
        name: 'Gbagada',
      },
      {
        id: 74,
        name: 'Ibeju',
      },
      {
        id: 75,
        name: 'Ifako-Ijaiye',
      },
      {
        id: 60,
        name: 'Ikeja',
      },
      {
        id: 76,
        name: 'Ikorodu',
      },
      {
        id: 77,
        name: 'Ikotun/Igando',
      },
      {
        id: 78,
        name: 'Ikoyi',
      },
      {
        id: 79,
        name: 'Ilashe',
      },
      {
        id: 80,
        name: 'Ilupeju',
      },
      {
        id: 81,
        name: 'Ipaja',
      },
      {
        id: 82,
        name: 'Isolo',
      },
      {
        id: 83,
        name: 'Kosofe',
      },
      {
        id: 84,
        name: 'Lagos Island (Eko)',
      },
      {
        id: 85,
        name: 'Lekki',
      },
      {
        id: 86,
        name: 'Magodo',
      },
      {
        id: 87,
        name: 'Maryland',
      },
      {
        id: 88,
        name: 'Mushin',
      },
      {
        id: 89,
        name: 'Ogba',
      },
      {
        id: 90,
        name: 'Ogudu',
      },
      {
        id: 61,
        name: 'Ojo',
      },
      {
        id: 91,
        name: 'Ojodu',
      },
      {
        id: 92,
        name: 'Ojota',
      },
      {
        id: 93,
        name: 'Orile',
      },
      {
        id: 94,
        name: 'Oshodi',
      },
      {
        id: 95,
        name: 'Shomolu',
      },
      {
        id: 62,
        name: 'Surulere',
      },
      {
        id: 96,
        name: 'Tarkwa Bay Island',
      },
      {
        id: 97,
        name: 'Victoria Island',
      },
      {
        id: 98,
        name: 'Yaba',
      },
    ],
  },
  {
    id: 29,
    name: 'Nasarawa',
    alias: 'nasarawa',
    districts: [
      {
        id: 644,
        name: 'Akwanga',
      },
      {
        id: 645,
        name: 'Awe',
      },
      {
        id: 646,
        name: 'Doma',
      },
      {
        id: 641,
        name: 'Karu-Nasarawa',
      },
      {
        id: 647,
        name: 'Keana',
      },
      {
        id: 642,
        name: 'Keffi',
      },
      {
        id: 648,
        name: 'Kokona',
      },
      {
        id: 643,
        name: 'Lafia',
      },
      {
        id: 649,
        name: 'Nasarawa',
      },
      {
        id: 650,
        name: 'Nasarawa-Eggon',
      },
      {
        id: 651,
        name: 'Obi-Nasarawa',
      },
      {
        id: 652,
        name: 'Toto',
      },
    ],
  },
  {
    id: 30,
    name: 'Niger',
    alias: 'niger',
    districts: [
      {
        id: 658,
        name: 'Agaie',
      },
      {
        id: 659,
        name: 'Agwara',
      },
      {
        id: 653,
        name: 'Bida',
      },
      {
        id: 660,
        name: 'Borgu',
      },
      {
        id: 654,
        name: 'Bosso',
      },
      {
        id: 655,
        name: 'Chanchaga',
      },
      {
        id: 661,
        name: 'Edati',
      },
      {
        id: 662,
        name: 'Gbako',
      },
      {
        id: 663,
        name: 'Gurara',
      },
      {
        id: 664,
        name: 'Kontagora',
      },
      {
        id: 665,
        name: 'Lapai',
      },
      {
        id: 666,
        name: 'Lavun',
      },
      {
        id: 667,
        name: 'Magama',
      },
      {
        id: 668,
        name: 'Mariga',
      },
      {
        id: 669,
        name: 'Mashegu',
      },
      {
        id: 656,
        name: 'Minna',
      },
      {
        id: 670,
        name: 'Mokwa',
      },
      {
        id: 671,
        name: 'Muya',
      },
      {
        id: 672,
        name: 'Paikoro',
      },
      {
        id: 673,
        name: 'Rafi',
      },
      {
        id: 674,
        name: 'Rijau',
      },
      {
        id: 675,
        name: 'Shiroro',
      },
      {
        id: 657,
        name: 'Suleja',
      },
      {
        id: 676,
        name: 'Tafa',
      },
      {
        id: 677,
        name: 'Wushishi',
      },
    ],
  },
  {
    id: 3,
    name: 'Ogun',
    alias: 'ogun',
    districts: [
      {
        id: 104,
        name: 'Abeokuta North',
      },
      {
        id: 99,
        name: 'Abeokuta South',
      },
      {
        id: 100,
        name: 'Ado-Odo/Ota',
      },
      {
        id: 105,
        name: 'Ayetoro',
      },
      {
        id: 106,
        name: 'Ewekoro',
      },
      {
        id: 107,
        name: 'Ifo',
      },
      {
        id: 108,
        name: 'Ijebu',
      },
      {
        id: 101,
        name: 'Ijebu Ode',
      },
      {
        id: 109,
        name: 'Ikenne',
      },
      {
        id: 110,
        name: 'Ilaro',
      },
      {
        id: 111,
        name: 'Imeko Afon',
      },
      {
        id: 112,
        name: 'Ipokia',
      },
      {
        id: 102,
        name: 'Obafemi-Owode',
      },
      {
        id: 113,
        name: 'Odeda',
      },
      {
        id: 114,
        name: 'Odogbolu',
      },
      {
        id: 115,
        name: 'Ogun Waterside',
      },
      {
        id: 116,
        name: 'Remo North',
      },
      {
        id: 103,
        name: 'Sagamu',
      },
    ],
  },
  {
    id: 31,
    name: 'Ondo',
    alias: 'ondo',
    districts: [
      {
        id: 683,
        name: 'Akungba',
      },
      {
        id: 678,
        name: 'Akure',
      },
      {
        id: 684,
        name: 'Ese-Odo',
      },
      {
        id: 685,
        name: 'Idanre',
      },
      {
        id: 686,
        name: 'Ifedore',
      },
      {
        id: 679,
        name: 'Iju/Itaogbolu',
      },
      {
        id: 687,
        name: 'Ikare Akoko',
      },
      {
        id: 688,
        name: 'Ilaje',
      },
      {
        id: 689,
        name: 'Ile-Oluji-Okeigbo',
      },
      {
        id: 690,
        name: 'Irele',
      },
      {
        id: 691,
        name: 'Isua',
      },
      {
        id: 692,
        name: 'Odigbo',
      },
      {
        id: 693,
        name: 'Oka',
      },
      {
        id: 694,
        name: 'Okeagbe',
      },
      {
        id: 695,
        name: 'Okeigbo',
      },
      {
        id: 680,
        name: 'Okitipupa',
      },
      {
        id: 681,
        name: 'Ondo / Ondo State',
      },
      {
        id: 696,
        name: 'Ose',
      },
      {
        id: 682,
        name: 'Owo',
      },
    ],
  },
  {
    id: 32,
    name: 'Osun',
    alias: 'osun',
    districts: [
      {
        id: 702,
        name: 'Aiyedade',
      },
      {
        id: 703,
        name: 'Aiyedire',
      },
      {
        id: 704,
        name: 'Atakumosa East',
      },
      {
        id: 705,
        name: 'Atakumosa West',
      },
      {
        id: 706,
        name: 'Boluwaduro',
      },
      {
        id: 697,
        name: 'Ede',
      },
      {
        id: 707,
        name: 'Egbedore',
      },
      {
        id: 698,
        name: 'Ife',
      },
      {
        id: 708,
        name: 'Ifedayo',
      },
      {
        id: 709,
        name: 'Ifelodun-Osun',
      },
      {
        id: 710,
        name: 'Ila',
      },
      {
        id: 699,
        name: 'Ilesa',
      },
      {
        id: 711,
        name: 'Irepodun-Osun',
      },
      {
        id: 712,
        name: 'Irewole',
      },
      {
        id: 713,
        name: 'Isokan',
      },
      {
        id: 714,
        name: 'Iwo',
      },
      {
        id: 715,
        name: 'Obokun',
      },
      {
        id: 716,
        name: 'Ola-Oluwa',
      },
      {
        id: 700,
        name: 'Olorunda-Osun',
      },
      {
        id: 717,
        name: 'Oriade',
      },
      {
        id: 718,
        name: 'Orolu',
      },
      {
        id: 701,
        name: 'Osogbo',
      },
    ],
  },
  {
    id: 4,
    name: 'Oyo',
    alias: 'oyo',
    districts: [
      {
        id: 122,
        name: 'Afijio',
      },
      {
        id: 117,
        name: 'Akinyele',
      },
      {
        id: 123,
        name: 'Atiba',
      },
      {
        id: 124,
        name: 'Atisbo',
      },
      {
        id: 125,
        name: 'Ayete',
      },
      {
        id: 118,
        name: 'Egbeda',
      },
      {
        id: 126,
        name: 'Eruwa',
      },
      {
        id: 119,
        name: 'Ibadan',
      },
      {
        id: 120,
        name: 'Ido',
      },
      {
        id: 127,
        name: 'Igbo Ora',
      },
      {
        id: 128,
        name: 'Irepo',
      },
      {
        id: 129,
        name: 'Iseyin',
      },
      {
        id: 130,
        name: 'Itesiwaju',
      },
      {
        id: 131,
        name: 'Iwajowa',
      },
      {
        id: 132,
        name: 'Kajola',
      },
      {
        id: 133,
        name: 'Lagelu',
      },
      {
        id: 134,
        name: 'Ogbomosho North',
      },
      {
        id: 135,
        name: 'Ogbomosho South',
      },
      {
        id: 136,
        name: 'Ogo Oluwa',
      },
      {
        id: 137,
        name: 'Olorunsogo',
      },
      {
        id: 121,
        name: 'Oluyole',
      },
      {
        id: 138,
        name: 'Ona-Ara',
      },
      {
        id: 139,
        name: 'Orelope',
      },
      {
        id: 140,
        name: 'Ori Ire',
      },
      {
        id: 141,
        name: 'Oyo',
      },
      {
        id: 142,
        name: 'Saki East',
      },
      {
        id: 143,
        name: 'Saki West',
      },
      {
        id: 144,
        name: 'Surulere-Oyo',
      },
    ],
  },
  {
    id: 33,
    name: 'Plateau',
    alias: 'plateau',
    districts: [
      {
        id: 720,
        name: 'Barkin Ladi',
      },
      {
        id: 721,
        name: 'Bassa-Plateau',
      },
      {
        id: 722,
        name: 'Bokkos',
      },
      {
        id: 719,
        name: 'Jos',
      },
      {
        id: 723,
        name: 'Kanam',
      },
      {
        id: 724,
        name: 'Kanke',
      },
      {
        id: 725,
        name: 'Langtang North',
      },
      {
        id: 726,
        name: 'Langtang South',
      },
      {
        id: 727,
        name: 'Mangu',
      },
      {
        id: 728,
        name: 'Mikang',
      },
      {
        id: 729,
        name: 'Pankshin',
      },
      {
        id: 730,
        name: 'Quaan Pan',
      },
      {
        id: 731,
        name: 'Riyom',
      },
      {
        id: 732,
        name: 'Shendam',
      },
      {
        id: 733,
        name: 'Wase',
      },
    ],
  },
  {
    id: 5,
    name: 'Rivers',
    alias: 'rivers',
    districts: [
      {
        id: 150,
        name: 'Abua/Odual',
      },
      {
        id: 151,
        name: 'Ahoada',
      },
      {
        id: 152,
        name: 'Akuku Toru',
      },
      {
        id: 153,
        name: 'Andoni',
      },
      {
        id: 154,
        name: 'Asari-Toru',
      },
      {
        id: 155,
        name: 'Bonny',
      },
      {
        id: 156,
        name: 'Degema',
      },
      {
        id: 145,
        name: 'Eleme',
      },
      {
        id: 157,
        name: 'Emohua',
      },
      {
        id: 158,
        name: 'Etche',
      },
      {
        id: 159,
        name: 'Gokana',
      },
      {
        id: 146,
        name: 'Ikwerre',
      },
      {
        id: 160,
        name: 'Khana',
      },
      {
        id: 147,
        name: 'Obio-Akpor',
      },
      {
        id: 161,
        name: 'Ogba/Egbema/Ndoni',
      },
      {
        id: 162,
        name: 'Ogu/Bolo',
      },
      {
        id: 163,
        name: 'Okrika',
      },
      {
        id: 164,
        name: 'Omuma',
      },
      {
        id: 148,
        name: 'Oyigbo',
      },
      {
        id: 149,
        name: 'Port-Harcourt',
      },
      {
        id: 165,
        name: 'Tai',
      },
    ],
  },
  {
    id: 34,
    name: 'Sokoto',
    alias: 'sokoto',
    districts: [
      {
        id: 737,
        name: 'Binji',
      },
      {
        id: 738,
        name: 'Bodinga',
      },
      {
        id: 739,
        name: 'Dange-Shuni',
      },
      {
        id: 740,
        name: 'Gada',
      },
      {
        id: 741,
        name: 'Goronyo',
      },
      {
        id: 742,
        name: 'Gudu LGA',
      },
      {
        id: 743,
        name: 'Gwadabawa',
      },
      {
        id: 734,
        name: 'Illela',
      },
      {
        id: 744,
        name: 'Isa',
      },
      {
        id: 745,
        name: 'Kebbe',
      },
      {
        id: 746,
        name: 'Kware',
      },
      {
        id: 747,
        name: 'Rabah',
      },
      {
        id: 748,
        name: 'Sabon Birni',
      },
      {
        id: 749,
        name: 'Shagari',
      },
      {
        id: 750,
        name: 'Silame',
      },
      {
        id: 735,
        name: 'Sokoto North',
      },
      {
        id: 736,
        name: 'Sokoto South',
      },
      {
        id: 751,
        name: 'Tambuwal',
      },
      {
        id: 752,
        name: 'Tangaza',
      },
      {
        id: 753,
        name: 'Tureta',
      },
      {
        id: 754,
        name: 'Wamako',
      },
      {
        id: 755,
        name: 'Wurno',
      },
      {
        id: 756,
        name: 'Yabo',
      },
    ],
  },
  {
    id: 35,
    name: 'Taraba',
    alias: 'taraba',
    districts: [
      {
        id: 760,
        name: 'Ardo-Kola',
      },
      {
        id: 761,
        name: 'Bali',
      },
      {
        id: 762,
        name: 'Donga',
      },
      {
        id: 763,
        name: 'Gashaka',
      },
      {
        id: 764,
        name: 'Gassol',
      },
      {
        id: 765,
        name: 'Ibi',
      },
      {
        id: 757,
        name: 'Jalingo',
      },
      {
        id: 766,
        name: 'Karim-Lamido',
      },
      {
        id: 767,
        name: 'Kurmi',
      },
      {
        id: 768,
        name: 'Lau',
      },
      {
        id: 769,
        name: 'Sardauna',
      },
      {
        id: 758,
        name: 'Takum',
      },
      {
        id: 770,
        name: 'Ussa',
      },
      {
        id: 759,
        name: 'Wukari',
      },
      {
        id: 771,
        name: 'Yorro',
      },
      {
        id: 772,
        name: 'Zing',
      },
    ],
  },
  {
    id: 36,
    name: 'Yobe',
    alias: 'yobe',
    districts: [
      {
        id: 775,
        name: 'Bade',
      },
      {
        id: 776,
        name: 'Bursari',
      },
      {
        id: 773,
        name: 'Damaturu',
      },
      {
        id: 777,
        name: 'Fika',
      },
      {
        id: 778,
        name: 'Fune',
      },
      {
        id: 779,
        name: 'Geidam',
      },
      {
        id: 780,
        name: 'Gujba',
      },
      {
        id: 781,
        name: 'Gulani',
      },
      {
        id: 782,
        name: 'Jakusko',
      },
      {
        id: 783,
        name: 'Karasuwa',
      },
      {
        id: 784,
        name: 'Machina',
      },
      {
        id: 785,
        name: 'Nangere',
      },
      {
        id: 786,
        name: 'Nguru',
      },
      {
        id: 774,
        name: 'Potiskum',
      },
      {
        id: 787,
        name: 'Tarmua',
      },
      {
        id: 788,
        name: 'Yunusari',
      },
      {
        id: 789,
        name: 'Yusufari',
      },
    ],
  },
  {
    id: 37,
    name: 'Zamfara',
    alias: 'zamfara',
    districts: [
      {
        id: 791,
        name: 'Anka',
      },
      {
        id: 792,
        name: 'Bakura',
      },
      {
        id: 793,
        name: 'Birnin Magaji',
      },
      {
        id: 794,
        name: 'Bukkuyum',
      },
      {
        id: 795,
        name: 'Bungudu',
      },
      {
        id: 796,
        name: 'Gummi',
      },
      {
        id: 790,
        name: 'Gusau',
      },
      {
        id: 797,
        name: 'Kaura Namoda',
      },
      {
        id: 798,
        name: 'Maradun',
      },
      {
        id: 799,
        name: 'Maru',
      },
      {
        id: 800,
        name: 'Shinkafi',
      },
      {
        id: 801,
        name: 'Talata Mafara',
      },
      {
        id: 802,
        name: 'Tsafe',
      },
      {
        id: 803,
        name: 'Zurmi',
      },
    ],
  },
];

export const DIAL_CODES = [
  {
    name: 'Afghanistan',
    dial_code: '+93',
    code: 'AF',
    emoji: '🇦🇫',
  },
  {
    name: 'Aland Islands',
    dial_code: '+358',
    code: 'AX',
    emoji: '🇦🇽',
  },
  {
    name: 'Albania',
    dial_code: '+355',
    code: 'AL',
    emoji: '🇦🇱',
  },
  {
    name: 'Algeria',
    dial_code: '+213',
    code: 'DZ',
    emoji: '🇩🇿',
  },
  {
    name: 'AmericanSamoa',
    dial_code: '+1684',
    code: 'AS',
    emoji: '🇦🇸',
  },
  {
    name: 'Andorra',
    dial_code: '+376',
    code: 'AD',
    emoji: '🇦🇩',
  },
  {
    name: 'Angola',
    dial_code: '+244',
    code: 'AO',
    emoji: '🇦🇴',
  },
  {
    name: 'Anguilla',
    dial_code: '+1264',
    code: 'AI',
    emoji: '🇦🇮',
  },
  {
    name: 'Antarctica',
    dial_code: '+672',
    code: 'AQ',
    emoji: '🇦🇶',
  },
  {
    name: 'Antigua and Barbuda',
    dial_code: '+1268',
    code: 'AG',
    emoji: '🇦🇬',
  },
  {
    name: 'Argentina',
    dial_code: '+54',
    code: 'AR',
    emoji: '🇦🇷',
  },
  {
    name: 'Armenia',
    dial_code: '+374',
    code: 'AM',
    emoji: '🇦🇲',
  },
  {
    name: 'Aruba',
    dial_code: '+297',
    code: 'AW',
    emoji: '🇦🇼',
  },
  {
    name: 'Australia',
    dial_code: '+61',
    code: 'AU',
    emoji: '🇦🇺',
  },
  {
    name: 'Austria',
    dial_code: '+43',
    code: 'AT',
    emoji: '🇦🇹',
  },
  {
    name: 'Azerbaijan',
    dial_code: '+994',
    code: 'AZ',
    emoji: '🇦🇿',
  },
  {
    name: 'Bahamas',
    dial_code: '+1242',
    code: 'BS',
    emoji: '🇧🇸',
  },
  {
    name: 'Bahrain',
    dial_code: '+973',
    code: 'BH',
    emoji: '🇧🇭',
  },
  {
    name: 'Bangladesh',
    dial_code: '+880',
    code: 'BD',
    emoji: '🇧🇩',
  },
  {
    name: 'Barbados',
    dial_code: '+1246',
    code: 'BB',
    emoji: '🇧🇧',
  },
  {
    name: 'Belarus',
    dial_code: '+375',
    code: 'BY',
    emoji: '🇧🇾',
  },
  {
    name: 'Belgium',
    dial_code: '+32',
    code: 'BE',
    emoji: '🇧🇪',
  },
  {
    name: 'Belize',
    dial_code: '+501',
    code: 'BZ',
    emoji: '🇧🇿',
  },
  {
    name: 'Benin',
    dial_code: '+229',
    code: 'BJ',
    emoji: '🇧🇯',
  },
  {
    name: 'Bermuda',
    dial_code: '+1441',
    code: 'BM',
    emoji: '🇧🇲',
  },
  {
    name: 'Bhutan',
    dial_code: '+975',
    code: 'BT',
    emoji: '🇧🇹',
  },
  {
    name: 'Bolivia, Plurinational State of',
    dial_code: '+591',
    code: 'BO',
    emoji: '🇧🇴',
  },
  {
    name: 'Bosnia and Herzegovina',
    dial_code: '+387',
    code: 'BA',
    emoji: '🇧🇦',
  },
  {
    name: 'Botswana',
    dial_code: '+267',
    code: 'BW',
    emoji: '🇧🇼',
  },
  {
    name: 'Brazil',
    dial_code: '+55',
    code: 'BR',
    emoji: '🇧🇷',
  },
  {
    name: 'British Indian Ocean Territory',
    dial_code: '+246',
    code: 'IO',
    emoji: '🇮🇴',
  },
  {
    name: 'Brunei Darussalam',
    dial_code: '+673',
    code: 'BN',
    emoji: '🇧🇳',
  },
  {
    name: 'Bulgaria',
    dial_code: '+359',
    code: 'BG',
    emoji: '🇧🇬',
  },
  {
    name: 'Burkina Faso',
    dial_code: '+226',
    code: 'BF',
    emoji: '🇧🇫',
  },
  {
    name: 'Burundi',
    dial_code: '+257',
    code: 'BI',
    emoji: '🇧🇮',
  },
  {
    name: 'Cambodia',
    dial_code: '+855',
    code: 'KH',
    emoji: '🇰🇭',
  },
  {
    name: 'Cameroon',
    dial_code: '+237',
    code: 'CM',
    emoji: '🇨🇲',
  },
  {
    name: 'Canada',
    dial_code: '+1',
    code: 'CA',
    emoji: '🇨🇦',
  },
  {
    name: 'Cape Verde',
    dial_code: '+238',
    code: 'CV',
    emoji: '🇨🇻',
  },
  {
    name: 'Cayman Islands',
    dial_code: '+ 345',
    code: 'KY',
    emoji: '🇰🇾',
  },
  {
    name: 'Central African Republic',
    dial_code: '+236',
    code: 'CF',
    emoji: '🇨🇫',
  },
  {
    name: 'Chad',
    dial_code: '+235',
    code: 'TD',
    emoji: '🇹🇩',
  },
  {
    name: 'Chile',
    dial_code: '+56',
    code: 'CL',
    emoji: '🇨🇱',
  },
  {
    name: 'China',
    dial_code: '+86',
    code: 'CN',
    emoji: '🇨🇳',
  },
  {
    name: 'Christmas Island',
    dial_code: '+61',
    code: 'CX',
    emoji: '🇨🇽',
  },
  {
    name: 'Cocos (Keeling) Islands',
    dial_code: '+61',
    code: 'CC',
    emoji: '🇨🇨',
  },
  {
    name: 'Colombia',
    dial_code: '+57',
    code: 'CO',
    emoji: '🇨🇴',
  },
  {
    name: 'Comoros',
    dial_code: '+269',
    code: 'KM',
    emoji: '🇰🇲',
  },
  {
    name: 'Congo',
    dial_code: '+242',
    code: 'CG',
    emoji: '🇨🇬',
  },
  {
    name: 'Congo, The Democratic Republic of the Congo',
    dial_code: '+243',
    code: 'CD',
    emoji: '🇨🇩',
  },
  {
    name: 'Cook Islands',
    dial_code: '+682',
    code: 'CK',
    emoji: '🇨🇰',
  },
  {
    name: 'Costa Rica',
    dial_code: '+506',
    code: 'CR',
    emoji: '🇨🇷',
  },
  {
    name: "Cote d'Ivoire",
    dial_code: '+225',
    code: 'CI',
    emoji: '🇨🇮',
  },
  {
    name: 'Croatia',
    dial_code: '+385',
    code: 'HR',
    emoji: '🇭🇷',
  },
  {
    name: 'Cuba',
    dial_code: '+53',
    code: 'CU',
    emoji: '🇨🇺',
  },
  {
    name: 'Cyprus',
    dial_code: '+357',
    code: 'CY',
    emoji: '🇨🇾',
  },
  {
    name: 'Czech Republic',
    dial_code: '+420',
    code: 'CZ',
    emoji: '🇨🇿',
  },
  {
    name: 'Denmark',
    dial_code: '+45',
    code: 'DK',
    emoji: '🇩🇰',
  },
  {
    name: 'Djibouti',
    dial_code: '+253',
    code: 'DJ',
    emoji: '🇩🇯',
  },
  {
    name: 'Dominica',
    dial_code: '+1767',
    code: 'DM',
    emoji: '🇩🇲',
  },
  {
    name: 'Dominican Republic',
    dial_code: '+1849',
    code: 'DO',
    emoji: '🇩🇴',
  },
  {
    name: 'Ecuador',
    dial_code: '+593',
    code: 'EC',
    emoji: '🇪🇨',
  },
  {
    name: 'Egypt',
    dial_code: '+20',
    code: 'EG',
    emoji: '🇪🇬',
  },
  {
    name: 'El Salvador',
    dial_code: '+503',
    code: 'SV',
    emoji: '🇸🇻',
  },
  {
    name: 'Equatorial Guinea',
    dial_code: '+240',
    code: 'GQ',
    emoji: '🇬🇶',
  },
  {
    name: 'Eritrea',
    dial_code: '+291',
    code: 'ER',
    emoji: '🇪🇷',
  },
  {
    name: 'Estonia',
    dial_code: '+372',
    code: 'EE',
    emoji: '🇪🇪',
  },
  {
    name: 'Ethiopia',
    dial_code: '+251',
    code: 'ET',
    emoji: '🇪🇹',
  },
  {
    name: 'Falkland Islands (Malvinas)',
    dial_code: '+500',
    code: 'FK',
    emoji: '🇫🇰',
  },
  {
    name: 'Faroe Islands',
    dial_code: '+298',
    code: 'FO',
    emoji: '🇫🇴',
  },
  {
    name: 'Fiji',
    dial_code: '+679',
    code: 'FJ',
    emoji: '🇫🇯',
  },
  {
    name: 'Finland',
    dial_code: '+358',
    code: 'FI',
    emoji: '🇫🇮',
  },
  {
    name: 'France',
    dial_code: '+33',
    code: 'FR',
    emoji: '🇫🇷',
  },
  {
    name: 'French Guiana',
    dial_code: '+594',
    code: 'GF',
    emoji: '🇬🇫',
  },
  {
    name: 'French Polynesia',
    dial_code: '+689',
    code: 'PF',
    emoji: '🇵🇫',
  },
  {
    name: 'Gabon',
    dial_code: '+241',
    code: 'GA',
    emoji: '🇬🇦',
  },
  {
    name: 'Gambia',
    dial_code: '+220',
    code: 'GM',
    emoji: '🇬🇲',
  },
  {
    name: 'Georgia',
    dial_code: '+995',
    code: 'GE',
    emoji: '🇬🇪',
  },
  {
    name: 'Germany',
    dial_code: '+49',
    code: 'DE',
    emoji: '🇩🇪',
  },
  {
    name: 'Ghana',
    dial_code: '+233',
    code: 'GH',
    emoji: '🇬🇭',
  },
  {
    name: 'Gibraltar',
    dial_code: '+350',
    code: 'GI',
    emoji: '🇬🇮',
  },
  {
    name: 'Greece',
    dial_code: '+30',
    code: 'GR',
    emoji: '🇬🇷',
  },
  {
    name: 'Greenland',
    dial_code: '+299',
    code: 'GL',
    emoji: '🇬🇱',
  },
  {
    name: 'Grenada',
    dial_code: '+1473',
    code: 'GD',
    emoji: '🇬🇩',
  },
  {
    name: 'Guadeloupe',
    dial_code: '+590',
    code: 'GP',
    emoji: '🇬🇵',
  },
  {
    name: 'Guam',
    dial_code: '+1671',
    code: 'GU',
    emoji: '🇬🇺',
  },
  {
    name: 'Guatemala',
    dial_code: '+502',
    code: 'GT',
    emoji: '🇬🇹',
  },
  {
    name: 'Guernsey',
    dial_code: '+44',
    code: 'GG',
    emoji: '🇬🇬',
  },
  {
    name: 'Guinea',
    dial_code: '+224',
    code: 'GN',
    emoji: '🇬🇳',
  },
  {
    name: 'Guinea-Bissau',
    dial_code: '+245',
    code: 'GW',
    emoji: '🇬🇼',
  },
  {
    name: 'Guyana',
    dial_code: '+595',
    code: 'GY',
    emoji: '🇬🇾',
  },
  {
    name: 'Haiti',
    dial_code: '+509',
    code: 'HT',
    emoji: '🇭🇹',
  },
  {
    name: 'Holy See (Vatican City State)',
    dial_code: '+379',
    code: 'VA',
    emoji: '🇻🇦',
  },
  {
    name: 'Honduras',
    dial_code: '+504',
    code: 'HN',
    emoji: '🇭🇳',
  },
  {
    name: 'Hong Kong',
    dial_code: '+852',
    code: 'HK',
    emoji: '🇭🇰',
  },
  {
    name: 'Hungary',
    dial_code: '+36',
    code: 'HU',
    emoji: '🇭🇺',
  },
  {
    name: 'Iceland',
    dial_code: '+354',
    code: 'IS',
    emoji: '🇮🇸',
  },
  {
    name: 'India',
    dial_code: '+91',
    code: 'IN',
    emoji: '🇮🇳',
  },
  {
    name: 'Indonesia',
    dial_code: '+62',
    code: 'ID',
    emoji: '🇮🇩',
  },
  {
    name: 'Iran, Islamic Republic of Persian Gulf',
    dial_code: '+98',
    code: 'IR',
    emoji: '🇮🇷',
  },
  {
    name: 'Iraq',
    dial_code: '+964',
    code: 'IQ',
    emoji: '🇮🇶',
  },
  {
    name: 'Ireland',
    dial_code: '+353',
    code: 'IE',
    emoji: '🇮🇪',
  },
  {
    name: 'Isle of Man',
    dial_code: '+44',
    code: 'IM',
    emoji: '🇮🇲',
  },
  {
    name: 'Israel',
    dial_code: '+972',
    code: 'IL',
    emoji: '🇮🇱',
  },
  {
    name: 'Italy',
    dial_code: '+39',
    code: 'IT',
    emoji: '🇮🇹',
  },
  {
    name: 'Jamaica',
    dial_code: '+1876',
    code: 'JM',
    emoji: '🇯🇲',
  },
  {
    name: 'Japan',
    dial_code: '+81',
    code: 'JP',
    emoji: '🇯🇵',
  },
  {
    name: 'Jersey',
    dial_code: '+44',
    code: 'JE',
    emoji: '🇯🇪',
  },
  {
    name: 'Jordan',
    dial_code: '+962',
    code: 'JO',
    emoji: '🇯🇴',
  },
  {
    name: 'Kazakhstan',
    dial_code: '+77',
    code: 'KZ',
    emoji: '🇰🇿',
  },
  {
    name: 'Kenya',
    dial_code: '+254',
    code: 'KE',
    emoji: '🇰🇪',
  },
  {
    name: 'Kiribati',
    dial_code: '+686',
    code: 'KI',
    emoji: '🇰🇮',
  },
  {
    name: "Korea, Democratic People's Republic of Korea",
    dial_code: '+850',
    code: 'KP',
    emoji: '🇰🇵',
  },
  {
    name: 'Korea, Republic of South Korea',
    dial_code: '+82',
    code: 'KR',
    emoji: '🇰🇷',
  },
  {
    name: 'Kuwait',
    dial_code: '+965',
    code: 'KW',
    emoji: '🇰🇼',
  },
  {
    name: 'Kyrgyzstan',
    dial_code: '+996',
    code: 'KG',
    emoji: '🇰🇬',
  },
  {
    name: 'Laos',
    dial_code: '+856',
    code: 'LA',
    emoji: '🇱🇦',
  },
  {
    name: 'Latvia',
    dial_code: '+371',
    code: 'LV',
    emoji: '🇱🇻',
  },
  {
    name: 'Lebanon',
    dial_code: '+961',
    code: 'LB',
    emoji: '🇱🇧',
  },
  {
    name: 'Lesotho',
    dial_code: '+266',
    code: 'LS',
    emoji: '🇱🇸',
  },
  {
    name: 'Liberia',
    dial_code: '+231',
    code: 'LR',
    emoji: '🇱🇷',
  },
  {
    name: 'Libyan Arab Jamahiriya',
    dial_code: '+218',
    code: 'LY',
    emoji: '🇱🇾',
  },
  {
    name: 'Liechtenstein',
    dial_code: '+423',
    code: 'LI',
    emoji: '🇱🇮',
  },
  {
    name: 'Lithuania',
    dial_code: '+370',
    code: 'LT',
    emoji: '🇱🇹',
  },
  {
    name: 'Luxembourg',
    dial_code: '+352',
    code: 'LU',
    emoji: '🇱🇺',
  },
  {
    name: 'Macao',
    dial_code: '+853',
    code: 'MO',
    emoji: '🇲🇴',
  },
  {
    name: 'Macedonia',
    dial_code: '+389',
    code: 'MK',
    emoji: '🇲🇰',
  },
  {
    name: 'Madagascar',
    dial_code: '+261',
    code: 'MG',
    emoji: '🇲🇬',
  },
  {
    name: 'Malawi',
    dial_code: '+265',
    code: 'MW',
    emoji: '🇲🇼',
  },
  {
    name: 'Malaysia',
    dial_code: '+60',
    code: 'MY',
    emoji: '🇲🇾',
  },
  {
    name: 'Maldives',
    dial_code: '+960',
    code: 'MV',
    emoji: '🇲🇻',
  },
  {
    name: 'Mali',
    dial_code: '+223',
    code: 'ML',
    emoji: '🇲🇱',
  },
  {
    name: 'Malta',
    dial_code: '+356',
    code: 'MT',
    emoji: '🇲🇹',
  },
  {
    name: 'Marshall Islands',
    dial_code: '+692',
    code: 'MH',
    emoji: '🇲🇭',
  },
  {
    name: 'Martinique',
    dial_code: '+596',
    code: 'MQ',
    emoji: '🇲🇶',
  },
  {
    name: 'Mauritania',
    dial_code: '+222',
    code: 'MR',
    emoji: '🇲🇷',
  },
  {
    name: 'Mauritius',
    dial_code: '+230',
    code: '🇲🇺',
  },
  {
    name: 'Mayotte',
    dial_code: '+262',
    code: 'YT',
    emoji: '🇾🇹',
  },
  {
    name: 'Mexico',
    dial_code: '+52',
    code: 'MX',
    emoji: '🇲🇽',
  },
  {
    name: 'Micronesia, Federated States of Micronesia',
    dial_code: '+691',
    code: 'FM',
    emoji: '🇫🇲',
  },
  {
    name: 'Moldova',
    dial_code: '+373',
    code: 'MD',
    emoji: '🇲🇩',
  },
  {
    name: 'Monaco',
    dial_code: '+377',
    code: 'MC',
    emoji: '🇲🇨',
  },
  {
    name: 'Mongolia',
    dial_code: '+976',
    code: 'MN',
    emoji: '🇲🇳',
  },
  {
    name: 'Montenegro',
    dial_code: '+382',
    code: 'ME',
    emoji: '🇲🇪',
  },
  {
    name: 'Montserrat',
    dial_code: '+1664',
    code: 'MS',
    emoji: '🇲🇸',
  },
  {
    name: 'Morocco',
    dial_code: '+212',
    code: 'MA',
    emoji: '🇲🇦',
  },
  {
    name: 'Mozambique',
    dial_code: '+258',
    code: 'MZ',
    emoji: '🇲🇿',
  },
  {
    name: 'Myanmar',
    dial_code: '+95',
    code: 'MM',
    emoji: '🇲🇲',
  },
  {
    name: 'Namibia',
    dial_code: '+264',
    code: 'NA',
    emoji: '🇳🇦',
  },
  {
    name: 'Nauru',
    dial_code: '+674',
    code: 'NR',
    emoji: '🇳🇷',
  },
  {
    name: 'Nepal',
    dial_code: '+977',
    code: 'NP',
    emoji: '🇳🇵',
  },
  {
    name: 'Netherlands',
    dial_code: '+31',
    code: 'NL',
    emoji: '🇳🇱',
  },
  {
    name: 'Netherlands Antilles',
    dial_code: '+599',
    code: 'AN',
    emoji: '🇳🇱',
  },
  {
    name: 'New Caledonia',
    dial_code: '+687',
    code: 'NC',
    emoji: '🇳🇨',
  },
  {
    name: 'New Zealand',
    dial_code: '+64',
    code: 'NZ',
    emoji: '🇳🇿',
  },
  {
    name: 'Nicaragua',
    dial_code: '+505',
    code: 'NI',
    emoji: '🇳🇮',
  },
  {
    name: 'Niger',
    dial_code: '+227',
    code: 'NE',
    emoji: '🇳🇪',
  },
  {
    name: 'Nigeria',
    dial_code: '+234',
    code: 'NG',
    emoji: '🇳🇬',
  },
  {
    name: 'Niue',
    dial_code: '+683',
    code: 'NU',
    emoji: '🇳🇺',
  },
  {
    name: 'Norfolk Island',
    dial_code: '+672',
    code: 'NF',
    emoji: '🇳🇫',
  },
  {
    name: 'Northern Mariana Islands',
    dial_code: '+1670',
    code: 'MP',
    emoji: '🏳',
  },
  {
    name: 'Norway',
    dial_code: '+47',
    code: 'NO',
    emoji: '🇳🇴',
  },
  {
    name: 'Oman',
    dial_code: '+968',
    code: 'OM',
    emoji: '🇴🇲',
  },
  {
    name: 'Pakistan',
    dial_code: '+92',
    code: 'PK',
    emoji: '🇵🇰',
  },
  {
    name: 'Palau',
    dial_code: '+680',
    code: 'PW',
    emoji: '🇵🇼',
  },
  {
    name: 'Palestinian Territory, Occupied',
    dial_code: '+970',
    code: 'PS',
    emoji: '🇵🇸',
  },
  {
    name: 'Panama',
    dial_code: '+507',
    code: 'PA',
    emoji: '🇵🇦',
  },
  {
    name: 'Papua New Guinea',
    dial_code: '+675',
    code: 'PG',
    emoji: '🇵🇬',
  },
  {
    name: 'Paraguay',
    dial_code: '+595',
    code: 'PY',
    emoji: '🇵🇾',
  },
  {
    name: 'Peru',
    dial_code: '+51',
    code: 'PE',
    emoji: '🇵🇪',
  },
  {
    name: 'Philippines',
    dial_code: '+63',
    code: 'PH',
    emoji: '🇵🇭',
  },
  {
    name: 'Pitcairn',
    dial_code: '+872',
    code: 'PN',
    emoji: '🇵🇳',
  },
  {
    name: 'Poland',
    dial_code: '+48',
    code: 'PL',
    emoji: '🇵🇱',
  },
  {
    name: 'Portugal',
    dial_code: '+351',
    code: 'PT',
    emoji: '🇵🇹',
  },
  {
    name: 'Puerto Rico',
    dial_code: '+1939',
    code: 'PR',
    emoji: '🇵🇷',
  },
  {
    name: 'Qatar',
    dial_code: '+974',
    code: 'QA',
    emoji: '🇶🇦',
  },
  {
    name: 'Romania',
    dial_code: '+40',
    code: 'RO',
    emoji: '🇷🇴',
  },
  {
    name: 'Russia',
    dial_code: '+7',
    code: 'RU',
    emoji: '🇷🇺',
  },
  {
    name: 'Rwanda',
    dial_code: '+250',
    code: 'RW',
    emoji: '🇷🇼',
  },
  {
    name: 'Reunion',
    dial_code: '+262',
    code: 'RE',
    emoji: '🇷🇪',
  },
  {
    name: 'Saint Barthelemy',
    dial_code: '+590',
    code: 'BL',
    emoji: '🇧🇱',
  },
  {
    name: 'Saint Helena, Ascension and Tristan Da Cunha',
    dial_code: '+290',
    code: 'SH',
    emoji: '🇸🇭',
  },
  {
    name: 'Saint Kitts and Nevis',
    dial_code: '+1869',
    code: 'KN',
    emoji: '🇰🇳',
  },
  {
    name: 'Saint Lucia',
    dial_code: '+1758',
    code: 'LC',
    emoji: '🇱🇨',
  },
  {
    name: 'Saint Martin',
    dial_code: '+590',
    code: 'MF',
    emoji: '🇲🇫',
  },
  {
    name: 'Saint Pierre and Miquelon',
    dial_code: '+508',
    code: 'PM',
    emoji: '🇵🇲',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    dial_code: '+1784',
    code: 'VC',
    emoji: '🇻🇨',
  },
  {
    name: 'Samoa',
    dial_code: '+685',
    code: 'WS',
    emoji: '🇼🇸',
  },
  {
    name: 'San Marino',
    dial_code: '+378',
    code: 'SM',
    emoji: '🇸🇲',
  },
  {
    name: 'Sao Tome and Principe',
    dial_code: '+239',
    code: 'ST',
    emoji: '🇸🇹',
  },
  {
    name: 'Saudi Arabia',
    dial_code: '+966',
    code: 'SA',
    emoji: '🇸🇩',
  },
  {
    name: 'Senegal',
    dial_code: '+221',
    code: 'SN',
    emoji: '🇸🇳',
  },
  {
    name: 'Serbia',
    dial_code: '+381',
    code: 'RS',
    emoji: '🇷🇸',
  },
  {
    name: 'Seychelles',
    dial_code: '+248',
    code: 'SC',
    emoji: '🇸🇨',
  },
  {
    name: 'Sierra Leone',
    dial_code: '+232',
    code: 'SL',
    emoji: '🇸🇱',
  },
  {
    name: 'Singapore',
    dial_code: '+65',
    code: 'SG',
    emoji: '🇸🇬',
  },
  {
    name: 'Slovakia',
    dial_code: '+421',
    code: 'SK',
    emoji: '🇸🇰',
  },
  {
    name: 'Slovenia',
    dial_code: '+386',
    code: 'SI',
    emoji: '🇸🇮',
  },
  {
    name: 'Solomon Islands',
    dial_code: '+677',
    code: 'SB',
    emoji: '🇸🇧',
  },
  {
    name: 'Somalia',
    dial_code: '+252',
    code: 'SO',
    emoji: '🇸🇴',
  },
  {
    name: 'South Africa',
    dial_code: '+27',
    code: 'ZA',
    emoji: '🇿🇦',
  },
  {
    name: 'South Sudan',
    dial_code: '+211',
    code: 'SS',
    emoji: '🇸🇸',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    dial_code: '+500',
    code: 'GS',
    emoji: '🇬🇸',
  },
  {
    name: 'Spain',
    dial_code: '+34',
    code: 'ES',
    emoji: '🇪🇸',
  },
  {
    name: 'Sri Lanka',
    dial_code: '+94',
    code: 'LK',
    emoji: '🇱🇰',
  },
  {
    name: 'Sudan',
    dial_code: '+249',
    code: 'SD',
    emoji: '🇸🇩',
  },
  {
    name: 'Suriname',
    dial_code: '+597',
    code: 'SR',
    emoji: '🇸🇷',
  },
  {
    name: 'Svalbard and Jan Mayen',
    dial_code: '+47',
    code: 'SJ',
    emoji: '🇸🇯',
  },
  {
    name: 'Swaziland',
    dial_code: '+268',
    code: 'SZ',
    emoji: '🇸🇿',
  },
  {
    name: 'Sweden',
    dial_code: '+46',
    code: 'SE',
    emoji: '🇸🇪',
  },
  {
    name: 'Switzerland',
    dial_code: '+41',
    code: 'CH',
    emoji: '🇨🇭',
  },
  {
    name: 'Syrian Arab Republic',
    dial_code: '+963',
    code: 'SY',
    emoji: '🇸🇾',
  },
  {
    name: 'Taiwan',
    dial_code: '+886',
    code: 'TW',
    emoji: '🇹🇼',
  },
  {
    name: 'Tajikistan',
    dial_code: '+992',
    code: 'TJ',
    emoji: '🇹🇯',
  },
  {
    name: 'Tanzania, United Republic of Tanzania',
    dial_code: '+255',
    code: 'TZ',
    emoji: '🇹🇿',
  },
  {
    name: 'Thailand',
    dial_code: '+66',
    code: 'TH',
    emoji: '🇹🇭',
  },
  {
    name: 'Timor-Leste',
    dial_code: '+670',
    code: 'TL',
    emoji: '🇹🇱',
  },
  {
    name: 'Togo',
    dial_code: '+228',
    code: 'TG',
    emoji: '🇹🇬',
  },
  {
    name: 'Tokelau',
    dial_code: '+690',
    code: 'TK',
    emoji: '🇹🇰',
  },
  {
    name: 'Tonga',
    dial_code: '+676',
    code: 'TO',
    emoji: '🇹🇴',
  },
  {
    name: 'Trinidad and Tobago',
    dial_code: '+1868',
    code: 'TT',
    emoji: '🇹🇹',
  },
  {
    name: 'Tunisia',
    dial_code: '+216',
    code: 'TN',
    emoji: '🇹🇳',
  },
  {
    name: 'Turkey',
    dial_code: '+90',
    code: 'TR',
    emoji: '🇹🇷',
  },
  {
    name: 'Turkmenistan',
    dial_code: '+993',
    code: 'TM',
    emoji: '🇹🇲',
  },
  {
    name: 'Turks and Caicos Islands',
    dial_code: '+1649',
    code: 'TC',
    emoji: '🇹🇨',
  },
  {
    name: 'Tuvalu',
    dial_code: '+688',
    code: 'TV',
    emoji: '🇹🇻',
  },
  {
    name: 'Uganda',
    dial_code: '+256',
    code: 'UG',
    emoji: '🇺🇬',
  },
  {
    name: 'Ukraine',
    dial_code: '+380',
    code: 'UA',
    emoji: '🇺🇦',
  },
  {
    name: 'United Arab Emirates',
    dial_code: '+971',
    code: 'AE',
    emoji: '🇦🇪',
  },
  {
    name: 'United Kingdom',
    dial_code: '+44',
    code: 'GB',
    emoji: '🇬🇧',
  },
  {
    name: 'United States',
    dial_code: '+1',
    code: 'US',
    emoji: '🇺🇸',
  },
  {
    name: 'Uruguay',
    dial_code: '+598',
    code: 'UY',
    emoji: '🇺🇾',
  },
  {
    name: 'Uzbekistan',
    dial_code: '+998',
    code: 'UZ',
    emoji: '🇺🇿',
  },
  {
    name: 'Vanuatu',
    dial_code: '+678',
    code: 'VU',
    emoji: '🇻🇺',
  },
  {
    name: 'Venezuela, Bolivarian Republic of Venezuela',
    dial_code: '+58',
    code: 'VE',
    emoji: '🇻🇪',
  },
  {
    name: 'Vietnam',
    dial_code: '+84',
    code: 'VN',
    emoji: '🇻🇳',
  },
  {
    name: 'Virgin Islands, British',
    dial_code: '+1284',
    code: 'VG',
    emoji: '🇻🇬',
  },
  {
    name: 'Virgin Islands, U.S.',
    dial_code: '+1340',
    code: 'VI',
    emoji: '🇻🇮',
  },
  {
    name: 'Wallis and Futuna',
    dial_code: '+681',
    code: 'WF',
    emoji: '🇼🇫',
  },
  {
    name: 'Yemen',
    dial_code: '+967',
    code: 'YE',
    emoji: '🇾🇪',
  },
  {
    name: 'Zambia',
    dial_code: '+260',
    code: 'ZM',
    emoji: '🇿🇲',
  },
  {
    name: 'Zimbabwe',
    dial_code: '+263',
    code: 'ZW',
    emoji: '🇿🇼',
  },
];
