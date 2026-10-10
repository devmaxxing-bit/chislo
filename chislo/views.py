from rest_framework import generics

from .models import GameResult
from .serializers import GameResultSerializer


class GameResultList(generics.ListCreateAPIView):
    queryset = GameResult.objects.all()
    serializer_class = GameResultSerializer
