# Event Management System API

A RESTful Event Management System API built with **Node.js**, **Express.js**, and **PostgreSQL**. The system enables users to create and manage events, book seats, and handle reservations securely while preventing overbooking through transactional database operations.

## Live Demo

**Base URL:** https://bookingapi-d94q.onrender.com/

**Health Check Endpoint:** https://bookingapi-d94q.onrender.com/health

---

## Features

### Authentication & Authorization

* JWT-based authentication
* Secure user registration and login
* Protected API routes

### Event Management

* Create new events
* Retrieve event details
* Update existing events
* Manage event seating capacity

### Booking System

* Book seats for events
* Prevent overbooking using atomic database transactions
* Manage user bookings

### Database & Concurrency Control

* PostgreSQL database integration
* Row-level locking for concurrent booking requests
* Transaction-based operations for data consistency

### Security

* Password hashing using PBKDF2
* Input validation and sanitization
* Secure authentication workflow

### Performance & Reliability

* Pagination support for large datasets
* Structured error handling
* Meaningful HTTP status codes
* RESTful API architecture

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### Authentication

* JSON Web Tokens (JWT)
* PBKDF2 Password Hashing

---

## Installation

### Clone the Repository

```bash
git clone git@github.com:Mengawanji/BookingAPI.git
cd BookingAPI
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file and provide the required environment variables:

```env
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

### Start the Application

```bash
npm start
```

The server will be available at:

```text
https://bookingapi-d94q.onrender.com/
```

---

## API Endpoints

### Authentication

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/auth/register` | Register a new user                  |
| POST   | `/auth/login`    | Authenticate a user and obtain a JWT |

---

### Events

| Method | Endpoint           | Description               |
| ------ | ------------------ | ------------------------- |
| POST   | `/events`          | Create a new event        |
| GET    | `/events`          | Retrieve all events       |
| GET    | `/events/:id`      | Retrieve a specific event |
| PUT    | `/events/:id`      | Update an existing event  |
| POST   | `/events/:id/book` | Book seats for an event   |

---

### Bookings

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/bookings`        | Retrieve all bookings         |
| DELETE | `/bookings/:id`    | Cancel a booking              |
| POST   | `/events/:id/book` | Create a booking for an event |

---

## Project Highlights

* RESTful API design principles
* PostgreSQL transaction management
* Concurrency-safe booking operations
* Secure JWT authentication
* Robust validation and error handling
* Scalable architecture for event and booking management

---
