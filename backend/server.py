import subprocess
import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import BadRequest
from nltk import sent_tokenize

BASE_DIR = "/relex/Relation-extraction-pipeline/baselines/SciERC/"

app = Flask(__name__)
CORS(app)

@app.route('/back', methods=['POST'])
def process():
    text=str(request.data.decode('utf-8'))
    sentences = sent_tokenize(text)
    base_uid = "1.0alpha4.test."
    print ("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    print (sentences)
    file = open(os.path.join(BASE_DIR, '1.0alpha4.test.txt'), 'w') 
 
    for uid, s in enumerate(sentences):
        text = base_uid + str(uid) + "\t" + s + "\n"
        file.write(text)
    file.close()

    try:
        subprocess.call('./process.sh')
        parsed_file_name = os.path.join(BASE_DIR, '1.0alpha4.test.prediction.scierc_n0.1c0.3r1.json')
        if os.path.isfile(parsed_file_name):
            with open(parsed_file_name) as f:
                data = json.load(f)
            return jsonify(data)
        else:
            raise BadRequest("Predicted Json file is missing")

    except:
        raise BadRequest()
