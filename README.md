# ViViPlayer-3

## Setup

this software is designed to be run inside docker. You will need both `docker` and `docker-compose` installed on your system.

before the first execution prepare the docker containers and database by running `docker-compose build` followed by `docker-compose run django ../venv/bin/python manage.py migrate`

## Run

### development mode
to start the server execute  `docker-compose up --build` in the root directory of this project

the backend should be available at `http://127.0.0.1:8000` and the frontend at `http://127.0.0.1:3000`

### production mode

to start the server execute  `docker-compose -f prod.docker-compose.yml up --build` in the root directory of this project. you can additionally pass `-d` option to detach the container from your shell and run keep them running in the background. 

the backend should be available at `http://127.0.0.1:8080/api` and the frontend at `http://127.0.0.1:8080/`


## Documentation

a full list of API endpoints can be found at `http://127.0.0.1:8000/api/docs/` in dev mode

To compile the specification you will need a LaTeX installation. You can then compile the .tex file with the pdflatex command to receive a pdf file.