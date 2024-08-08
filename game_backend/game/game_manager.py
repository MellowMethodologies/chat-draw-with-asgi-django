import math
import random

class GameManager:
    def __init__(self):
        self.planeH = 17
        self.winner = None
        self.ball_position = [0, 0.2, 0]
        self.ball_velocity = [0, 0, 0]
        self.paddle1_position = [0, 0, (self.planeH  / 2) - 0.1]
        self.paddle2_position = [0, 0, -(self.planeH  / 2) + 0.1]
        self.score = {"player1": 0, "player2": 0}
        self.win_score = 3
        self.radius = 0.2  # Ball radius
        self.max_x = 5 - self.radius
        self.max_z = (self.planeH  / 2) - self.radius
        self.paddle_depth = 0.1
        self.paddle_half_width = 1
        self.angle_sensitivity = 3
        self.min_velocity = 8
        self.max_velocity = 15
        self.last_collision_time = 0
        self.collision_cooldown = 0.1  # seconds
        pass

    def update_ball_position(self, delta_time):
        new_x = self.ball_position[0] + self.ball_velocity[0] * delta_time
        new_z = self.ball_position[2] + self.ball_velocity[2] * delta_time

        # Wall collisions
        if abs(new_x) > self.max_x:
            new_x = math.copysign(self.max_x, new_x)
            self.ball_velocity[0] = -self.ball_velocity[0]

        # Paddle collisions
        for paddle_pos in [self.paddle1_position, self.paddle2_position]:
            moving_towards_paddle = math.copysign(1, self.ball_velocity[2]) == math.copysign(1, paddle_pos[2])
            if moving_towards_paddle and \
               abs(new_z - paddle_pos[2]) < (self.paddle_depth + self.radius) and \
               abs(new_x - paddle_pos[0]) < self.paddle_half_width and \
               self.game_time - self.last_collision_time > self.collision_cooldown:
                new_z = paddle_pos[2] - math.copysign(self.paddle_depth + self.radius, paddle_pos[2])
                self.ball_velocity[2] = -self.ball_velocity[2]

                paddle_center = paddle_pos[0]
                ball_offset = new_x - paddle_center
                angle_factor = ball_offset / self.angle_sensitivity
                self.ball_velocity[0] = angle_factor * abs(self.ball_velocity[2])

                speed = math.sqrt(self.ball_velocity[0] ** 2 + self.ball_velocity[2] ** 2)
                if speed < self.min_velocity:
                    self.ball_velocity[0] = self.ball_velocity[0] / speed * self.min_velocity
                    self.ball_velocity[2] = self.ball_velocity[2] / speed * self.min_velocity
                elif speed > self.max_velocity:
                    self.ball_velocity[0] = self.ball_velocity[0] / speed * self.max_velocity
                    self.ball_velocity[2] = self.ball_velocity[2] / speed * self.max_velocity

                self.last_collision_time = self.game_time

        # End zone collisions
        if abs(new_z) > self.max_z:
            player = "player1" if new_z > self.max_z else "player2"
            winner = self.update_score(player)
            if winner:
                self.reset_ball()
            else:
                self.reset_ball()

        self.ball_position[0] = new_x
        self.ball_position[2] = new_z

    def update_game_state(self, delta_time):
        self.update_ball_position(delta_time)
        # Other game logic updates

        # Check for a winner
        if self.score["player1"] >= self.win_score:
            self.winner = "player1"
        elif self.score["player2"] >= self.win_score:
            self.winner = "player2"
        else:
            self.winner = None
        pass
              
    def handle_paddle_move(self, player, new_position):
        if player == "player1":
            self.paddle1_position = new_position
        else:
            self.paddle2_position = new_position

    def update_score(self, player):
        self.score[player] += 1
        if self.score[player] >= self.win_score:
            return player
        return None

    def reset_ball(self):
        self.ball_position = [0, 0.2, 0]
        self.ball_velocity = self.get_random_start_angle()

    def get_random_start_angle(self):
        random_quadrant = 0 if random.random() < 0.5 else math.pi
        angle = random_quadrant + math.pi / 4 + random.random() * math.pi / 2
        speed = 10
        return [speed * math.cos(angle), 0, speed * math.sin(angle)]