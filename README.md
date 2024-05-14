# DRRS
Discussion room reservation system for the UST library. A serverless web app built using Firebase, React, and Typescript.

## Features
- Google authentication for security
- Realtime viewing of reservations
- Responsive design which allows users to reserve anytime and anywhere
- Intelligent schedule recommendation when there is an overlap of reservation time
- Authorization roles: Admin and Librarians for site management
- Dashboard for branch and room management which allows for easier scalability and maintainability
- Logs for reservation tracking
- Analytics and reports to show trends and usage
- Email notification before reservations (backend)
- Automated reservation cancellation (backend)

## DRRS-BE API
Go to [drrs-be](https://github.com/kudegras/drrs-be) to check the backend apis

## Installation
1. Install the packages by typing `npm install`
2. Create a new file, then name it as `.env`
3. Copy and paste the code below to `.env`:
``` env
VITE_API_KEY=AIzaSyC948B9d6ilrIelZD0tiIEWxjWlZw8i8Fs
VITE_AUTH_DOMAIN=drr-system.firebaseapp.com
VITE_PROJECT_ID=drr-system
VITE_STORAGE_BUCKET=drr-system.appspot.com
VITE_MESSAGING_SENDER_ID=350863319556
VITE_APP_ID=1:350863319556:web:72eb2b16177346d2454b51
VITE_MEASUREMENT_ID=G-3D580LH65K

VITE_BACKEND_URL=https://drrs-be.onrender.com
```
4. Type `npm run dev` to run the server locally
