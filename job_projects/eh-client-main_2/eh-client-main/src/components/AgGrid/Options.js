import {Investors, Trusts} from "../../services";
import {getParsedListForTrust} from "../../utils/parsedList";
import {useState} from "react";


export const TAX = [
  "County Tax Bill #1",
  "County Tax Bill #2",
  "County Tax Bill #3",
  "County Tax Bill #4",
  "City Tax Bill #1",
  "City Tax Bill #2",
  "City Tax Bill #3",
  "City Tax Bill #4",
  "School Tax Bill #1",
  "School Tax Bill #2",
  "School Tax Bill #3",
  "School Tax Bill #4",
  "Family Payout",
  "E&H Payment",
  "Family Payment",
  "Investor Payment",
  "Other"
];

export const INSURANCE = [
  "Daily Insurance",
  "E&H Payment",
  "Family Payment",
  "Investor Payment",
  "Other"
];

export const BILL = [
  "Code Violation",
  "Utility Payment",
  "Water Bill",
  "Trash",
  "Vendor Back Bill",
  "Grass Cut",
  "Re-Key",
  "Set-Up",
  "EMD",
  "Closing Amount",
  "Property Inspection",
  "Family Payout",
  "E&H Payment",
  "Family Payment",
  "Investor Payment",
  "Other"
];
export const ADDFUNDS = [
  "Family Payment",
  "Investor Payment",
  "Other"
];

export const STAGE = [
  "Family Payment",
  "Investor Payment",
  "Other"
];

export const INVESTOR = [
  "Sero Sed Serio LLC",
  "Patrick Forney",
  "Kjan Corp",
    "Not Assigned",
];


export const StateList=[
  {
       state_name: "Alabama",
      id: "AL"
  },
  {
       state_name: "Alaska",
      id: "AK"
  },
  {
       state_name: "American Samoa",
      id: "AS"
  },
  {
       state_name: "Arizona",
      id: "AZ"
  },
  {
       state_name: "Arkansas",
      id: "AR"
  },
  {
       state_name: "California",
      id: "CA"
  },
  {
       state_name: "Colorado",
      id: "CO"
  },
  {
       state_name: "Connecticut",
      id: "CT"
  },
  {
       state_name: "Delaware",
      id: "DE"
  },
  {
       state_name: "District Of Columbia",
      id: "DC"
  },
  {
       state_name: "Federated States Of Micronesia",
      id: "FM"
  },
  {
       state_name: "Florida",
      id: "FL"
  },
  {
       state_name: "Georgia",
      id: "GA"
  },
  {
       state_name: "Guam",
      id: "GU"
  },
  {
       state_name: "Hawaii",
      id: "HI"
  },
  {
       state_name: "Idaho",
      id: "ID"
  },
  {
       state_name: "Illinois",
      id: "IL"
  },
  {
       state_name: "Indiana",
      id: "IN"
  },
  {
       state_name: "Iowa",
      id: "IA"
  },
  {
       state_name: "Kansas",
      id: "KS"
  },
  {
       state_name: "Kentucky",
      id: "KY"
  },
  {
       state_name: "Louisiana",
      id: "LA"
  },
  {
       state_name: "Maine",
      id: "ME"
  },
  {
       state_name: "Marshall Islands",
      id: "MH"
  },
  {
       state_name: "Maryland",
      id: "MD"
  },
  {
       state_name: "Massachusetts",
      id: "MA"
  },
  {
       state_name: "Michigan",
      id: "MI"
  },
  {
       state_name: "Minnesota",
      id: "MN"
  },
  {
       state_name: "Mississippi",
      id: "MS"
  },
  {
       state_name: "Missouri",
      id: "MO"
  },
  {
       state_name: "Montana",
      id: "MT"
  },
  {
       state_name: "Nebraska",
      id: "NE"
  },
  {
       state_name: "Nevada",
      id: "NV"
  },
  {
       state_name: "New Hampshire",
      id: "NH"
  },
  {
       state_name: "New Jersey",
      id: "NJ"
  },
  {
       state_name: "New Mexico",
      id: "NM"
  },
  {
       state_name: "New York",
      id: "NY"
  },
  {
       state_name: "North Carolina",
      id: "NC"
  },
  {
       state_name: "North Dakota",
      id: "ND"
  },
  {
       state_name: "Northern Mariana Islands",
      id: "MP"
  },
  {
       state_name: "Ohio",
      id: "OH"
  },
  {
       state_name: "Oklahoma",
      id: "OK"
  },
  {
       state_name: "Oregon",
      id: "OR"
  },
  {
       state_name: "Palau",
      id: "PW"
  },
  {
       state_name: "Pennsylvania",
      id: "PA"
  },
  {
       state_name: "Puerto Rico",
      id: "PR"
  },
  {
       state_name: "Rhode Island",
      id: "RI"
  },
  {
       state_name: "South Carolina",
      id: "SC"
  },
  {
       state_name: "South Dakota",
      id: "SD"
  },
  {
       state_name: "Tennessee",
      id: "TN"
  },
  {
       state_name: "Texas",
      id: "TX"
  },
  {
       state_name: "Utah",
      id: "UT"
  },
  {
       state_name: "Vermont",
      id: "VT"
  },
  {
       state_name: "Virgin Islands",
      id: "VI"
  },
  {
       state_name: "Virginia",
      id: "VA"
  },
  {
       state_name: "Washington",
      id: "WA"
  },
  {
       state_name: "West Virginia",
      id: "WV"
  },
  {
       state_name: "Wisconsin",
      id: "WI"
  },
  {
       state_name: "Wyoming",
      id: "WY"
  }
]

