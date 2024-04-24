from django.contrib import admin

# Register models here.
from .models import Restaurant, FoodItem
admin.site.register([Restaurant, FoodItem])