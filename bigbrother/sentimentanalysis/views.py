from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def home(request):
    return render(request, 'sentimentanalysis/input.html')

def form(request):
    return HttpResponse("test")


