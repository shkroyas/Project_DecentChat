from flask import Flask, request, jsonify
from flask_cors import CORS
import evaluate

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/evaluate_text', methods=['POST'])
def evaluate_text():
    text = request.get_json()['text']
    is_offensive = evaluate.evaluate(text)
    is_offensive = bool(is_offensive)
    
    if is_offensive:
        offensive_words = evaluate.get_offensive_words(text)
        censored_text = evaluate.censor_text(text, offensive_words)
    else:
        censored_text = text
    
    
    return jsonify({'offensive': is_offensive, 'censored_text': censored_text})

if __name__ == '__main__':
    app.run(debug=True)
