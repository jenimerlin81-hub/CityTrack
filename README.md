# CityTrack – Real-Time Public Transport Tracking System

"Your City. Your Bus. Real-Time."

A full-stack, real-time public transport tracking platform designed especially for small cities (modeled around Tiruchirappalli / Trichy city corridor, Tamil Nadu). The system enables commuters to view live bus locations, estimated arrival times (ETA), route lines, geofenced stops, and driver telemetry using WebSockets and Leaflet OpenStreetMap.

---

## 🚀 Key Features

### 1. Passenger App
- **Live Bus Tracking**: Real-time GPS movement of buses along routes without page reload.
- **Accurate Small-City ETA**: Calculated using the Haversine formula based on bus coordinates, average speed, and traffic buffers.
- **Smart Stop Locator**: Detects user position and ranks nearby bus stops with distance in kilometers.
- **Destination & Line Search**: Search by bus number (e.g. `101`, `204`), stop name, or terminal.
- **Favorites & Trip History**: Save frequent routes and review previous digital journey receipts.

### 2. Interactive Map (OpenStreetMap + Leaflet)
- Responsive vector map with custom animated HTML/SVG markers.
- Route polylines with distinct color coding per line.
- Live speed, heading angle, and next approaching stop labels.
- "Locate Me" button using HTML5 Geolocation API.

### 3. Driver Console
- Dedicated driver cockpit with start/stop trip timer.
- Telemetry gauges: Speedometer, Compass Heading, GPS Coordinates, and Passenger counter.
- Interactive stop sequence checklist.
- Switch between automated route simulation and live device GPS (`navigator.geolocation.watchPosition`).
- Delay advisory broadcaster.

### 4. Admin Command Center
- Fleet metrics: Total buses, active fleet, drivers, transit lines, stops, active trips.
- Full CRUD management:
  - Add / Decommission Buses
  - Create / Modify Routes and Waypoints
  - Register Drivers and assign to buses
  - Manage geofenced bus stops
- Trip monitoring and audit logs.

### 5. Automated Demo GPS Mode
- "Enable Demo Tracking" engine simulates realistic bus movements along actual city roads.
- Speed multipliers (1x, 2x, 4x) for rapid demonstration of ETA recalculation and stop triggers.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Leaflet, Lucide Icons, Motion.
- **Backend**: Node.js, Express.js, Socket.IO, RESTful API.
- **Database**: MongoDB schema parity with integrated high-performance seeded data store.
- **Authentication**: JWT token-based authentication with role-based access control (Passenger, Driver, Admin).

---

## 📦 How to Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/citytrack.git
cd citytrack

# Install dependencies
npm install
```

---

## ⚙️ How to Configure MongoDB

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Set your MongoDB connection URI:
   ```env
   MONGODB_URI="mongodb://localhost:27017/citytrack"
   PORT=3000
   JWT_SECRET="citytrack_super_secret_jwt_key_2026"
   ```
3. *Note:* If MongoDB is not running locally, the application automatically runs using the built-in in-memory database seeded with 5 buses, 5 drivers, 5 routes, 20 stops, and 10 passengers!

---

## 🏃 How to Run the Application

### Development Mode (Full-Stack Vite + Express + WebSockets):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build:
```bash
npm run build
npm start
```

---

## 🧪 Testing Demo GPS Tracking

1. Launch the app and go to the **Live Map** or **Passenger App** tab.
2. The demo GPS engine will already be active and moving buses smoothly.
3. Use the floating **Demo GPS Controls** bar:
   - Click **Pause Demo** / **Enable Demo Tracking** to toggle simulation.
   - Click **1x**, **2x**, or **4x** to accelerate bus movement and witness ETAs countdown in real-time.
   - Click the **Reset** icon to reload initial bus positions.

---

## 👥 Demo Accounts (1-Click Login Available)

| Role | Email | Password | Details |
|---|---|---|---|
| **Admin** | `admin@citytrack.in` | `admin123` | Divya Sundaram (Chief Controller) |
| **Driver** | `murugan.driver@citytrack.in` | `driver123` | Murugan Selvam (Assigned to Bus 101) |
| **Passenger** | `priya@gmail.com` | `passenger123` | Priya Rajendran (Commuter) |

*You can also switch roles anytime in 1 click using the Role Switcher in the top right header!*

---

## 📍 Sample Small-City Route Data (Trichy)

- **Route 101 (Cyan)**: Central Bus Stand ⇄ Srirangam Rajagopuram (8.5 km, 9 stops)
- **Route 102 (Blue)**: Railway Junction ⇄ NIT Trichy Campus Gate (18.2 km, 7 stops)
- **Route 204 (Green)**: Chathiram Bus Stand ⇄ Airport via K.K. Nagar (12.8 km, 7 stops)
- **Route 305 (Purple)**: Central Bus Stand ⇄ BHEL Township via Golden Rock (11.4 km, 6 stops)
- **Route 408 (Amber)**: Heritage Express: Rockfort ⇄ Samayapuram Toll (14.0 km, 7 stops)
