# DRRS
## Latest auto-deployment
1. Go to [forked-drrs](https://github.com/DRRS-Pegasus/drr-system)
2. `Sync Fork` if branch is behind
3. Go to [DRRS Vercel](https://drr-system.vercel.app/)

## TODO
- [ ] Unit and Integration tests using Jest

## DRRS-BE API
[drrs-be](https://github.com/kudegras/drrs-be)
backend apis

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
