#!/usr/bin/env bash

chmod -R 755 static/*
pip install -r requirements.txt
mv master.sqlite db.sqlite
