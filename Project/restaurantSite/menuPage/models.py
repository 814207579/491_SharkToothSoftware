from django.db import models

# Create your models here.
from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.TextField()

class FoodItem(models.Model):
    food_type = models.CharField(max_length=100)
    food_name = models.CharField(max_length=100)
    food_description = models.TextField(blank=True, null=True)
    food_price = models.DecimalField(max_digits=10, decimal_places=2)

class Order(models.Model):
    order_date = models.DateTimeField(auto_now_add=True)
    order_status = models.BooleanField(default=False)

class OrderItem(models.Model):
    food_id = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)
    order_status = models.BooleanField(default=False)

class Table(models.Model):
    table_number = models.IntegerField(unique=True)
    table_status = models.BooleanField(default=False)

class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    menu_items = models.ManyToManyField(FoodItem, related_name='restaurants')
    tables = models.ManyToManyField(Table, related_name='restaurants')