In-Development Project-Notes
- Features are still extremely limited and app may have catastrophic bugs
- Currently running dev builds of vite + react and django servers inside a docker container
- This project is currently only fully configured to be run locally

## Setup Instructions

1. Install docker desktop onto your machine.
2. Clone this repository.
3. Run "docker compose up -d" to run the project or "docker compose watch" to have the docker container automatically update with your changes.
    -  Note that you can still run commands locally outside of the docker container as needed, you will just need to manually rebuild the container after.
5. Access the app through a browser at http://localhost:5173/ (Frontend) or http://localhost:8000/ (Backend).
