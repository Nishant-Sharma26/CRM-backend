CRM Backend - Hey There!
Hey! Welcome to the backend for my CRM project. This is the server-side piece that powers the candidate management system I’ve been working on. It’s built with Node.js and Express, and I’ve thrown in some cool stuff like MongoDB (via Mongoose), JWT for auth, bcrypt for password security, and Amazon S3 for storing resumes. Let me walk you through what it does and how to get it running!

What’s Inside (Features)
Signup & Login:
You can hit /api/auth/signup to create a new user with an email and password (hashed with bcrypt, of course), and it’ll give you back a JWT token. Same deal with /api/auth/login—log in and grab your token. Pretty straightforward!
Candidate Stuff:
Add Candidates: POST to /api/candidates with details like name, email, phone, job title, and a resume file—it’ll upload the resume to S3 and save everything.
List Candidates: GET /api/candidates pulls all the candidates (you’ll need a token for this one).
Update Status: PUT to /api/candidates/:id/status lets you switch a candidate’s status to Pending, Reviewed, or Hired.
Delete: DELETE /api/candidates/:id wipes a candidate out of the system.
I’ve got two Mongoose schemas: one for users (just email and password) and one for candidates (all the juicy details).

Resume Uploads:
Resumes go straight to an Amazon S3 bucket, and I store the URL in the candidate’s record. Keeps things tidy!
Security:
Passwords are hashed with bcrypt, so no plain text nonsense. JWT tokens lock down the candidate routes—gotta send Authorization: Bearer <token> in the header.
CORS:
Set up to play nice with my frontend running at http://localhost:3000 locally and https://crm-frontend-umber-rho.vercel.app when deployed.
Health Check:
Hit /health to make sure the server’s alive—it’ll say "OK" if everything’s good.


How to Run It Locally
Alright, here’s how to fire this thing up on your machine:

What You’ll Need
Node.js: Grab version 14 or higher—older ones might give you grief.
npm: Comes with Node, so you’re covered.
MongoDB: Either run it locally or use MongoDB Atlas (I’ve got it hooked up either way).
AWS S3: You’ll need an S3 bucket and some AWS credentials (access key, secret key).

Steps
Clone It:
Snag the code from GitHub:

git clone https://github.com/Nishant-Sharma26/CRM-backend.git
cd CRM-backend

npm install

Set Up the Environment

MONGO_URI=mongodb://localhost:27017/crm_db  # Your MongoDB connection string
JWT_SECRET=something-super-secret           # Make this random and secure!
ALLOWED_ORIGINS=http://localhost:3000,https://crm-frontend-umber-rho.vercel.app
AWS_ACCESS_KEY_ID=your-aws-key              # From AWS IAM
AWS_SECRET_ACCESS_KEY=your-aws-secret       # From AWS IAM
AWS_S3_BUCKET=your-bucket-name              # Your S3 bucket
AWS_REGION=us-east-1                        # Your bucket’s region

Start the Server


Try It Out:
Use Postman or curl to test:
Signup: POST http://localhost:5000/api/auth/signup with {"email": "test@example.com", "password": "password123"}.
Get candidates: GET http://localhost:5000/api/candidates (add your token in the Authorization header).


Assumptions & Stuff to Watch Out For
Assumptions
MongoDB: I’m assuming you’ve got MongoDB running or an Atlas URI ready to go.
AWS S3: Figured you’ve set up a bucket and have the keys handy—I’m uploading resumes straight there.
Frontend: Built this to work with my frontend at http://localhost:3000 or the deployed version on Vercel.
Tokens: The frontend sends the token in the header like Bearer <token>—that’s how I lock things down.
Limitations
CORS: It’s set for my frontend URLs—if you deploy somewhere else, you’ll need to update the ALLOWED_ORIGINS.
Errors: I’ve got basic error logging, but it’s not super fancy—just 500s with a message. Could use more polish.
Scale: Works fine for a small setup, but no rate limits or caching yet—might choke under heavy load.
S3 Fails: If S3 goes down, there’s no backup plan for resumes right now.
Security: The JWT secret’s in .env—keep it safe and change it sometimes in production!
Testing: Haven’t added tests, so you’ll need to poke it manually with the frontend or Postman.