#!/bin/sh

python3 -m virtualenv .env --python 3.10 && source ./.env/bin/activate && pip install -r requirements.txt
