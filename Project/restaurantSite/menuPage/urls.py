from django.http import request
from django.urls import path, include
from . import views

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('create_restaurant', views.restaurant_data_view, name="create_restaurant"),
    path('create_fooditem', views.fooditem_data_view, name="create_fooditem"),
    path('create_order', views.create_order, name="create_order"),
    path('success', views.success, name='success'),
]