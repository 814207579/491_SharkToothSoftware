from django.shortcuts import render, redirect
from .forms import RestaurantForm, FoodItemForm
from django.http import HttpResponse
import random
from .models import Person

def getPerson():
    person = Person.name
    return person

# Create your views here.
def index(request):
    print(request.path)
    #return HttpResponse("<head><title>" + HttpRequest.path[1:-1] + "</title></head><body><h1>test</h1></body>")
    #always include the header
    myArr = ["One", "Two", "Three"]
    personArr = ["test1"]
    personArr.append(getPerson())
    imageResolution = [random.random()*800, random.random()*800]
    return render(request, "index.html", {"array": myArr, "imageSizes": imageResolution, "person": personArr})

def restaurant_data_view(request):
    if request.method == 'POST':
        form = RestaurantForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = RestaurantForm()
    return render(request, 'create_restaurant.html', {'form': form})

def fooditem_data_view(request):
    print("Request made!")
    if request.method == 'POST':
        form = FoodItemForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = FoodItemForm()
    return render(request, 'create_fooditem.html', {'form': form})

def success(request):
    return render(request, 'success.html')