# Refuge Connect Bridge

A comprehensive platform connecting refugees with essential resources, support services, and volunteers.

## Project Overview

Refuge Connect Bridge is a full-stack web application designed to address the challenges faced by refugees in accessing essential services and resources. The platform creates a bridge between refugees, volunteers, NGOs, and service providers through an intuitive interface for matching needs with appropriate offerings.

### Key Features

- **User Role System**: Different interfaces for refugees, volunteers, NGOs, and administrators
- **Needs & Offers Matching**: Smart matching system connecting refugee needs with volunteer/NGO offerings
- **Real-time Messaging**: In-app communication system with WebSocket support
- **Interactive Map**: Location-based resource discovery
- **Notifications**: Real-time updates for matches, messages, and announcements
- **Multi-language Support**: Internationalization support for refugees from different regions

## Tech Stack

### Client (Frontend)

- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom theming
- **Component Library**: Custom components built with Radix UI primitives
- **State Management**: React Context API and TanStack Query
- **Routing**: React Router
- **Real-time Communication**: Socket.io client
- **Form Management**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Maps Integration**: Mapbox GL

### Server (Backend)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT-based authentication system
- **Real-time Communication**: WebSocket Gateway with Socket.io
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Class-validator and class-transformer

## Project Structure

The project follows a typical full-stack application structure:

```bash
refuge-connect-bridge/
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks 
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API service integrations
│   │   └── types/         # TypeScript type definitions
│   └── ...
│
├── server/                # NestJS backend application
│   ├── src/
│   │   ├── auth/          # Authentication modules
│   │   ├── database/      # Database configuration
│   │   ├── matches/       # Match-related functionality
│   │   ├── messages/      # Messaging system
│   │   ├── needs/         # Needs management
│   │   ├── offers/        # Offers management
│   │   ├── users/         # User management
│   │   └── websocket/     # WebSocket communication
│   └── ...
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/refuge-connect-bridge.git
   cd refuge-connect-bridge
   ```

2. Install server dependencies

   ```bash
   cd server
   npm install
   ```

3. Install client dependencies

   ```bash
   cd ../client
   npm install
   ```

4. Configure environment variables (see .env.example files in both directories)

### Running the Application

1. Start the server

   ```bash
   cd server
   npm run start:dev
   ```

2. Start the client

   ```bash
   cd client
   npm run dev
   ```

3. Access the application at `http://localhost:8080`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
