from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# full room with details


class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


# update or create a new room
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # create new room if one doesnt exist in session
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # get gata from created room
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            # getting variables
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            # setting host to their uniquie session key to identify if they already have a room set up
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            # updating a created room if host already has one
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            # creating a room if host doesn't have one
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
