from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import requests, os

app = Flask(__name__)
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'templates')
CORS(app, resources={r"/v1/*": {"origins": "*"}})


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/img/icons/<icon_name>')
def base_icon(icon_name):
    tmp_path = os.path.join(root, 'img')
    return app.send_static_file(icon_name)


@app.route('/v1/trackingUrl', methods=['POST'])
def tracking_url():
    data = []
    status = True
    message = ''
    try:
        url = request.get_json()['url']
    except:
        status = False
        message = '缺少必要的请求参数'
    session = requests.session()
    session.headers.update(
        {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0'})
    while status:
        try:
            r = session.get(url, allow_redirects=False)
            code = r.status_code
            if code == 302 or code == 301:
                data.append({'url': r.headers['Location'], 'whois': '暂不支持'})
                url = r.headers['Location']
            else:
                break
        except Exception as e:
            if len(data) == 0:
                status = False
                message = str(e)
            break
    return jsonify({'status': status, 'data': data, 'message': message})


if __name__ == '__main__':
    app.run()
