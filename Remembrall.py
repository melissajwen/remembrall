# Download the Python helper library from twilio.com/docs/python/install
from twilio.rest import Client

# Your Account Sid and Auth Token from twilio.com/user/account
account_sid = "ACc85366426e50b5e1274e63390bae3f0d"
auth_token = "bf8dada94af2c7078f7699e9ea6ad024"
client = Client(account_sid, auth_token)

import json
import urllib.request
sample = json.loads(urllib.request.urlopen("https://www.googleapis.com/books/v1/volumes?q=harry").read())
#print(sample)

message = client.messages.create(
    #"+14086031769",
    "+15109212536",
    body="Hi Nishir! Make sure to take your medicine or your fake ass ho self will die. Love, Remembrall",
    
    from_="+14159425019",
    #media_url="http://www.example.com/cheeseburger.png"
)
print(message.sid)

