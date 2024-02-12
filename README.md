# Complex_Chat_App

Complex_Chat_App is a comprehensive chat application designed to provide a seamless chatting experience in a browser. Built with Node.js, this application supports diverse functionalities such as user authentication, session management, email verification, and real-time chatting in various chat rooms. Users can personalize their profiles by updating their usernames, passwords, and avatars directly from the dashboard. The application encapsulates a global chat room feature where messages are stored for a limited time, alongside the creation of private chat rooms with optional password protection for added security.

## Overview

The application employs Node.js for its backend services, with Express.js facilitating the routing mechanisms. MongoDB is used for data storage, ensuring persistence of user credentials and messages in the global chat room. Socket.IO enables real-time, bidirectional communication between clients and the server. For the front-end, simple HTML, CSS, and Bootstrap are utilized to create a responsive and user-friendly interface.

## Features

- User authentication and session management
- Email verification for new accounts
- Profile management including username, password, and avatar updates
- A global chat room with temporary message storage
- Creation of private chat rooms, with optional password protection
- Real-time messaging with timestamp and sound notifications
- Automatic deletion of empty rooms after a set period of inactivity

## Getting started

### Requirements

- Node.js (version 14 or later recommended)
- MongoDB instance (local or cloud-based)
- SMTP server details for nodemailer configuration

### Quickstart

1. Clone the repository to your local system.
2. Run `npm install` in the project directory to install needed dependencies.
3. Populate the `.env` file with the necessary environment variables as illustrated in `.env.example`.
4. Execute `npm start` to run the server. By default, the application will be accessible at `https://localhost:3000`.

### License

Copyright (c) 2024.