import re
import tweepy
from textblob import TextBlob
import os
import json

def getSentiments(username):
    #Get API keys from text file
    #Source: https://stackoverflow.com/questions/42568084/read-value-from-config-file-python
    here = os.path.dirname(os.path.abspath(__file__))
    keysfile = open(os.path.join(here, 'keys.txt'), "r")
    read = keysfile.read()

    for line in read.splitlines():
        if "consumer_key=" in line:
            consumer_key = line.split('=',1)[1]
        if "consumer_secret=" in line:
            consumer_secret = line.split('=',1)[1]
        if "access_token=" in line:
            access_token = line.split('=',1)[1]
        if "access_token_secret" in line:
            access_token_secret = line.split('=',1)[1]

    #Get Tweets and perform sentiment analysis
    #Source: https://www.geeksforgeeks.org/twitter-sentiment-analysis-using-python/
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)

    twitter_name = username
    user = api.get_user(twitter_name)
    twitter_id = user.id
    tweets = api.user_timeline(id = twitter_id, count = 10)

    count = 1
    sentiments = {"Positive": 0, "Negative": 0, "Neutral": 0}
    for status in tweets:
        clean_text = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t]) |(\w+:\/\/\S+)", " ", status.text).split())
        sentiment_analysis = TextBlob(clean_text)
        if (sentiment_analysis.sentiment.polarity < 0):
            sentiments["Negative"] += 1
        elif (sentiment_analysis.sentiment.polarity > 0):
            sentiments["Positive"] += 1
        else:
            sentiments["Neutral"] += 1
        # print("\nTweet text " + str(count) + ":", clean_text)
        # print("Sentiment analysis value" + str(count) + ":", sentiment_analysis.sentiment.polarity)
        # count+=1

    return json.dumps(sentiments)
