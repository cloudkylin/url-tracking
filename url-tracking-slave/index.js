const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");
const puppeteer = require('puppeteer');

// Set Express
const app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// Set Express CORS
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

// heartbeat Function
const heartbeat = (address, name, service, description = 'A Slave Service') => {
    service = JSON.stringify(service)
    const body = {
        address: address,
        name: name,
        service: service,
        description: description,
        version: 'v2'
    };
    axios.post('http://39.108.110.17:8080/v1/master/heartbeat', body, {
        headers: {'Content-Type': 'application/json'}
    }).then(() => {
        console.info('Signed up success!')
        return true
    }).catch(e => {
        console.error('Signed up error!')
        console.error(e)
        return false
    })
}

// URL-Tracking Function
const urlCheck = /^(https?:)?(\/\/)?[-A-Za-z0-9+&@#%?=~_|!:,;]+\.[-A-Za-z0-9+&@#%?=~_|!:,;]+[-A-Za-z0-9+&@#/%=~_|.]*/i;
const urlTracking = async (cb, url, req, response) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const result = [];
    page.on('response', res => {
        if (res._request._resourceType === 'document') {
            result.push({
                url: res._url,
                code: res._status,
                whois: ''
            })
        }
    })
    await page.goto(url);
    // await page.screenshot({path: 'example.png'});

    if (cb) {
        response.status = true;
        response.data = result;
        cb.send(response)
    }
    await browser.close();
}

app.get('/', (req, res) => res.location('http://39.108.110.17:8080'));
app.post('/v2/slave/trackingUrl', (req, res) => {
    const response = {
        status: false,
        message: '',
        data: []
    };
    if (req.body.url && urlCheck.test(req.body.url)) {
        let url = req.body.url;
        let patt = /^https?:\/\//;
        if (!patt.test(url)) {
            if (url.slice(0, 2) === '//')
                url = 'http' + url;
            else url = 'http://' + url;
        }
        urlTracking(res, url, req.body, response)
    } else {
        response.message = 'URL错误';
        res.send(response)
    }
})

app.listen(3000, () => {
    heartbeat('39.108.110.17:8080', '阿里云-深圳', ['trackingUrl'])
    console.log('Service run on port 3000!')
})