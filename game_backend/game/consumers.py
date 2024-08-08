from .game_manager import GameManager
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_manager = GameManager()
        self.game_group_name = "game"
        self.connected_players = []

        # Add the new player to the list of connected players
        self.connected_players.append(self.channel_name)
        for player in self.connected_players:
            print(f"Player {player} connected")
        # Start the game if there are two players connected
        await self.accept()
        if len(self.connected_players) == 2:
            print("--------\n Starting the game \n--------")
            await self.channel_layer.group_add(self.game_group_name, self.channel_name)
            await self.start_game()
        else:
            await self.close()

    async def disconnect(self, close_code):
        # Remove the disconnected player from the list of connected players
        self.connected_players.remove(self.channel_name)

        # If there's only one player left, close the WebSocket connections
        if len(self.connected_players) == 1:
            await self.channel_layer.group_discard(self.game_group_name, self.channel_name)
            await self.close()

    async def start_game(self):
        # Start the game loop
        while True:
            await asyncio.sleep(0.01)  # Delay to control the game loop rate
            self.game_manager.update_game_state(0.01)  # Update the game state
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "game_update",
                    "ball_position": self.game_manager.ball_position,
                    "paddle1_position": self.game_manager.paddle1_position,
                    "paddle2_position": self.game_manager.paddle2_position,
                    "score": self.game_manager.score,
                    "winner": self.game_manager.winner,
                }
            )
            if self.game_manager.winner is not None:
                break

    # Other methods remain the same

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json["type"]

        if message_type == "paddle_move":
            paddle_pos = text_data_json["paddlePos"]
            player = text_data_json["player"]
            self.game_manager.handle_paddle_move(player, paddle_pos)
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "paddle_move",
                    "paddlePos": paddle_pos,
                    "player": player,
                },
            )
        elif message_type == "ball_move":
            delta_time = text_data_json["deltaTime"]
            self.game_manager.update_ball_position(delta_time)
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "ball_move",
                    "ballPos": self.game_manager.ball_position,
                },
            )
        elif message_type == "score_update":
            winner = self.game_manager.update_score(text_data_json["player"])
            if winner:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        "type": "score_update",
                        "score": self.game_manager.score,
                        "winner": winner,
                    },
                )
            else:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        "type": "score_update",
                        "score": self.game_manager.score,
                    },
                )

    async def paddle_move(self, event):
        paddle_pos = event["paddlePos"]
        player = event["player"]
        await self.send(
            text_data=json.dumps(
                {"type": "paddle_move", "paddlePos": paddle_pos, "player": player}
            )
        )

    async def ball_move(self, event):
        ball_pos = event["ballPos"]
        await self.send(
            text_data=json.dumps({"type": "ball_move", "ballPos": ball_pos})
        )

    async def score_update(self, event):
        score = event["score"]
        winner = event.get("winner", None)
        await self.send(
            text_data=json.dumps(
                {"type": "score_update", "score": score, "winner": winner}
            )
        )