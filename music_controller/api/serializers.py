from django.db.models import fields
from rest_framework import serializers
from .models import Room

#convert the room model to JSON format
class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("id", "code", "host", "guest_can_pause", 
                    "votes_to_skip", "created_at")