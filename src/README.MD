https://bookingapi-d94q.onrender.com/health


Event Management System

An RESTful Event Management System API built with Node.js, Express, and PostgreSQL.

FEATURES

// User Authentication: JWT-based authentication system

// Event Management: Create, read, update events with seat management

// Booking System: Book seats with atomic transactions to prevent overbooking

// Concurrency Control: Database transactions with row-level locking

// RESTful API: Clean, well-structured endpoints

// Security: Password hashing with PBKDF2, input validation

// Pagination: Efficient data retrieval for large datasets

// Error Handling: Comprehensive error handling and status codes



TECH STACK

Backend: Node.js, Express.js


CLONE REPOSITORY
git clone git@github.com:Mengawanji/BookingAPI.git


The app will be running at:

URL https://bookingapi-d94q.onrender.com/


API ENDPOINTS

Authentication Endpoints
========    ========    ===========

POST /auth/register => Register new user

POST /auth/login => User login


Events Endpoints
========    ========    ===========

POST /events => Create new event

POST /events/:id/book => Book seats for an event

PUT /:1d  => Update an event

GET /events/:id  => Get specific event

GET /events   => Get all event


Booking Endpoints
========    ========    ===========

GET /bookings/ => Get all Bookings

POST events/:id/book  => Book an event

DELETE /bookings/:id => Delete an event 









