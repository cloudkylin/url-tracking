import datetime
import json
import os
import requests
import sqlite3
from flask import Flask, request, jsonify, render_template, g
from flask_restful import Api

app = Flask(__name__)
api = Api(app)
DATABASE = 'master.sqlite'
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

'''Database connect'''


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.before_request
def before_request():
    g.db = get_db()


def insert_server(address: str, name: str, service: list, location: str, description: str, version: str):
    sql = 'INSERT INTO server (address, name, service, location, description, version) VALUES (?,?,?,?,?,?)'
    g.db.execute(sql, (address, name, json.dumps(service), location, description, version))
    g.db.commit()


def update_server(address: str, name: str, service: list, description: str, version: str):
    sql = 'UPDATE server SET name=?,service=?,description=?,version=?,update_time=? WHERE address=?'
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    g.db.execute(sql, (name, json.dumps(service), description, version, time, address))
    g.db.commit()


def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
               for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv


@app.teardown_request
def teardown_request(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        g.db.close()


'''Static Files'''


@app.route('/')
def index():
    return render_template("index.html")


'''Master-side'''


# 注册Slave服务器
@app.route('/v1/master/heartbeat', methods=['POST'])
def heartbeat():
    status = False
    try:
        address = request.get_json()['address']
        name = request.get_json()['name']
        service = request.get_json()['service']
        version = request.get_json()['version']
    except:
        message = 'Missing required request parameters'
    else:
        ip = request.remote_addr
        try:
            sql = 'SELECT * FROM server WHERE address=?'
            server = query_db(sql, [address], one=True)
        except:
            message = 'Database update failed'
        else:
            if server is None:
                try:
                    description = request.get_json()['description']
                except:
                    description = ''
                try:
                    r = requests.get('https://ip.cn', params={'ip': ip}, headers={'User-Agent': 'curl'})
                    location = r.json()['country']
                except:
                    location = 'unknown'
                try:
                    insert_server(address, name, service, location, description, version)
                except:
                    message = 'Database insert failed'
                else:
                    status = True
                    message = 'Success'
            else:
                try:
                    description = request.get_json()['description']
                except:
                    description = server['description']
                try:
                    update_server(address, name, service, description, version)
                except:
                    message = 'Database update failed'
                else:
                    status = True
                    message = 'Success'
    return jsonify({'status': status, 'message': message})


# 获取/添加Slave服务器信息
@app.route('/v1/master/serversInfo', methods=['GET', 'POST'])
def servers_info():
    status = False
    serversInfo = []
    try:
        sql = 'SELECT * FROM server'
        for server in query_db(sql):
            service = json.loads(server['service'])
            serversInfo.append({
                'address': server['address'],
                'name': server['name'],
                'location': server['location'],
                'description': server['description'],
                'version': server['version'],
                'service': service,
                'updateTime': server['update_time']
            })
        status = True
        message = 'Success'
    except:
        message = 'Database error'
    return jsonify({'status': status, 'data': serversInfo, 'message': message})


if __name__ == '__main__':
    app.run()
