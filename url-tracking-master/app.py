from flask import Flask, request, jsonify, render_template, g
import requests, os, sqlite3, datetime, json

app = Flask(__name__)
DATABASE = 'master.sqlite'
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

'''Database connect'''


def connect_db():
    return sqlite3.connect(DATABASE)


@app.before_request
def before_request():
    g.db = connect_db()


def insert_server(address, name, service, location, description):
    sql = 'INSERT INTO server (address, name, service, location, description) VALUES (?,?,?,?,?)'
    g.db.execute(sql, (address, name, service, location, description))
    g.db.commit()


def update_server(address, name, service, description):
    sql = 'UPDATE server SET name=?,service=?,description=?,update_time=? WHERE address=?'
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    g.db.execute(sql, (name, service, description, time, address))
    g.db.commit()


def query_db(query, args=(), one=False):
    cur = g.db.execute(query, args)
    rv = [dict((cur.description[idx][0], value)
               for idx, value in enumerate(row)) for row in cur.fetchall()]
    return (rv[0] if rv else None) if one else rv


@app.teardown_request
def teardown_request(exception):
    if hasattr(g, 'db'):
        g.db.close()


'''Static Files'''


@app.route('/')
def index():
    return render_template("index.html")


'''Master-side'''


@app.route('/v1/master/heartbeat', methods=['POST'])
def heartbeat():
    status = True
    message = ''
    try:
        address = request.get_json()['address']
        name = request.get_json()['name']
        service = request.get_json()['service']
    except:
        status = False
        message = 'Missing required request parameters'
    else:
        ip = request.remote_addr
        try:
            sql = 'SELECT * FROM server WHERE address=?'
            server = query_db(sql, [address], one=True)
        except Exception as e:
            status = False
            message = 'Database update failed'
        else:
            if server is None:
                try:
                    description = request.get_json()['description']
                except:
                    description = ''
                r = requests.get('https://ip.cn', params={'ip': ip}, headers={'User-Agent': 'curl'})
                location = r.json()['country']
                try:
                    insert_server(address, name, service, location, description)
                    message = 'Success'
                except:
                    status = False
                    message = 'Database insert failed'
            else:
                try:
                    description = request.get_json()['description']
                except:
                    description = server['description']
                try:
                    update_server(address, name, service, description)
                    message = 'Success'
                except:
                    status = False
                    message = 'Database update failed'
    return jsonify({'status': status, 'message': message})


@app.route('/v1/master/serversInfo', methods=['GET'])
def servers_info():
    status = True
    message = ''
    serversInfo = []
    trackingUrl = []
    try:
        sql = 'SELECT * FROM server'
        for server in query_db(sql):
            service = json.loads(server['service'])
            serversInfo.append({
                'addr': server['address'],
                'name': server['name'],
                'location': server['location'],
                'description': server['description'],
                'updateTime': server['update_time']
            })
            if 'trackingUrl' in service:
                trackingUrl.append({
                    'addr': server['address'],
                    'name': server['name']
                })
        message = 'Success'
    except:
        status = False
        message = 'Database error'
    data = {'serversInfo': serversInfo, 'trackingUrl': trackingUrl}
    return jsonify({'status': status, 'data': data, 'message': message})


if __name__ == '__main__':
    app.run()
