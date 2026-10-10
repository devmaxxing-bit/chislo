from rest_framework import serializers

from .models import GameResult


class GameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = ['id', 'player_name', 'attempts', 'result']
        read_only_fields = ['id']

    def validate_player_name(self, value):
        player_name = value.strip()
        if not player_name:
            raise serializers.ValidationError('Имя игрока не может быть пустым.')
        return player_name

    def validate_attempts(self, value):
        if not 1 <= value <= 10:
            raise serializers.ValidationError('Количество попыток должно быть от 1 до 10.')
        return value
