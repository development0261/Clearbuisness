from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='home'),
    path('get_data', get_data, name='get_data'),
]
