import json
from channels.generic.websocket import AsyncWebsocketConsumer


class AsyncPlayerConsumer(AsyncWebsocketConsumer):
    """combines all Websocket handling in backend"""
    async def connect(self):
        """is called when a client opens a new Websocket connection. The broadcast group ist implicitely createtd
        here """
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'player_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        """is called when Websocket is disconnected and cleans up broadcast group"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        """passes json messages containing an "action" field to all connected clients"""
        text_data_json = json.loads(text_data)
        action = text_data_json['action']
        if "time" in text_data_json:
            time = text_data_json['time']
        else:
            time = 0

        if "payload" in text_data_json:
            payload = text_data_json['payload']
        else:
            payload = ""

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'player_message',
                'action': action,
                'time': time,
                'payload': payload,
            }
        )

    async def player_message(self, event):
        """handles passing broadcast messages back to the individual Websocket connections"""
        action = event['action']
        time = event['time']
        payload = event['payload']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action': action,
            'time': time,
            'payload': payload
        }))
