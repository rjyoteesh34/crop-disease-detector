from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_scan, name='upload_scan'),
    path('history/', views.scan_history, name='scan_history'),
    path('diseases/', views.disease_list, name='disease_list'),
]