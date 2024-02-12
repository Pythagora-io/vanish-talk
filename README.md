# Complex_Chat_App

Complex_Chat_App is a Node.js-based web application that offers a real-time chat experience accessible through a browser. Users can register, login, and verify their email to access the chat rooms. Inside the application, users can personalize their experience by changing their usernames, passwords, and avatar images. The chat functionality allows users to engage in public global chats or create/join private rooms with or without password protection.

## Overview

The application utilizes Node.js for server-side operations, Express for backend routing, MongoDB for data persistence, and Socket.IO for real-time bidirectional event-based communication. Front-end styling is achieved with basic HTML, CSS, and Bootstrap for responsiveness. The project structure includes server and client code segregation, dedicated routes for authentication and chat room management, and models for database interactions.

## Features

- User authentication with session management
- Email verification for new accounts
- Ability to update user profiles including avatars
- Public global chat room with message retention
- Private chat rooms with optional password protection
- Real-time chat with sound notifications for new messages
- Auto-deletion of empty rooms after a specified time

## Getting started

### Requirements

- Node.js (version 14 or later)
- MongoDB (Local or remote instance)
- An email service for sending verification emails

### Quickstart

1. Clone the repository to your local machine.
2. Navigate to the project directory and run `npm install` to install dependencies.
3. Create a `.env` file with appropriate values for database connection, email service, and other configurations as per `.env.example`.
4. Run `npm start` to start the server. The application will be accessible at https://localhost:3000.

### License

Copyright (c) 2024.