export const CountryList=[
  {"code": "AL", "code3": "ALB", id: "Albania", "number": "008"},
	{"code": "DZ", "code3": "DZA", id: "Algeria", "number": "012"},
	{"code": "AS", "code3": "ASM", id: "American Samoa", "number": "016"},
	{"code": "AD", "code3": "AND", id: "Andorra", "number": "020"},
	{"code": "AO", "code3": "AGO", id: "Angola", "number": "024"},
	{"code": "AI", "code3": "AIA", id: "Anguilla", "number": "660"},
	{"code": "AQ", "code3": "ATA", id: "Antarctica", "number": "010"},
	{"code": "AG", "code3": "ATG", id: "Antigua and Barbuda", "number": "028"},
	{"code": "AR", "code3": "ARG", id: "Argentina", "number": "032"},
	{"code": "AM", "code3": "ARM", id: "Armenia", "number": "051"},
	{"code": "AW", "code3": "ABW", id: "Aruba", "number": "533"},
	{"code": "AU", "code3": "AUS", id: "Australia", "number": "036"},
	{"code": "AT", "code3": "AUT", id: "Austria", "number": "040"},
	{"code": "AZ", "code3": "AZE", id: "Azerbaijan", "number": "031"},
	{"code": "BS", "code3": "BHS", id: "Bahamas (the)", "number": "044"},
	{"code": "BH", "code3": "BHR", id: "Bahrain", "number": "048"},
	{"code": "BD", "code3": "BGD", id: "Bangladesh", "number": "050"},
	{"code": "BB", "code3": "BRB", id: "Barbados", "number": "052"},
	{"code": "BY", "code3": "BLR", id: "Belarus", "number": "112"},
	{"code": "BE", "code3": "BEL", id: "Belgium", "number": "056"},
	{"code": "BZ", "code3": "BLZ", id: "Belize", "number": "084"},
	{"code": "BJ", "code3": "BEN", id: "Benin", "number": "204"},
	{"code": "BM", "code3": "BMU", id: "Bermuda", "number": "060"},
	{"code": "BT", "code3": "BTN", id: "Bhutan", "number": "064"},
	{"code": "BO", "code3": "BOL", id: "Bolivia (Plurinational State of)", "number": "068"},
	{"code": "BQ", "code3": "BES", id: "Bonaire, Sint Eustatius and Saba", "number": "535"},
	{"code": "BA", "code3": "BIH", id: "Bosnia and Herzegovina", "number": "070"},
	{"code": "BW", "code3": "BWA", id: "Botswana", "number": "072"},
	{"code": "BV", "code3": "BVT", id: "Bouvet Island", "number": "074"},
	{"code": "BR", "code3": "BRA", id: "Brazil", "number": "076"},
	{"code": "IO", "code3": "IOT", id: "British Indian Ocean Territory (the)", "number": "086"},
	{"code": "BN", "code3": "BRN", id: "Brunei Darussalam", "number": "096"},
	{"code": "BG", "code3": "BGR", id: "Bulgaria", "number": "100"},
	{"code": "BF", "code3": "BFA", id: "Burkina Faso", "number": "854"},
	{"code": "BI", "code3": "BDI", id: "Burundi", "number": "108"},
	{"code": "CV", "code3": "CPV", id: "Cabo Verde", "number": "132"},
	{"code": "KH", "code3": "KHM", id: "Cambodia", "number": "116"},
	{"code": "CM", "code3": "CMR", id: "Cameroon", "number": "120"},
	{"code": "CA", "code3": "CAN", id: "Canada", "number": "124"},
	{"code": "KY", "code3": "CYM", id: "Cayman Islands (the)", "number": "136"},
	{"code": "CF", "code3": "CAF", id: "Central African Republic (the)", "number": "140"},
	{"code": "TD", "code3": "TCD", id: "Chad", "number": "148"},
	{"code": "CL", "code3": "CHL", id: "Chile", "number": "152"},
	{"code": "CN", "code3": "CHN", id: "China", "number": "156"},
	{"code": "CX", "code3": "CXR", id: "Christmas Island", "number": "162"},
	{"code": "CC", "code3": "CCK", id: "Cocos (Keeling) Islands (the)", "number": "166"},
	{"code": "CO", "code3": "COL", id: "Colombia", "number": "170"},
	{"code": "KM", "code3": "COM", id: "Comoros (the)", "number": "174"},
	{"code": "CD", "code3": "COD", id: "Congo (the Democratic Republic of the)", "number": "180"},
	{"code": "CG", "code3": "COG", id: "Congo (the)", "number": "178"},
	{"code": "CK", "code3": "COK", id: "Cook Islands (the)", "number": "184"},
	{"code": "CR", "code3": "CRI", id: "Costa Rica", "number": "188"},
	{"code": "HR", "code3": "HRV", id: "Croatia", "number": "191"},
	{"code": "CU", "code3": "CUB", id: "Cuba", "number": "192"},
	{"code": "CW", "code3": "CUW", id: "Curaçao", "number": "531"},
	{"code": "AF", "code3": "AFG", id: "Afghanistan", "number": "004"},
	{"code": "CY", "code3": "CYP", id: "Cyprus", "number": "196"},
	{"code": "CZ", "code3": "CZE", id: "Czechia", "number": "203"},
	{"code": "CI", "code3": "CIV", id: "Côte d'Ivoire", "number": "384"},
	{"code": "DK", "code3": "DNK", id: "Denmark", "number": "208"},
	{"code": "DJ", "code3": "DJI", id: "Djibouti", "number": "262"},
	{"code": "DM", "code3": "DMA", id: "Dominica", "number": "212"},
	{"code": "DO", "code3": "DOM", id: "Dominican Republic (the)", "number": "214"},
	{"code": "EC", "code3": "ECU", id: "Ecuador", "number": "218"},
	{"code": "EG", "code3": "EGY", id: "Egypt", "number": "818"},
	{"code": "SV", "code3": "SLV", id: "El Salvador", "number": "222"},
	{"code": "GQ", "code3": "GNQ", id: "Equatorial Guinea", "number": "226"},
	{"code": "ER", "code3": "ERI", id: "Eritrea", "number": "232"},
	{"code": "EE", "code3": "EST", id: "Estonia", "number": "233"},
	{"code": "SZ", "code3": "SWZ", id: "Eswatini", "number": "748"},
	{"code": "ET", "code3": "ETH", id: "Ethiopia", "number": "231"},
	{"code": "FK", "code3": "FLK", id: "Falkland Islands (the) [Malvinas]", "number": "238"},
	{"code": "FO", "code3": "FRO", id: "Faroe Islands (the)", "number": "234"},
	{"code": "FJ", "code3": "FJI", id: "Fiji", "number": "242"},
	{"code": "FI", "code3": "FIN", id: "Finland", "number": "246"},
	{"code": "FR", "code3": "FRA", id: "France", "number": "250"},
	{"code": "GF", "code3": "GUF", id: "French Guiana", "number": "254"},
	{"code": "PF", "code3": "PYF", id: "French Polynesia", "number": "258"},
	{"code": "TF", "code3": "ATF", id: "French Southern Territories (the)", "number": "260"},
	{"code": "GA", "code3": "GAB", id: "Gabon", "number": "266"},
	{"code": "GM", "code3": "GMB", id: "Gambia (the)", "number": "270"},
	{"code": "GE", "code3": "GEO", id: "Georgia", "number": "268"},
	{"code": "DE", "code3": "DEU", id: "Germany", "number": "276"},
	{"code": "GH", "code3": "GHA", id: "Ghana", "number": "288"},
	{"code": "GI", "code3": "GIB", id: "Gibraltar", "number": "292"},
	{"code": "GR", "code3": "GRC", id: "Greece", "number": "300"},
	{"code": "GL", "code3": "GRL", id: "Greenland", "number": "304"},
	{"code": "GD", "code3": "GRD", id: "Grenada", "number": "308"},
	{"code": "GP", "code3": "GLP", id: "Guadeloupe", "number": "312"},
	{"code": "GU", "code3": "GUM", id: "Guam", "number": "316"},
	{"code": "GT", "code3": "GTM", id: "Guatemala", "number": "320"},
	{"code": "GG", "code3": "GGY", id: "Guernsey", "number": "831"},
	{"code": "GN", "code3": "GIN", id: "Guinea", "number": "324"},
	{"code": "GW", "code3": "GNB", id: "Guinea-Bissau", "number": "624"},
	{"code": "GY", "code3": "GUY", id: "Guyana", "number": "328"},
	{"code": "HT", "code3": "HTI", id: "Haiti", "number": "332"},
	{"code": "HM", "code3": "HMD", id: "Heard Island and McDonald Islands", "number": "334"},
	{"code": "VA", "code3": "VAT", id: "Holy See (the)", "number": "336"},
	{"code": "HN", "code3": "HND", id: "Honduras", "number": "340"},
	{"code": "HK", "code3": "HKG", id: "Hong Kong", "number": "344"},
	{"code": "HU", "code3": "HUN", id: "Hungary", "number": "348"},
	{"code": "IS", "code3": "ISL", id: "Iceland", "number": "352"},
	{"code": "IN", "code3": "IND", id: "India", "number": "356"},
	{"code": "ID", "code3": "IDN", id: "Indonesia", "number": "360"},
	{"code": "IR", "code3": "IRN", id: "Iran (Islamic Republic of)", "number": "364"},
	{"code": "IQ", "code3": "IRQ", id: "Iraq", "number": "368"},
	{"code": "IE", "code3": "IRL", id: "Ireland", "number": "372"},
	{"code": "IM", "code3": "IMN", id: "Isle of Man", "number": "833"},
	{"code": "IL", "code3": "ISR", id: "Israel", "number": "376"},
	{"code": "IT", "code3": "ITA", id: "Italy", "number": "380"},
	{"code": "JM", "code3": "JAM", id: "Jamaica", "number": "388"},
	{"code": "JP", "code3": "JPN", id: "Japan", "number": "392"},
	{"code": "JE", "code3": "JEY", id: "Jersey", "number": "832"},
	{"code": "JO", "code3": "JOR", id: "Jordan", "number": "400"},
	{"code": "KZ", "code3": "KAZ", id: "Kazakhstan", "number": "398"},
	{"code": "KE", "code3": "KEN", id: "Kenya", "number": "404"},
	{"code": "KI", "code3": "KIR", id: "Kiribati", "number": "296"},
	{"code": "KP", "code3": "PRK", id: "Korea (the Democratic People's Republic of)", "number": "408"},
	{"code": "KR", "code3": "KOR", id: "Korea (the Republic of)", "number": "410"},
	{"code": "KW", "code3": "KWT", id: "Kuwait", "number": "414"},
	{"code": "KG", "code3": "KGZ", id: "Kyrgyzstan", "number": "417"},
	{"code": "LA", "code3": "LAO", id: "Lao People's Democratic Republic (the)", "number": "418"},
	{"code": "LV", "code3": "LVA", id: "Latvia", "number": "428"},
	{"code": "LB", "code3": "LBN", id: "Lebanon", "number": "422"},
	{"code": "LS", "code3": "LSO", id: "Lesotho", "number": "426"},
	{"code": "LR", "code3": "LBR", id: "Liberia", "number": "430"},
	{"code": "LY", "code3": "LBY", id: "Libya", "number": "434"},
	{"code": "LI", "code3": "LIE", id: "Liechtenstein", "number": "438"},
	{"code": "LT", "code3": "LTU", id: "Lithuania", "number": "440"},
	{"code": "LU", "code3": "LUX", id: "Luxembourg", "number": "442"},
	{"code": "MO", "code3": "MAC", id: "Macao", "number": "446"},
	{"code": "MG", "code3": "MDG", id: "Madagascar", "number": "450"},
	{"code": "MW", "code3": "MWI", id: "Malawi", "number": "454"},
	{"code": "MY", "code3": "MYS", id: "Malaysia", "number": "458"},
	{"code": "MV", "code3": "MDV", id: "Maldives", "number": "462"},
	{"code": "ML", "code3": "MLI", id: "Mali", "number": "466"},
	{"code": "MT", "code3": "MLT", id: "Malta", "number": "470"},
	{"code": "MH", "code3": "MHL", id: "Marshall Islands (the)", "number": "584"},
	{"code": "MQ", "code3": "MTQ", id: "Martinique", "number": "474"},
	{"code": "MR", "code3": "MRT", id: "Mauritania", "number": "478"},
	{"code": "MU", "code3": "MUS", id: "Mauritius", "number": "480"},
	{"code": "YT", "code3": "MYT", id: "Mayotte", "number": "175"},
	{"code": "MX", "code3": "MEX", id: "Mexico", "number": "484"},
	{"code": "FM", "code3": "FSM", id: "Micronesia (Federated States of)", "number": "583"},
	{"code": "MD", "code3": "MDA", id: "Moldova (the Republic of)", "number": "498"},
	{"code": "MC", "code3": "MCO", id: "Monaco", "number": "492"},
	{"code": "MN", "code3": "MNG", id: "Mongolia", "number": "496"},
	{"code": "ME", "code3": "MNE", id: "Montenegro", "number": "499"},
	{"code": "MS", "code3": "MSR", id: "Montserrat", "number": "500"},
	{"code": "MA", "code3": "MAR", id: "Morocco", "number": "504"},
	{"code": "MZ", "code3": "MOZ", id: "Mozambique", "number": "508"},
	{"code": "MM", "code3": "MMR", id: "Myanmar", "number": "104"},
	{"code": "NA", "code3": "NAM", id: "Namibia", "number": "516"},
	{"code": "NR", "code3": "NRU", id: "Nauru", "number": "520"},
	{"code": "NP", "code3": "NPL", id: "Nepal", "number": "524"},
	{"code": "NL", "code3": "NLD", id: "Netherlands (the)", "number": "528"},
	{"code": "NC", "code3": "NCL", id: "New Caledonia", "number": "540"},
	{"code": "NZ", "code3": "NZL", id: "New Zealand", "number": "554"},
	{"code": "NI", "code3": "NIC", id: "Nicaragua", "number": "558"},
	{"code": "NE", "code3": "NER", id: "Niger (the)", "number": "562"},
	{"code": "NG", "code3": "NGA", id: "Nigeria", "number": "566"},
	{"code": "NU", "code3": "NIU", id: "Niue", "number": "570"},
	{"code": "NF", "code3": "NFK", id: "Norfolk Island", "number": "574"},
	{"code": "MP", "code3": "MNP", id: "Northern Mariana Islands (the)", "number": "580"},
	{"code": "NO", "code3": "NOR", id: "Norway", "number": "578"},
	{"code": "OM", "code3": "OMN", id: "Oman", "number": "512"},
	{"code": "PK", "code3": "PAK", id: "Pakistan", "number": "586"},
	{"code": "PW", "code3": "PLW", id: "Palau", "number": "585"},
	{"code": "PS", "code3": "PSE", id: "Palestine, State of", "number": "275"},
	{"code": "PA", "code3": "PAN", id: "Panama", "number": "591"},
	{"code": "PG", "code3": "PNG", id: "Papua New Guinea", "number": "598"},
	{"code": "PY", "code3": "PRY", id: "Paraguay", "number": "600"},
	{"code": "PE", "code3": "PER", id: "Peru", "number": "604"},
	{"code": "PH", "code3": "PHL", id: "Philippines (the)", "number": "608"},
	{"code": "PN", "code3": "PCN", id: "Pitcairn", "number": "612"},
	{"code": "PL", "code3": "POL", id: "Poland", "number": "616"},
	{"code": "PT", "code3": "PRT", id: "Portugal", "number": "620"},
	{"code": "PR", "code3": "PRI", id: "Puerto Rico", "number": "630"},
	{"code": "QA", "code3": "QAT", id: "Qatar", "number": "634"},
	{"code": "MK", "code3": "MKD", id: "Republic of North Macedonia", "number": "807"},
	{"code": "RO", "code3": "ROU", id: "Romania", "number": "642"},
	{"code": "RU", "code3": "RUS", id: "Russian Federation (the)", "number": "643"},
	{"code": "RW", "code3": "RWA", id: "Rwanda", "number": "646"},
	{"code": "RE", "code3": "REU", id: "Réunion", "number": "638"},
	{"code": "BL", "code3": "BLM", id: "Saint Barthélemy", "number": "652"},
	{"code": "SH", "code3": "SHN", id: "Saint Helena, Ascension and Tristan da Cunha", "number": "654"},
	{"code": "KN", "code3": "KNA", id: "Saint Kitts and Nevis", "number": "659"},
	{"code": "LC", "code3": "LCA", id: "Saint Lucia", "number": "662"},
	{"code": "MF", "code3": "MAF", id: "Saint Martin (French part)", "number": "663"},
	{"code": "PM", "code3": "SPM", id: "Saint Pierre and Miquelon", "number": "666"},
	{"code": "VC", "code3": "VCT", id: "Saint Vincent and the Grenadines", "number": "670"},
	{"code": "WS", "code3": "WSM", id: "Samoa", "number": "882"},
	{"code": "SM", "code3": "SMR", id: "San Marino", "number": "674"},
	{"code": "ST", "code3": "STP", id: "Sao Tome and Principe", "number": "678"},
	{"code": "SA", "code3": "SAU", id: "Saudi Arabia", "number": "682"},
	{"code": "SN", "code3": "SEN", id: "Senegal", "number": "686"},
	{"code": "RS", "code3": "SRB", id: "Serbia", "number": "688"},
	{"code": "SC", "code3": "SYC", id: "Seychelles", "number": "690"},
	{"code": "SL", "code3": "SLE", id: "Sierra Leone", "number": "694"},
	{"code": "SG", "code3": "SGP", id: "Singapore", "number": "702"},
	{"code": "SX", "code3": "SXM", id: "Sint Maarten (Dutch part)", "number": "534"},
	{"code": "SK", "code3": "SVK", id: "Slovakia", "number": "703"},
	{"code": "SI", "code3": "SVN", id: "Slovenia", "number": "705"},
	{"code": "SB", "code3": "SLB", id: "Solomon Islands", "number": "090"},
	{"code": "SO", "code3": "SOM", id: "Somalia", "number": "706"},
	{"code": "ZA", "code3": "ZAF", id: "South Africa", "number": "710"},
	{"code": "GS", "code3": "SGS", id: "South Georgia and the South Sandwich Islands", "number": "239"},
	{"code": "SS", "code3": "SSD", id: "South Sudan", "number": "728"},
	{"code": "ES", "code3": "ESP", id: "Spain", "number": "724"},
	{"code": "LK", "code3": "LKA", id: "Sri Lanka", "number": "144"},
	{"code": "SD", "code3": "SDN", id: "Sudan (the)", "number": "729"},
	{"code": "SR", "code3": "SUR", id: "Suriname", "number": "740"},
	{"code": "SJ", "code3": "SJM", id: "Svalbard and Jan Mayen", "number": "744"},
	{"code": "SE", "code3": "SWE", id: "Sweden", "number": "752"},
	{"code": "CH", "code3": "CHE", id: "Switzerland", "number": "756"},
	{"code": "SY", "code3": "SYR", id: "Syrian Arab Republic", "number": "760"},
	{"code": "TW", "code3": "TWN", id: "Taiwan", "number": "158"},
	{"code": "TJ", "code3": "TJK", id: "Tajikistan", "number": "762"},
	{"code": "TZ", "code3": "TZA", id: "Tanzania, United Republic of", "number": "834"},
	{"code": "TH", "code3": "THA", id: "Thailand", "number": "764"},
	{"code": "TL", "code3": "TLS", id: "Timor-Leste", "number": "626"},
	{"code": "TG", "code3": "TGO", id: "Togo", "number": "768"},
	{"code": "TK", "code3": "TKL", id: "Tokelau", "number": "772"},
	{"code": "TO", "code3": "TON", id: "Tonga", "number": "776"},
	{"code": "TT", "code3": "TTO", id: "Trinidad and Tobago", "number": "780"},
	{"code": "TN", "code3": "TUN", id: "Tunisia", "number": "788"},
	{"code": "TR", "code3": "TUR", id: "Turkey", "number": "792"},
	{"code": "TM", "code3": "TKM", id: "Turkmenistan", "number": "795"},
	{"code": "TC", "code3": "TCA", id: "Turks and Caicos Islands (the)", "number": "796"},
	{"code": "TV", "code3": "TUV", id: "Tuvalu", "number": "798"},
	{"code": "UG", "code3": "UGA", id: "Uganda", "number": "800"},
	{"code": "UA", "code3": "UKR", id: "Ukraine", "number": "804"},
	{"code": "AE", "code3": "ARE", id: "United Arab Emirates (the)", "number": "784"},
	{"code": "GB", "code3": "GBR", id: "United Kingdom of Great Britain and Northern Ireland (the)", "number": "826"},
	{"code": "UM", "code3": "UMI", id: "United States Minor Outlying Islands (the)", "number": "581"},
	{"code": "US", "code3": "USA", id: "United States of America", "number": "840"},
	{"code": "UY", "code3": "URY", id: "Uruguay", "number": "858"},
	{"code": "UZ", "code3": "UZB", id: "Uzbekistan", "number": "860"},
	{"code": "VU", "code3": "VUT", id: "Vanuatu", "number": "548"},
	{"code": "VE", "code3": "VEN", id: "Venezuela (Bolivarian Republic of)", "number": "862"},
	{"code": "VN", "code3": "VNM", id: "Viet Nam", "number": "704"},
	{"code": "VG", "code3": "VGB", id: "Virgin Islands (British)", "number": "092"},
	{"code": "VI", "code3": "VIR", id: "Virgin Islands (U.S.)", "number": "850"},
	{"code": "WF", "code3": "WLF", id: "Wallis and Futuna", "number": "876"},
	{"code": "EH", "code3": "ESH", id: "Western Sahara", "number": "732"},
	{"code": "YE", "code3": "YEM", id: "Yemen", "number": "887"},
	{"code": "ZM", "code3": "ZMB", id: "Zambia", "number": "894"},
	{"code": "ZW", "code3": "ZWE", id: "Zimbabwe", "number": "716"},
	{"code": "AX", "code3": "ALA", id: "Åland Islands", "number": "248"}
];