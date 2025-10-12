import urllib.request
import json

data = json.dumps({'crop': 'InvalidCrop', 'location': 'Bangalore', 'quantity': 1}).encode('utf-8')
req = urllib.request.Request('http://localhost:5000/api/pricing/predict', data=data, headers={'Content-Type': 'application/json'})
try:
    resp = urllib.request.urlopen(req)
    print(resp.read().decode('utf-8'))
except Exception as e:
    print(e)
