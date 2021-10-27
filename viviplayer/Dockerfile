# syntax=docker/dockerfile:1
FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /app
RUN python -m venv venv
COPY requirements.txt .
RUN . venv/bin/activate && python -m pip install --upgrade pip
RUN . venv/bin/activate && pip install -r requirements.txt
WORKDIR /app/backend
