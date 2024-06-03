## Game Objective:

- Protect your Titan piece at all costs.
- Win by hitting the opponent's Titan with two cannon bullet.

## Game Setup:

- Each player has the following pieces:
  - 1 Titan 
  - 1 Cannon **( Hit points : **3** )**
  - 2 Ricochet
  - 2 Semi-Ricochet 
  - 1 Tank **( Hit points : **5** )**
- The initial configuration of pieces is decided by the computer and is randomized.

## Piece Movements:

- Players take turns.
- Each turn, a player can move one piece one step in any direction (like a chess king).
- Cannon can only move horizontally and must stay in the extreme rows.
- Ricochet and Semi-Ricochet pieces can be rotated, which also counts as a move.

## Piece Functions:

- **Cannon**: Shoots a bullet after each turn.
- **Ricochet**: Deflects bullets coming from any direction.
- **Semi-Ricochet**: Deflects bullets only when they hit the inclined part; bullets disappear if they hit the straight part.
- **Tank**: Stops any bullet it gets hit by.

## Game Play:

1. Players move a piece or rotate a Ricochet/Semi-Ricochet during their turn.
2. After each turn, the player’s Cannon shoots a bullet.
3. Bullets interact with pieces as follows:
   - Deflected by Ricochet/Semi-Ricochet
   - Stopped by Tank
   - Bullets hitting the opponent's Titan end the game, resulting in a loss for the hit Titan's player.

## Winning:

- The game ends when cannon bullet hits the opponent's Titan, and the player whose Titan is hit loses.

## Additional Constraints:

- Only one Titan and one Cannon per player.
- The Cannon can only move horizontally.