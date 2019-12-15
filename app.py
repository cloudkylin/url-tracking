from flask import Flask, request, jsonify, render_template, g
from flask_cors import CORS
import requests, os, sqlite3, time, json

app = Flask(__name__)
CORS(app, resources={r"/v1/service/*": {"origins": "*"}})
DATABASE = 'center.sqlite'
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')

'''数据库链接部分'''


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
    g.db.execute(sql, (name, service, description, time.time(), address))
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


'''网络接口部分'''


@app.route('/')
def index():
    return render_template("index.html")


'''Center端'''


@app.route('/v1/center/heartbeat', methods=['POST'])
def heartbeat():
    status = True
    message = ''
    try:
        address = request.get_json()['address']
        name = request.get_json()['name']
        service = request.get_json()['service']
    except:
        status = False
        message = '缺少必要的请求参数'
    else:
        ip = request.remote_addr
        try:
            sql = 'SELECT * FROM server WHERE address=?'
            server = query_db(sql, [address], one=True)
        except:
            status = False
            message = '数据库更新失败'
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
                    message = '成功'
                except:
                    status = False
                    message = '数据库添加失败'
            else:
                try:
                    description = request.get_json()['description']
                except:
                    description = server['description']
                try:
                    update_server(address, name, service, description)
                    message = '成功'
                except:
                    status = False
                    message = '数据库更新失败'
    return jsonify({'status': status, 'message': message})


@app.route('/v1/center/serversInfo', methods=['GET'])
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
        message = '成功'
    except:
        status = False
        message = '数据库错误'
    data = {'serversInfo': serversInfo, 'trackingUrl': trackingUrl}
    return jsonify({'status': status, 'data': data, 'message': message})


'''Service端'''


@app.route('/v1/service/trackingUrl', methods=['POST'])
def tracking_url():
    status = True
    message = ''
    data = []
    try:
        url = request.get_json()['url']
        ua = request.get_json()['ua']
    except:
        status = False
        message = '缺少必要的请求参数'
    else:
        session = requests.session()
        session.headers.update(
            {'User-Agent': ua})
        while status:
            try:
                r = session.get(url, allow_redirects=False)
                code = r.status_code
                if code == 302 or code == 301:
                    data.append({'url': r.headers['Location'], 'whois': ''})
                    url = r.headers['Location']
                else:
                    break
            except Exception as e:
                if len(data) == 0:
                    status = False
                    message = str(e)
                break
    return jsonify({'status': status, 'message': message, 'data': data})


if __name__ == '__main__':
    app.run()
