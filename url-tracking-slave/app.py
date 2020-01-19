from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
import requests, json

app = Flask(__name__)
CORS(app, resources={r"/v1/slave/*": {"origins": "*"}})

'''Send Online Information '''


def heartbeat(address, name, service, description='A Slave Service'):
    service = json.dumps(service)
    body = {
        "address": address,
        "name": name,
        "service": service,
        "description": description
    }
    try:
        r = requests.post('http://39.108.110.17:8080/v1/master/heartbeat', json=body)
        print(r.json())
        return True
    except Exception as e:
        print(e)
        return False


'''Static Files'''


@app.route('/')
def index():
    return redirect('http://39.108.110.17:8080/', code=302)


'''Slave-side'''


@app.route('/v1/slave/trackingUrl', methods=['POST'])
def tracking_url():
    status = True
    message = ''
    data = []
    try:
        url = request.get_json()['url']
        ua = request.get_json()['ua']
    except:
        status = False
        message = 'Missing required request parameters'
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
    heartbeat('39.108.110.17:8080', '阿里云-深圳', ['trackingUrl'])
    app.run(port=5001,debug=True)
