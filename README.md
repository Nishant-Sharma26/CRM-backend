CRM Backend
This is the backend API for a Customer Relationship Management (CRM) system, built with Node.js and Express. It provides endpoints for user authentication, candidate management, and resume storage, integrated with MongoDB (via Mongoose), JWT, bcrypt, and Amazon S3.

Features Implemented
Authentication:
Signup: POST /api/auth/signup - Registers users with email and hashed password (bcrypt), returning a JWT.
Login: POST /api/auth/login - Authenticates users, returning a JWT if credentials match.
JWT: Secures endpoints with token-based authentication.
Candidate Management:
Create: POST /api/candidates - Adds a new candidate with details (name, email, phone, job title, status, resume).
Read: GET /api/candidates - Retrieves all candidates (protected route).
Update Status: PUT /api/candidates/:id/status - Updates a candidate’s status (Pending, Reviewed, Hired).
Delete: DELETE /api/candidates/:id - Removes a candidate by ID.
Schemas: Uses Mongoose with two schemas:
User: For authentication (email, hashed password).
Candidate: For candidate data (name, email, phone, jobTitle, status, resumeUrl).
Resume Storage:
Amazon S3: Uploads candidate resumes to an S3 bucket, storing the URL in the candidate schema.
Security:
bcrypt: Hashes passwords before storing in MongoDB.
JWT: Protects candidate endpoints, requiring Authorization: Bearer <token> header.
CORS:
Configured to allow requests from http://localhost:3000 (local frontend) and https://crm-frontend-umber-rho.vercel.app (deployed frontend).
Health Check:
GET /health - Returns server status for monitoring.
Steps to Run the Project Locally
Prerequisites
Node.js: Version 14.x or higher.
npm: Comes with Node.js.
MongoDB: A running MongoDB instance (local or Atlas).
AWS Account: For S3 access (keys and bucket setup).
Installation
Clone the Repository:
bash

Collapse

Wrap

Copy
git clone https://github.com/Nishant-Sharma26/CRM-backend.git
cd CRM-backend
Install Dependencies:
bash

Collapse

Wrap

Copy
npm install
Installs Express, Mongoose, cors, dotenv, jsonwebtoken, bcrypt, and AWS SDK (e.g., aws-sdk).
Configure Environment:
Create a .env file in the root directory:
text

Collapse

Wrap

Copy
MONGO_URI=mongodb://localhost:27017/crm_db  # Or your MongoDB Atlas URI
JWT_SECRET=your-secret-key                 # Replace with a secure key
ALLOWED_ORIGINS=http://localhost:3000,https://crm-frontend-umber-rho.vercel.app
AWS_ACCESS_KEY_ID=your-aws-access-key      # From AWS IAM
AWS_SECRET_ACCESS_KEY=your-aws-secret-key  # From AWS IAM
AWS_S3_BUCKET=your-s3-bucket-name          # Your S3 bucket
AWS_REGION=us-east-1                       # Your S3 region
Replace values with your own credentials.
Run the Application:
bash

Collapse

Wrap

Copy
npm start  # Or node server.js
Starts the server at http://localhost:5000 (default port unless overridden).
Test Endpoints:
Use tools like Postman or curl:
POST http://localhost:5000/api/auth/signup with { "email": "test@example.com", "password": "password123" }.
GET http://localhost:5000/api/candidates with Authorization: Bearer <token>.
Deployment on Vercel
Install Vercel CLI:
bash

Collapse

Wrap

Copy
npm install -g vercel
Deploy:
bash

Collapse

Wrap

Copy
vercel
Follow prompts to link your project and set environment variables in Vercel dashboard.
Ensure vercel.json (if needed) specifies:
json

Collapse

Wrap

Copy
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
Assumptions and Limitations
Assumptions
MongoDB: Assumes a MongoDB instance is available and configured with MONGO_URI.
AWS S3: Assumes an S3 bucket is set up with proper IAM permissions for uploads.
Frontend: Designed to work with crm-frontend at http://localhost:3000 (local) and https://crm-frontend-umber-rho.vercel.app (deployed).
Token Format: Expects frontend to send Authorization: Bearer <token> for protected routes.
Single Schema per Candidate: Assumes one candidate schema; additional schemas (e.g., for referrals) aren’t detailed.
Limitations
CORS: Currently allows specific origins; additional frontend deployments require updating ALLOWED_ORIGINS.
Error Handling: Basic error middleware logs to console and returns 500—more granular error responses could be added.
Scalability: No rate limiting or caching—suitable for small-scale use but may need optimization for high traffic.
Resume Upload: Assumes S3 upload works flawlessly; no fallback if S3 fails (e.g., local storage).
Security: JWT secret is hardcoded in .env—should be rotated periodically in production.
Testing: No automated tests—manual testing via frontend or API tools required.