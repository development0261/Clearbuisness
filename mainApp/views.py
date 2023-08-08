from django.shortcuts import render
import requests
import json
from django.http import JsonResponse


# Create your views here.
def index(request):
    return render(request,'home.html')

def get_data(request):
    if request.method == 'GET':
        sku = request.GET.get('filter')
        srcs = request.GET.get('sources')
        offset = request.GET.get('offset')
        limit = request.GET.get('limit') 
        
        data = requests.get(f'https://lepton.appspot.com/skus?format=skuPage&currency={srcs}&filter={sku}&offset={offset}&limit={limit}')

        response_content = data.content.decode('utf-8')

        # Remove the initial characters (`)]}'`)
        json_data = response_content.replace(")]}'", '')

        # Parse the JSON data into a Python dictionary
        response_dict = json.loads(json_data)
        if len(response_dict) > 0:
            res = response_dict
        else:
            res = {
                'status': 'error'
            }
        return JsonResponse(res, safe=False)
    else:
        return render(request,'home.html')
