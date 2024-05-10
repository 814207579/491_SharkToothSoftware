from django.shortcuts import render, redirect
from .forms import RestaurantForm, FoodItemForm
from django.http import HttpResponse, JsonResponse
import random
from .models import Person, FoodItem, Order, OrderItem

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

def process_order(request):
    if request.method == "POST":
        data = json.loads(request.body)
        # Process order data
        name = data.get('name')
        email = data.get('email')
        # ... (get other customer information and cart items)

        # Create Order object
        order = Order.objects.create(name=name, email=email,  # ... add other fields
                                     total_price=data.get('totalPrice'))

        # Create OrderItem objects
        for item in data.get('items'):
            OrderItem.objects.create(order=order,
                                     food_name=item.get('name'),
                                     food_price=item.get('price'),
                                     quantity=item.get('quantity'))

        # Handle payment processing (if applicable)
        # ...

        return JsonResponse({"message": "Order placed successfully!"})
    else:
        return JsonResponse({"error": "Invalid request method."}, status=400)

