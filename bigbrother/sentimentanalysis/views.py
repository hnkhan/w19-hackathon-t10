from django.shortcuts import render
from django.http import HttpResponse
from .sentAnalysis import getSentiments

# Create your views here.

def home(request):
    return render(request, 'sentimentanalysis/input.html')

def form(request, username):
    sents = getSentiments(username)
    return HttpResponse(sents)


