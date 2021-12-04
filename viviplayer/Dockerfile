# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /app
RUN python -m venv venv
COPY requirements.txt .
RUN /app/venv/bin/python3 -m pip install --upgrade pip
RUN /app/venv/bin/pip3 install -r requirements.txt
WORKDIR /app/backend
CMD /app/venv/bin/python3 manage.py runserver 0.0.0.0:8000
