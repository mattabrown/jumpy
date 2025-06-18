def rand_sign():
    return randint(0, 1) * 2 - 1
def hero_dies():
    global time_of_death
    animation.run_image_animation(mySprite,
        assets.animation("""
            explode
            """),
        100,
        False)
    time_of_death = game.runtime()

def on_on_overlap(sprite, otherSprite):
    global is_dying
    if is_dying == 0:
        music.play(music.melody_playable(music.big_crash),
            music.PlaybackMode.UNTIL_DONE)
        is_dying = 1
        hero_dies()
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, on_on_overlap)

projectile: Sprite = None
time_of_death = 0
b: Sprite = None
mySprite: Sprite = None
is_dying = 0
gravity = 500
x_speed = 1.5
jump_speed = -225
is_dying = 0
mySprite = sprites.create(assets.image("""
    hero
    """), SpriteKind.player)
mySprite.set_position(16, 100)
mySprite.ay = gravity
scene.camera_follow_sprite(mySprite)
tiles.set_current_tilemap(tilemap("""
    level1
    """))
projectile_speed = 500
projectile_vx = projectile_speed
baddy_speed = 10
baddy_list: List[Sprite] = []
for index in range(20):
    b = sprites.create(img("""
            . . . . 2 2 2 2 2 e . . . . . .
            . . . 2 2 2 2 d 2 2 e . . . . .
            . . e 2 2 2 2 2 2 2 e . . . . .
            . . e 2 2 2 2 2 2 2 e . . . . .
            . . e 2 2 2 2 2 e f f c c . . .
            . . e e 2 2 e f f f f b c . . .
            . e e e f e 2 b f f f d c . . .
            e e 2 2 d f 2 1 1 1 1 b c . . .
            e e 2 2 d f e e c c c . . . . .
            b 1 1 d e 2 2 e e c . . . . . .
            . f f e 2 2 2 2 e . . . . . . .
            . . f f d d 2 2 f f d d . . . .
            . . f f d d e e f f d d . . . .
            . . . f f f f . . . . . . . . .
            . . e e e f f f . . . . . . . .
            . . e e e e f f f . . . . . . .
            """),
        SpriteKind.enemy)
    b.set_position(randint(48, 800), 16)
    b.vx = rand_sign() * baddy_speed
    baddy_list.unshift(b)

def on_on_update():
    global projectile_vx, projectile
    if is_dying == 0:
        if controller.up.is_pressed():
            if mySprite.is_hitting_tile(CollisionDirection.BOTTOM):
                mySprite.vy = jump_speed
        if controller.right.is_pressed():
            mySprite.x += x_speed
            projectile_vx = projectile_speed
        if controller.left.is_pressed():
            mySprite.x += -1 * x_speed
            projectile_vx = -1 * projectile_speed
        if controller.A.is_pressed():
            projectile = sprites.create_projectile_from_sprite(img("""
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . 4 4 . . . . . . .
                    . . . . . . 4 5 5 4 . . . . . .
                    . . . . . . 2 5 5 2 . . . . . .
                    . . . . . . . 2 2 . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    . . . . . . . . . . . . . . . .
                    """),
                mySprite,
                projectile_vx,
                0)
game.on_update(on_on_update)

def on_on_update2():
    if is_dying == 1 and game.runtime() - time_of_death > 750:
        game.reset()
game.on_update(on_on_update2)

def on_on_update3():
    for c in baddy_list:
        if c.is_hitting_tile(CollisionDirection.LEFT):
            c.vx = baddy_speed
        if c.is_hitting_tile(CollisionDirection.RIGHT):
            c.vx = -1 * baddy_speed
        if not (tiles.tile_at_location_is_wall(tiles.get_tile_location((c.x + 8) / 16, c.y / 16 + 1))):
            c.vx = -1 * baddy_speed
        if not (tiles.tile_at_location_is_wall(tiles.get_tile_location((c.x + -8) / 16, c.y / 16 + 1))):
            c.vx = baddy_speed
        c.vy += 5
game.on_update(on_on_update3)
