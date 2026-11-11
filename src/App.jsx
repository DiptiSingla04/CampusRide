import { useState } from 'react';
import './App.css';

const INITIAL_RIDES = [
  {
    id: 1,
    type: 'Campus Auto Pool',
    fare: 50,
    locality: 'Model Town',
    vehicleNo: 'PB-11-XX-1234',
    badge: 'Campus Verified',
    pickupSpot: 'Campus Gate 2 (Plaza)',
    seatsLeft: 2,
    eta: '10 mins after event',
    rating: '4.9 ★'
  },
  {
    id: 2,
    type: 'Shared Cab Pool',
    fare: 70,
    locality: 'Urban Estate',
    vehicleNo: 'PB-11-XX-5678',
    badge: 'Campus Verified',
    pickupSpot: 'Main Library Parking',
    seatsLeft: 1,
    eta: '15 mins after event',
    rating: '5.0 ★'
  },
  {
    id: 3,
    type: 'Campus Shuttle Service',
    fare: 40,
    locality: 'Bus Stand',
    vehicleNo: 'PB-11-XX-9012',
    badge: 'Campus Verified',
    pickupSpot: 'Student Activity Center',
    seatsLeft: 4,
    eta: '5 mins after event',
    rating: '4.8 ★'
  }
];

function App() {
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [rideType, setRideType] = useState('Shared Ride Pool');
  
  // Rides & Navigation State
  const [ridesList, setRidesList] = useState(INITIAL_RIDES);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'bookings'
  
  // Bookings & Modals State
  const [userBookings, setUserBookings] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Offer Ride Form State
  const [newLocality, setNewLocality] = useState('');
  const [newFare, setNewFare] = useState('');
  const [newVehicle, setNewVehicle] = useState('');
  const [newPickup, setNewPickup] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const filtered = ridesList.filter(ride => 
      ride.locality.toLowerCase().includes(destination.toLowerCase())
    );
    setSearchResults(filtered.length > 0 ? filtered : ridesList);
  };

  const handleConfirmBooking = (ride) => {
    const bookingCode = `CR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      ...ride,
      passCode: bookingCode,
      destination: destination || ride.locality,
      bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setUserBookings([...userBookings, newBooking]);
    setActiveTicket(newBooking);
  };

  const handleOfferRide = (e) => {
    e.preventDefault();
    const createdRide = {
      id: Date.now(),
      type: 'Peer Student Ride',
      fare: Number(newFare) || 50,
      locality: newLocality || 'Campus Route',
      vehicleNo: newVehicle || 'Verified Peer',
      badge: 'Student Host',
      pickupSpot: newPickup || 'Campus Main Gate',
      seatsLeft: 3,
      eta: 'Immediate / Post-event',
      rating: '5.0 ★'
    };
    setRidesList([createdRide, ...ridesList]);
    setIsOfferModalOpen(false);
    alert('Your ride offer has been posted to the campus pool!');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2 className="logo">CampusRide.</h2>
        <div className="nav-links">
          <a href="#home" onClick={() => setActiveTab('search')}>Home</a>
          <a href="#journey" onClick={() => setActiveTab('search')}>Find Rides</a>
          <button className="tab-link-btn" onClick={() => setActiveTab('bookings')}>
            My Bookings ({userBookings.length})
          </button>
          <button className="tab-link-btn secondary" onClick={() => setIsOfferModalOpen(true)}>
            + Offer a Ride
          </button>
        </div>
        
        {isLoggedIn ? (
          <span className="user-badge">👤 {userEmail.split('@')[0]} (Verified)</span>
        ) : (
          <button className="login-btn" onClick={() => setIsLoginOpen(true)}>Student Login</button>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="tagline">OFFICIAL CAMPUS COMMUTE NETWORK</p>
          <h1>
            Safe, campus-authorized rides
            <br />
            after late-evening events.
          </h1>
          <p className="description">
            Never worry about travelling back alone after late society meetings, quizzes, or campus events. 
            Connect with campus-approved transport drivers and share verified rides at standardized student rates.
          </p>
          <div className="hero-buttons">
            <a href="#journey" className="primary-link" onClick={() => setActiveTab('search')}>Find Authorized Rides →</a>
            <button className="secondary-link-btn" onClick={() => setIsOfferModalOpen(true)}>Host a Pool</button>
          </div>
        </div>
      </section>

      {/* TAB 1: SEARCH & RIDE LISTINGS */}
      {activeTab === 'search' && (
        <section className="planner-section" id="journey">
          <div className="planner-heading">
            <p className="tagline">VERIFIED CAMPUS RIDES</p>
            <h2>Plan Your Ride Home</h2>
          </div>

          <form className="planner-form" onSubmit={handleSearch}>
            <label>Your Destination / Locality</label>
            <input
              type="text"
              placeholder="e.g., Model Town, Urban Estate, Bus Stand..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />

            <div className="planner-row">
              <div>
                <label>Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Departure Time</label>
                <input
                  type="time"
                  value={travelTime}
                  onChange={(e) => setTravelTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <label>Preference</label>
            <select value={rideType} onChange={(e) => setRideType(e.target.value)}>
              <option>Shared Ride Pool</option>
              <option>Direct Campus Ride</option>
            </select>

            <button type="submit">Find Authorized Rides →</button>
          </form>

          {/* RESULTS SECTION */}
          {hasSearched && (
            <div className="results-container">
              <h3>Authorized Rides for {destination || 'your destination'}</h3>
              <div className="rides-grid">
                {searchResults.map((ride) => (
                  <div key={ride.id} className="ride-card">
                    <div className="ride-header">
                      <h4>{ride.type}</h4>
                      <span className="price-tag">₹{ride.fare}</span>
                    </div>
                    
                    <div className="badge-row">
                      <span className="verified-badge">✓ {ride.badge}</span>
                      <span className="vehicle-id">Reg: {ride.vehicleNo}</span>
                    </div>

                    <p className="ride-detail"><strong>Rating:</strong> {ride.rating}</p>
                    <p className="ride-detail"><strong>Leaves:</strong> {ride.eta}</p>
                    <p className="ride-detail"><strong>Pickup Point:</strong> {ride.pickupSpot}</p>
                    <p className="ride-detail"><strong>Available Seats:</strong> {ride.seatsLeft}</p>
                    
                    <button className="book-btn" onClick={() => handleConfirmBooking(ride)}>
                      Reserve Seat (₹{ride.fare})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: MY BOOKINGS SECTION */}
      {activeTab === 'bookings' && (
        <section className="planner-section">
          <div className="planner-heading">
            <p className="tagline">YOUR ACTIVE RESERVATIONS</p>
            <h2>My Booked Rides</h2>
          </div>

          {userBookings.length === 0 ? (
            <div className="empty-state">
              <p>No active ride reservations yet.</p>
              <button className="book-btn" onClick={() => setActiveTab('search')}>Find a Ride Now</button>
            </div>
          ) : (
            <div className="results-container">
              <div className="rides-grid">
                {userBookings.map((b, idx) => (
                  <div key={idx} className="ride-card booked-card">
                    <div className="ride-header">
                      <h4>{b.type}</h4>
                      <span className="pass-tag">{b.passCode}</span>
                    </div>
                    <p className="ride-detail"><strong>Destination:</strong> {b.destination}</p>
                    <p className="ride-detail"><strong>Pickup Spot:</strong> {b.pickupSpot}</p>
                    <p className="ride-detail"><strong>Vehicle Reg:</strong> {b.vehicleNo}</p>
                    <p className="ride-detail"><strong>Fare:</strong> ₹{b.fare} (Pay Driver)</p>
                    <span className="status-badge">Confirmed ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* STUDENT LOGIN MODAL */}
      {isLoginOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Student Authentication</h3>
            <p>Log in with your official campus email to access verified pools.</p>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="student@campus.ac.in"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
              <input type="password" placeholder="Password" required />
              <div className="modal-actions">
                <button type="submit" className="login-btn">Log In</button>
                <button type="button" className="close-btn" onClick={() => setIsLoginOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFER RIDE MODAL */}
      {isOfferModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Host a Ride Share</h3>
            <p>Day scholars with vehicles can offer seats to peers heading the same way.</p>
            <form onSubmit={handleOfferRide}>
              <input 
                type="text" 
                placeholder="Destination / Locality (e.g. Model Town)" 
                value={newLocality} 
                onChange={(e) => setNewLocality(e.target.value)} 
                required 
              />
              <input 
                type="number" 
                placeholder="Shared Fare per Seat (e.g. 50)" 
                value={newFare} 
                onChange={(e) => setNewFare(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Vehicle Info (e.g. Bike / Swift)" 
                value={newVehicle} 
                onChange={(e) => setNewVehicle(e.target.value)} 
                required 
              />
              <input 
                type="text" 
                placeholder="Campus Pickup Point (e.g. Gate 1)" 
                value={newPickup} 
                onChange={(e) => setNewPickup(e.target.value)} 
                required 
              />
              <div className="modal-actions">
                <button type="submit" className="login-btn">List Pool</button>
                <button type="button" className="close-btn" onClick={() => setIsOfferModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DIGITAL PASS / TICKET MODAL */}
      {activeTicket && (
        <div className="modal-overlay">
          <div className="modal-content ticket-modal">
            <span className="ticket-badge">✓ SEAT RESERVED</span>
            <h2>CampusRide Pass</h2>
            <hr />
            <p><strong>Ride Type:</strong> {activeTicket.type}</p>
            <p><strong>Destination:</strong> {activeTicket.destination}</p>
            <p><strong>Pickup Spot:</strong> {activeTicket.pickupSpot}</p>
            <p><strong>Vehicle Reg:</strong> {activeTicket.vehicleNo}</p>
            <p><strong>Fare to Pay:</strong> ₹{activeTicket.fare} (Fixed Rate)</p>
            <div className="pass-code">PASS CODE: {activeTicket.passCode}</div>
            <button className="book-btn" onClick={() => setActiveTicket(null)}>Done & Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;