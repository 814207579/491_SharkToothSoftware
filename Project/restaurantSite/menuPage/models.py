from django.db import models

# Create your models here.
from djongo import models

class Person(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    email = models.TextField()

class FoodItem(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    food_type = models.CharField(max_length=100)
    food_description = models.TextField(blank=True, null=True)
    food_price = models.DecimalField(max_digits=10, decimal_places=2)
    food_thumbnail = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Table(models.Model):
    _id = models.ObjectIdField()
    table_number = models.IntegerField(unique=True)
    table_status = models.BooleanField(default=False)

class Order(models.Model):
    _id = models.ObjectIdField()
    order_date = models.DateTimeField(auto_now_add=True)
    order_status = models.BooleanField(default=False)
    table = models.ForeignKey(Table, on_delete=models.CASCADE, related_name='orders')

class OrderItem(models.Model):
    _id = models.ObjectIdField()
    food_id = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)
    # order_status = models.BooleanField(default=False)

class Restaurant(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    food_items = models.ManyToManyField(FoodItem)
    tables = models.ManyToManyField(Table)