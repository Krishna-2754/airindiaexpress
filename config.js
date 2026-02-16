export const AIRLINES = {
  cebu_pacific: {
    id: 'cebu_pacific',
    name: "Cebu Pacific",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Cebu_Pacific_logo.svg/1200px-Cebu_Pacific_logo.svg.png",
    primary: "#FFF000", secondary: "#00AEEF", text: "#000",
    flights: [
      { id: '5J 567', from: 'MNL', to: 'CEB', time: '10:00 AM', price: 2500 },
      { id: '5J 888', from: 'MNL', to: 'DVO', time: '02:00 PM', price: 3800 }
    ]
  },
  vueling: {
    id: 'vueling',
    name: "Vueling",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Vueling_logo.svg/1200px-Vueling_logo.svg.png",
    primary: "#FFD200", secondary: "#333333", text: "#000",
    flights: [
      { id: 'VY 123', from: 'BCN', to: 'PAR', time: '09:00 AM', price: 12000 },
      { id: 'VY 999', from: 'BCN', to: 'ROM', time: '06:00 PM', price: 15500 }
    ]
  },
  lot: {
    id: 'lot',
    name: "LOT Polish",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/LOT_Polish_Airlines_logo.svg/1200px-LOT_Polish_Airlines_logo.svg.png",
    primary: "#003399", secondary: "#FFFFFF", text: "#FFF",
    flights: [
      { id: 'LO 101', from: 'WAW', to: 'LHR', time: '07:30 AM', price: 22000 },
      { id: 'LO 202', from: 'WAW', to: 'JFK', time: '11:45 AM', price: 85000 }
    ]
  }
};