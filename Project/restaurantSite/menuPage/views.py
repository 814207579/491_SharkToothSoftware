from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Order, Table, Restaurant, Person, FoodItem
from .forms import RestaurantForm, FoodItemForm
from django.http import HttpResponse
import random
import json

def getPerson():
    person = Person.objects.all()
    return person

def getFoodItems():
    foodItems = FoodItem.objects.all()
    return foodItems

# Create your views here.
def index(request):
    print(request.path)
    #return HttpResponse("<head><title>" + HttpRequest.path[1:-1] + "</title></head><body><h1>test</h1></body>")
    #always include the header
    myArr = ["One", "Two", "Three"]
    foodArr = getFoodItems()
    imageResolution = [random.random()*800, random.random()*800]
    return render(request, "index.html", {"array": myArr, "imageSizes": imageResolution, "foodItems": foodArr})

def create_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            table_id = data.get('table_id')
            restaurant_id = data.get('restaurant_id')

            # Create and save the order
            table = Table.objects.get(id=table_id)
            restaurant = Restaurant.objects.get(id=restaurant_id)

            order = Order.objects.create(
                table=table,
                restaurant=restaurant
            )

            # Return success response with order details
            return JsonResponse({
                'success': True,
                'message': 'Order created successfully',
                'order_id': str(order._id),
                'order_status': order.order_status,
                'order_date': order.order_date
            })

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=400)
    return JsonResponse({'success': False, 'message': 'Invalid request'}, status=400)

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