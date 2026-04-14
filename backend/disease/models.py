from django.db import models
from django.conf import settings

class Disease(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    disease_name = models.CharField(max_length=200)
    affected_crops = models.CharField(max_length=200)
    remedy_english = models.TextField()
    remedy_tamil = models.TextField()
    severity_level = models.CharField(max_length=10, choices=SEVERITY_CHOICES)

    def __str__(self):
        return self.disease_name

class Scan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image_url = models.URLField(max_length=500)
    disease_name = models.CharField(max_length=200)
    confidence_score = models.FloatField(default=0.0)
    remedy_english = models.TextField(blank=True)
    remedy_tamil = models.TextField(blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.disease_name}"