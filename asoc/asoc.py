# -*- coding: utf-8 -*-
"""
    Análisis de Sentimientos Orientado a Comentarios (ASOC)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""

import os, time
import facebook
import json
import requests
import urllib.request
import sqlite3
from flask import Flask, request, session, g, jsonify,redirect, url_for, abort, \
        render_template, flash

app = Flask(__name__)
app.config.from_object(__name__)

# Load default config and override confing from an enviroment variable
app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'asoc.db'),
    SECRET_KEY='secret_mgvd',
    USERNAME='admin',
    PASSWORD='default'
))
app.config.from_envvar('ASOC_SETTINGS', silent=True)

def connect_db():
    """Connects to the specific databae."""
    rv = sqlite3.connect(app.config['DATABASE'])
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
    """Opens a new database connection if there is none yet for the
    current applicaction context.
    """
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'sqlite_db'):
        g.sqlite_db.close()

def init_db():
    """Initializes the database."""
    db = get_db()
    with app.open_resource('schema.sql', mode='r') as f:
        db.cursor().executescript(f.read())
    db.commit()

@app.cli.command('initdb')
def initdb_command():
    """Creates the database tables."""
    init_db()
    print('Initialized the database.')

@app.route('/search')
def add_numbers():
    url = request.args.get('url', 0, type=str)
    time.sleep(1)
    return jsonify(result=url)

@app.route('/')
def index():
    return render_template('base.html')

def get_page_comments(url, limit=400):
    """Encuentra los comentarios del último post de la página de Facebook.
       
       Los url's por el momento se limitan a tener un solo slash. Por ejemplo:

       https://www.facebook.com/NFL/

       De esa manera con una simple expresión regular se obtiene el object_id,
       el cual en este caso en particular es NFL.
    """

    messages = []

    ACCESS_TOKEN = 'EAACEdEose0cBAO9f0XCyjPTNOBgx4wfUBzkLCDwAbZAYNnrLJ9B5FKLrZBOD50XoNVur4NHbUjnm1bmZAYLx0hZCvoZC9WNKVgf1NdYH5bdetUJ20XVKIDyZBIh4FZAD2enGh7kcUE4wntZAsUwZAli2W2tjoFs0FmMLGVT8b6HZAGqaGJB72sPzbp0cL8bw6PILEHk1XDRYF6ZBgZDZD'
    g = facebook.GraphAPI(ACCESS_TOKEN)
    object_id = url.rsplit('/')[3]
    posts = g.get_connections(object_id, 'posts')
    last_post = posts["data"][0]
    last_post_id = last_post["id"]
    comments = g.get_object(last_post_id, fields="comments")
    
    # Adjuntamos la primeros comentarios.

    for comment in comments['comments']['data']:
        message = comment['message']
        if message:
            messages.append(message)

    # Si existen más comentarios tendremos que agregarlos también.

    while len(messages) < limit and comments['comments']['paging'].get('next'):
        _url = comments['comments']['paging']['next']
        with urllib.request.urlopen(_url) as response:
            p = response.read().decode('utf-8')
            posts = json.loads(p)

        for comment in posts['data']:
            message = comment['message']
            if message:
                messages.append(message)

    return messages # Caso de prueba: get_page_comments('https://www.facebook.com/animalsinrandomplaces/')
