# Cycle Count App

## Structure

The app is a full-stack web application designed to be used within a `Docker` container. The entire application stack is made up of 4 parts: Frontend, Backend, WebServer, and Backup.

### Frontend

- The frontend is a `React` application built using the open-source javascript module bundler `Vite`.
- The majority of the frontend codebase is written in `typescript` and its dependencies can be found inside `./Frontend/package.json`.
- Frontend documentation on patterns used throughout can be found in `./Frontend/docs`. Additional documentation is present throughout various react `.tsx` files making up the bulk of the frontend.
- The Frontend relies on data from the backend to function properly. The url used to make calls to the database must be correctly configured in `./Frontend/src/api/apiConfig.ts`. Currently it is configured to query `https://cyclecount.app/db`.
- To run the application in development mode locally, run `npm run dev` inside `./Frontend`. A development version of the application be found at `localhost:5173`.
- In production, the frontend source files are not used, and code is compiled by running `npm run build` inside `./Frontend`. The compiled static application in `html` format can be found in`./Frontend/dist` when complete. This `dist` folder is placed within `./WebServer` in production to be served with `nginx`.

### Backend

- The backend is built upon the `Django` web framework using `djangorestframework` to handle requests; it is served using `Gunicorn` web server.
- The majority of the backend codebase is written in `python` and its dependencies can be found inside `./Backend/requirements.txt`.
- The backend writes all data to a `.sqlite3` database found in `./Backend/data`.
- Key files to the backend's functionality include:
  - `settings.py` managing high-level application settings as well as security header settings. Currently the application is configured to host the backend at <https://cyclecount.app/db> and only accept same-site requests from <https://cyclecount.app> over `https`.
  - `models.py` determining the various models used in the database, their fields, as well as any relationships between models.
    - NOTE: All changes made to models must be migrated to the database by running `django manage.py makemigrations` followed by `django manage.py migrate`, and each model and field must be properly reflected within `serializers.py`.
  - `urls.py` which determines the url patterns used by the django REST API framework.
  - `views.py` which links each url pattern with an underlying API call to a CRUD action in the database.
  - `admin.py` which manages which models should be present on the django administration site.
- In addition, a private key securing the backend must be provided in the root directory with the name `django-private-key.txt`.
- In development, the django server can be run locally by running `django manage.py runserver`. Running the server this way in production is bad practice.
- In production, the backend is served with `gunicorn`, and its the admin site's static `.css` files are served with `nginx`.

### Webserver

- The entire application is served to the web using `nginx`.
- Currently, nginx is configured to serve the site to <https://cyclecount.app> using `https`.
  - Both the `ssl` private key and public certification must be placed in the root directory named `ssl-private-key.txt` and `ssl-public-key.crt`.
- The nginx config can be found in `./WebServer/nginx.conf`.
- In production, as discussed earlier, the built frontend application should be placed in `./WebServer/dist`.

### Backup

- This aspect of the application is purely used to backup the `.sqlite3` database bi-weekly. It uses a third-party `Docker` image to backup the database volume within the container.
- Backups are saved to `./Backup/archive` and configuration files for various settings such as the time, frequency, and format of backups can be found in `./Backup/backup.env`. Backups are currently configured to be pruned after 60 days.
- Information on how to use these backups to restore the database can be found in `./Backup/db-restore.md`.

## Running the Application

1. Clone this repository.'
2. Build the frontend with `npm run build` and place the generated `dist` folder inside the `./WebServer` folder.
3. Place the proper secret `django-private-key.txt`, `ssl-private-key.txt`, and `ssl-public-key.txt` files in the root of the directory.
4. Run `docker compose up -d` in the home directory to build the docker container (Prior docker installation is required).
5. Access the app through a browser at <https://cyclecount.app> (Authentication is required for access).
