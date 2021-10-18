from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# full room with details


class RoomView(generics.ListAPIView):
    # get all rooms
    queryset = Room.objects.all()
    # serialize the room
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"
    # get a room

    def get(self, request, format=None):
        # get a room code
        code = request.GET.get(self.lookup_url_kwarg)
        # check if we got any code
        if code != None:
            # get a room based on code
            room = Room.objects.filter(code=code)
            # check if room exists
            if room.exists():
                # get a room data
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host

                return Response(data, status=status.HTTP_200_OK)

            return Response({"Room not found": "Invalid Room Code"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"Bad Request": "Code parameter not found in request"}, status=status.HTTP_400_BAD_REQUEST)


# join a room
class JoinRoom(APIView):
    lookup_url_kwarg = "code"
    # post user input room code

    def post(self, request, format=None):
        # check if session exists and create it
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # get code data
        code = request.data.get(self.lookup_url_kwarg)
        # check if code exists
        if code != None:
            # get a room based on input code
            room_result = Room.objects.filter(code=code)
            # check if room with that code exists
            if room_result.exists():
                # room = room_result[0]
                # store a code in a session
                self.request.session["room_code"] = code
                return Response({"message": "Room Joined"}, status=status.HTTP_200_OK)

            return Response({"Bad Request": "Invalid Room Code"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"Bad Request": "Invalid post data, did not find a codekey"}, status=status.HTTP_400_BAD_REQUEST)


# update or create a new room
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        # check if room exists in session or create new room if one doesnt exist in session
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # get gata from created room
        serializer = self.serializer_class(data=request.data)
        # check if serialize is valid
        if serializer.is_valid():
            # save variables
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            # setting host to their uniquie session key to identify if they already have a room set up
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)

            # updating a created room if host already has one
            if queryset.exists():
                # get the room
                room = queryset[0]
                # update variables
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code

                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

            # creating a room if host doesn't have one
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session["room_code"] = room.code

                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoom(APIView):
    def get(self, request, format=None):
        # check if session exists and create it
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            "code": self.request.session.get("room_code")
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({"Message": "Success"}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        # check if session exists or create one
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            code = serializer.data.get("code")

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():

                return Response({"msg": "Room doesnt exist"}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:

                return Response({"msg": "Only host can update a room"}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=["guest_can_pause", "votes_to_skip"])

            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        return Response({"Bad request": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
