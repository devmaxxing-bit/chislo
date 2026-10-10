from django.db import models


class GameResult(models.Model):
    class Outcome(models.TextChoices):
        WIN = 'win', 'Win'
        LOSE = 'lose', 'Lose'

    player_name = models.CharField(max_length=80)
    attempts = models.PositiveSmallIntegerField()
    result = models.CharField(max_length=4, choices=Outcome.choices)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'{self.player_name}: {self.result} in {self.attempts} attempts'
