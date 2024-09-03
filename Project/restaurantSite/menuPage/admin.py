from django.contrib import admin
# Register your models here.
from django.contrib import admin
from .models import Person, Restaurant, FoodItem, MenuPageAdministration
class PersonAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'age', 'email']

class FoodItemAdmin(admin.ModelAdmin):
    list_display = ["_id", "name", "food_type", "food_description", "food_price", "food_thumbnail"]

class MenuPageAdministrationAdmin(admin.ModelAdmin):
    list_display = ["_id", "color"]

admin.site.register(Person, PersonAdmin)
admin.site.register(FoodItem, FoodItemAdmin)
admin.site.register([Restaurant])
admin.site.register(MenuPageAdministration, MenuPageAdministrationAdmin)