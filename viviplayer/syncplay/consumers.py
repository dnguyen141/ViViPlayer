import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PlayerConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'player_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        action = text_data_json['action']
        time = text_data_json['time']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_message',
                'action': action,
                'time': time
            }
        )

    async def player_message(self, event):
        action = event['action']
        time = event['time']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'time': time
        }))