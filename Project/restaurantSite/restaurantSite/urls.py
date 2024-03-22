from django.contrib import admin
from django.urls import include, path
from django.views.generic.base import RedirectView

urlpatterns = [
    path("menuPage/" or "menupage/", include("menuPage.urls")),
    path("", RedirectView.as_view(url='menuPage/', permanent=False)),
    path("admin/", admin.site.urls),
]