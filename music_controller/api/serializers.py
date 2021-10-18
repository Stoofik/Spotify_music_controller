from rest_framework import serializers
from .models import Room

# convert the room model to JSON format


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("id", "code", "host", "guest_can_pause",
                  "votes_to_skip", "created_at")


# serialiaze data from request and check validity, update room details
class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ("guest_can_pause", "votes_to_skip")


# serialiaze data from request and check validity, update room details
class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ("guest_can_pause", "votes_to_skip", "code")
