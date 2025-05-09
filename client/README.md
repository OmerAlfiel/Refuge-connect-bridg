# Refuge Connect Bridge - Client

## Project Overview

Refuge Connect Bridge is a web application designed to connect refugees with resources, partners, and services they need. The platform facilitates communication between refugees, aid organizations, and service providers through a comprehensive dashboard interface.

## Tech Stack

This React application utilizes modern web technologies:

- **React**: Core UI library
- **TypeScript**: For type-safe code
- **React Router**: For application routing
- **TanStack Query (React Query)**: For server state management
- **Tailwind CSS**: For styling with a utility-first approach
- **Recharts**: For data visualization components
- **Shadcn UI**: For component styling and theming
- **Socket.io-client**: For real-time communication
- **React Hook Form**: For form handling with validation
- **Zod**: For schema validation
- **Mapbox GL**: For interactive maps

## Project Structure

```bash
refuge-connect-bridge/client/
├─ src/
│  ├─ components/      # Reusable UI components
│  │  ├─ ui/           # Core UI components (based on shadcn/ui)
│  │  └─ dashboards/   # Role-specific dashboard components
│  ├─ context/         # React context providers
│  │  ├─ AuthContext   # Authentication state management
│  │  └─ WebSocketContext # WebSocket connection management
│  ├─ lib/             # Utility functions and shared code
│  ├─ hooks/           # Custom React hooks
│  │  ├─ use-needs.ts  # Hooks for needs management
│  │  ├─ use-notification.ts # Hooks for notification handling
│  │  └─ ...           # Other feature-specific hooks
│  ├─ pages/           # Application pages
│  ├─ services/        # API service integrations
│  ├─ types/           # TypeScript type definitions
│  └─ index.css        # Global styles
├─ tailwind.config.ts  # Tailwind configuration
└─ components.json     # UI component configuration
```

## Features

### User Experience

- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Mode**: Theme support for different user preferences
- **Role-Based Dashboards**: Customized interfaces for refugees, volunteers, NGOs, and administrators
- **Internationalization**: Support for multiple languages to serve diverse user populations

### Core Functionality

- **Authentication**: User registration and login system with role-based access
- **Dashboard**: Central hub for refugee information and services
- **Partners Management**: Track and manage partner organizations
- **Needs Tracking**: Document and manage refugee needs
- **Offers Management**: Allow volunteers and organizations to create service offerings
- **Matching System**: Connect needs with appropriate offers
- **Resource Mapping**: Geographic visualization of available resources
- **Announcements**: System-wide notifications and updates
- **Messaging System**: Real-time communication between users
- **Notifications**: User alerts and updates
- **Interactive Maps**: Location-based resource visualization
- **Data Visualization**: Charts and graphs for data analysis

### Technical Features

- **State Management**: Efficient state management with React Context and TanStack Query
- **Form Handling**: Robust form validation with React Hook Form and Zod
- **API Integration**: Structured API calls with custom hooks and services
- **WebSocket Integration**: Real-time updates through WebSocket connections
- **Lazy Loading**: Performance optimization with component lazy loading
- **Error Handling**: Comprehensive error handling and user feedback
- **Accessibility**: ARIA-compliant components for better accessibility

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/OmerAlfiel/Refuge-connect-bridg.git
   cd refuge-connect-bridge/client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:8080` (or the port shown in your terminal)

## Usage

The application provides various routes for different functionalities:

- `/` - Welcome page
- `/login` & `/register` - Authentication pages
- `/dashboard` - Main user dashboard
- `/partners` - Partners management
- `/needs` - Needs tracking and management
- `/resources` - Resource mapping
- `/announcements` - System announcements
- `/messages` - User messaging system
- `/notifications` - User notifications
- `/map` - Interactive resource map
- `/settings` - User and application settings
- `/about` - About page with project information

## Building for Production

```bash
npm run build
# or
yarn build
```

The production build will be output to the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
