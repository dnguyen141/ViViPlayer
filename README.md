# ViViPlayer-3

To compile the specification you will need a LaTeX installation. You can then compile the .tex file with the pdflatex command to receive a pdf file.

### run dev server

you need to prepare your dvelopment server once before first use by executing `docker build -t viviplayer_env .` in the project root directory

to then start the development server execute  `docker run -p 8000:8000 -ti viviplayer_env python manage.py runserver 0.0.0.0:8000`
