from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsDoctor
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer

    def get_permissions(self):
        if self.action == 'create':
            # Anyone authenticated (including patients) can book an appointment
            return [IsAuthenticated()]
        # Only doctors can view, update, or delete appointments
        return [IsAuthenticated(), IsDoctor()]

    def get_queryset(self):
        # Return only the appointments belonging to the logged-in doctor
        user = self.request.user
        if user.is_authenticated and getattr(user, 'role', '') == 'doctor':
            queryset = Appointment.objects.filter(doctor=user).order_by('-appointment_date', '-appointment_time')
            
            # Handle query parameters for filtering
            status = self.request.query_params.get('status', None)
            date = self.request.query_params.get('date', None)
            
            if status:
                queryset = queryset.filter(status__iexact=status)
            if date:
                queryset = queryset.filter(appointment_date=date)
                
            return queryset
        return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        # Construct the patient name from the logged in user
        patient_name = f"{user.first_name} {user.last_name}".strip()
        if not patient_name:
            patient_name = user.email.split('@')[0]
        
        # Force status to Pending when creating a new appointment
        serializer.save(patient_name=patient_name, status='Pending')
