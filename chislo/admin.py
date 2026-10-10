from django.contrib import admin

from .models import GameResult


@admin.register(GameResult)
class GameResultAdmin(admin.ModelAdmin):
    list_display = ['player_name', 'attempts', 'result']
    list_filter = ['result']
    search_fields = ['player_name']
