from django.db import models
from django.conf import settings

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    )

    patient_name = models.CharField(max_length=200)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    category = models.CharField(max_length=50, default='Check-up')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_appointments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient_name} - {self.appointment_date} {self.appointment_time} ({self.status})"
