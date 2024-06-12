import pickle
from clean import clean

with open('model.pkl', 'rb') as file:
    CV_pipe, CV, LR1 = pickle.load(file)

def evaluate(text: str):
    cleaned_text = clean(text)
    transformed_text = CV.transform([cleaned_text])
    prediction = LR1.predict(transformed_text)

    return prediction[0] == 1

def get_offensive_words(text: str):
    # Assuming your model has a method to get offensive words. This is a placeholder.
    offensive_words = []
    words = text.split()
    for word in words:
        cleaned_word = clean(word)
        transformed_word = CV.transform([cleaned_word])
        prediction = LR1.predict(transformed_word)
        if prediction[0] == 1:
            offensive_words.append(word)
    return offensive_words

import pickle
from clean import clean

with open('model.pkl', 'rb') as file:
    CV_pipe, CV, LR1 = pickle.load(file)

def evaluate(text: str):
    cleaned_text = clean(text)
    transformed_text = CV.transform([cleaned_text])
    prediction = LR1.predict(transformed_text)

    return prediction[0] == 1

def get_offensive_words(text: str):
    offensive_words = []
    words = text.split()
    for word in words:
        cleaned_word = clean(word)
        transformed_word = CV.transform([cleaned_word])
        prediction = LR1.predict(transformed_word)
        if prediction[0] == 1:
            offensive_words.append(word)
    return offensive_words

def censor_text(text: str, offensive_words: list):
    censored_text = text
    for word in offensive_words:
        if len(word) > 2:
            censored_word = word[0] + '*' * (len(word) - 2) + word[-1]
        else:
            censored_word = word
        censored_text = censored_text.replace(word, censored_word)
    return censored_text

