from django.contrib import admin

from .models import Person, Restaurant, FoodItem
admin.site.register([Person, Restaurant, FoodItem])