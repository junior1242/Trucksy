# Trucksy 
This is a Final Year project that connects users who need transportation services with truck drivers. Built with [React Native](https://reactnative.dev) using [Expo](https://expo.dev).

## Features

### User (Customer) Features

- Email-based authentication and verification
- Create bookings with interactive map selection for pickup/dropoff locations
- Specify vehicle type, load type, and price estimates
- Track booking status and history

### Driver Features

- Driver authentication and KYC verification
- View available bookings in the booking pool
- Accept and manage assigned bookings

## Prerequisites

Before setting up the project, ensure you have the following installed:

- A code editor like [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/) for version control
- A Mapbox account for map functionality
- A Clerk account for authentication services
- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) (v8 or newer) or [Yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your Android device for testing

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/junior1242/Trucksy.git
cd Trucksy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_API_BASE_URL=http://your-api-url
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_SOCKET_URL=your_socket_url
EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

```

Notes:

- Register for a [Clerk](https://clerk.dev/) account to get your publishable key
- Get a [Mapbox](https://www.mapbox.com/) token for the map functionality
- Set up your backend API server

## Running the Application

### Development Mode

```bash
npm start
```

This will start the Expo development server and display a QR code. Scan this code with:

- **iOS**: Use the device's Camera app
- **Android**: Use the Expo Go app

We are using [Expo Go](https://expo.dev/go) for the output on android device for developers, and [development builds](https://docs.expo.dev/develop/development-builds/introduction/) for testing as well as for users.


## Application Flow

1. **Authentication Flow**:
   - Sign up or sign in with email
   - Verify email with a verification code
   - Select role (User or Driver)

2. **User (Customer) Flow**:
   - Navigate to user dashboard
   - Create booking:
     - Set pickup location (map or search)
     - Set dropoff location (map or search)
     - Select vehicle type
     - Select load type
     - Set price estimate
     - Confirm booking
   - View active and past bookings

3. **Driver Flow**:
   - Complete KYC verification
   - View available bookings in the booking pool
   - Accept bookings
   - Manage active deliveries

## Tech Stack

- **Frontend**:
  - React Native using Expo
  - [NativeWind](https://nativewind.dev/) - For responsiveness across different devices
  - Expo Router - Navigation
  - Mapbox - Maps and location

- **Authentication**:
  - Clerk - Authentication service

- **State Management & API**:
  - Axios - HTTP client

### Acknowledgements

Built as a Final Year Project
