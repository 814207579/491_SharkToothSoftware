from django.shortcuts import render, redirect
from .forms import RestaurantForm
from django.http import HttpResponse

# Create your views here.
def index(request):
    print(request.path)
    #return HttpResponse("<head><title>" + HttpRequest.path[1:-1] + "</title></head><body><h1>test</h1></body>")
    #always include the header
    myArr = ["One", "Two", "Three"]
    baseUrl = "../../";
    return render(request, "index.html", {"array": myArr, "baseUrl": baseUrl})

def restaurant_data_view(request):
    if request.method == 'POST':
        form = RestaurantForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('success')
    else:
        form = RestaurantForm()
    return render(request, 'create_restaurant.html', {'form': form})

def success(request):
    return render(request, 'success.html')