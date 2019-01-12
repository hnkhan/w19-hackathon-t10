import re
import tweepy
from textblob import TextBlob 

#Get API keys from text file
#Source: https://stackoverflow.com/questions/42568084/read-value-from-config-file-python
keysfile = open('keys.txt', "r")
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

twitter_name = input("Type users Twitter name: ")
user = api.get_user(twitter_name)
twitter_id = user.id
tweets = api.user_timeline(id = twitter_id, count = 1)

count = 1
for status in tweets:
    clean_text = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t]) |(\w+:\/\/\S+)", " ", status.text).split())  
    sentiment_analysis = TextBlob(clean_text) 
    print("\nTweet text " + str(count) + ":", clean_text)
    print("Sentiment analysis value" + str(count) + ":", sentiment_analysis.sentiment.polarity)
    count+=1
