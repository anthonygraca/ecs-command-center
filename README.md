# ecs-command-center

# Setup and Run Instructions
## Setting up the database and running the backend
- cd backend/
- python -m venv evne
- source venv/bin/activate
- pip install -r requirements.txt

- flask db init
- flask db migrate
- flask db upgrade

- python run.py

## Building and running the frontend
- npm install
- npm run dev

# Current Routes 
/orgs, /orgs/:id, and /admin 
