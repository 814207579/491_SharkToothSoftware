from django.contrib import admin
# Register your models here.
from django.contrib import admin
from .models import Person, Restaurant, FoodItem
class PersonAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'age', 'email']

admin.site.register(Person, PersonAdmin)
admin.site.register([Restaurant, FoodItem])