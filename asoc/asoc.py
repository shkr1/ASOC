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
import sys
from collections import Counter

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
    mensajes = get_page_comments(url)
    # mensajes = ["estoy muy feliz","estoy feliz","eres un tonto","estoy muy molesto","soy feliz","no soy feliz","estoy feliz y triste"]
    resultado = get_sentiment(mensajes)

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

    ACCESS_TOKEN = 'EAACEdEose0cBADxm0IaPHVC3Yo0IoaqMbjAY638ZBcXkqK11hb19LXPLZBuU6148OyDzgNbCC65iasbyQHWlYrL222UZBrMEqFZAJ5uQe0jZBPB5Jn6v1UZAY09a1mnRHj29SfIBWy3fbbqkG4QFvPGVIyI3ctoF2OyOqF2YZBK7zpJ5BKo1s9aZBmYmf2uGlJmmZAZCLElZAmkpQZDZD'
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

def get_sentiment(mensajes):
    url = "http://api.meaningcloud.com/sentiment-2.1"
    puntos = []
    par = 0
    for mensaje in mensajes:
        # print(mensaje, file=sys.stdout)
        payload = "key=5c804449950579c8c623bf2d136d21e5&lang=auto&txt="+ mensaje +"&txtf=plain"
        payload = json.dumps(payload).encode("utf-8")
        headers = {'content-type': 'application/x-www-form-urlencoded'}
        
        try:
            response = requests.request("POST", url, data=payload, headers=headers)
            sent_json = json.loads(response.text)

            # print(sent_json, file=sys.stdout)
            puntos.append(sent_json['score_tag'])
            if par%2 == 0:
                time.sleep(2)
            par+=1
        except Exception as e:
            continue 

    contador = Counter(puntos)
    # print("P+",contador['P+'], file=sys.stdout)
    # print('P',contador['P'], file=sys.stdout)
    # print('NEU',contador['NEU'], file=sys.stdout)
    # print('N',contador['N'], file=sys.stdout)
    # print('N+',contador['N+'], file=sys.stdout)
    # print('NONE',contador['NONE'], file=sys.stdout)
    return contador 