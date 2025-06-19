namespace SpriteKind {
    export const powerup_kind = SpriteKind.create()
}
function rand_sign () {
    return randint(0, 1) * 2 - 1
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.powerup_kind, function (sprite, otherSprite) {
    sprites.setDataString(sprite, "powerup", sprites.readDataString(otherSprite, "type"))
    sprites.destroy(otherSprite, effects.bubbles, 500)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    game.showLongText("You got a cannon! Press A to fire", DialogLayout.Bottom)
    for (let index = 0; index < 4; index++) {
        timer.after(150, function () {
            projectile = sprites.createProjectileFromSprite(img`
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
                `, mySprite, projectile_vx, 0)
        })
    }
})
function hero_dies () {
    animation.runImageAnimation(
    mySprite,
    assets.animation`explode`,
    100,
    false
    )
    timer.after(750, function () {
        game.reset()
    })
}
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function (sprite, otherSprite) {
    sprites.destroy(otherSprite, effects.confetti, 200)
    sprites.destroy(sprite)
    music.play(music.createSoundEffect(WaveShape.Sine, 515, 436, 230, 41, 297, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (sprite.y < otherSprite.y - 8) {
        sprites.destroy(otherSprite, effects.confetti, 200)
        music.play(music.createSoundEffect(WaveShape.Sine, 515, 436, 230, 41, 297, SoundExpressionEffect.None, InterpolationCurve.Linear), music.PlaybackMode.InBackground)
        mySprite.vy = 0.5 * jump_speed
    } else {
        if (is_dying == 0) {
            music.play(music.melodyPlayable(music.bigCrash), music.PlaybackMode.UntilDone)
            is_dying = 1
            hero_dies()
            scene.cameraShake(4, 300)
        }
    }
})
let last_moved = 0
let projectile: Sprite = null
let baddy_list: Sprite[] = []
let b1: Sprite = null
let projectile_vx = 0
let mySprite: Sprite = null
let is_dying = 0
let jump_speed = 0
let gravity = 500
let x_speed = 1.5
jump_speed = -200
is_dying = 0
mySprite = sprites.create(assets.image`hero`, SpriteKind.Player)
mySprite.setPosition(16, 100)
mySprite.ay = gravity
sprites.setDataString(mySprite, "powerup", "none")
scene.cameraFollowSprite(mySprite)
tiles.setCurrentTilemap(tilemap`level1`)
let projectile_speed = 500
projectile_vx = projectile_speed
let baddy_speed = 20
let b_count = 0
for (let index = 0; index < 16; index++) {
    b1 = sprites.create(img`
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
        `, SpriteKind.Enemy)
    b1.setPosition(randint(48, 900), randint(0, 200))
    b1.vx = rand_sign() * baddy_speed
    sprites.setDataString(b1, "id", convertToText(b_count))
    b_count += 1
    baddy_list.unshift(b1)
}
let powerup = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . 4 4 4 4 . . . . . . 
    . . . . 4 4 4 5 5 4 4 4 . . . . 
    . . . 3 3 3 3 4 4 4 4 4 4 . . . 
    . . 4 3 3 3 3 2 2 2 1 1 4 4 . . 
    . . 3 3 3 3 3 2 2 2 1 1 5 4 . . 
    . 4 3 3 3 3 2 2 2 2 2 5 5 4 4 . 
    . 4 3 3 3 2 2 2 4 4 4 4 5 4 4 . 
    . 4 4 3 3 2 2 4 4 4 4 4 4 4 4 . 
    . 4 2 3 3 2 2 4 4 4 4 4 4 4 4 . 
    . . 4 2 3 3 2 4 4 4 4 4 2 4 . . 
    . . 4 2 2 3 2 2 4 4 4 2 4 4 . . 
    . . . 4 2 2 2 2 2 2 2 2 4 . . . 
    . . . . 4 4 2 2 2 2 4 4 . . . . 
    . . . . . . 4 4 4 4 . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.powerup_kind)
powerup.setPosition(624, 216)
sprites.setDataString(powerup, "type", "cannon")
game.onUpdate(function () {
    if (is_dying == 0) {
        if (controller.up.isPressed()) {
            if (mySprite.isHittingTile(CollisionDirection.Bottom)) {
                mySprite.vy = jump_speed
                last_moved = game.runtime()
                music.play(music.createSoundEffect(WaveShape.Sine, 375, 2351, 161, 127, 100, SoundExpressionEffect.None, InterpolationCurve.Logarithmic), music.PlaybackMode.InBackground)
            }
        }
        if (controller.right.isPressed()) {
            mySprite.x += x_speed
            projectile_vx = projectile_speed
            last_moved = game.runtime()
            timer.throttle("walk_right", 400, function () {
                animation.runImageAnimation(
                mySprite,
                [img`
                    . . . . . . f f f f f f . . . . 
                    . . . . f f e e e e f 2 f . . . 
                    . . . f f e e e e f 2 2 2 f . . 
                    . . . f e e e f f e e e e f . . 
                    . . . f f f f e e 2 2 2 2 e f . 
                    . . . f e 2 2 2 f f f f e 2 f . 
                    . . f f f f f f f e e e f f f . 
                    . . f f e 4 4 e b f 4 4 e e f . 
                    . . f e e 4 d 4 1 f d d e f . . 
                    . . . f e e e 4 d d d d f . . . 
                    . . . . f f e e 4 4 4 e f . . . 
                    . . . . . 4 d d e 2 2 2 f . . . 
                    . . . . . e d d e 2 2 2 f . . . 
                    . . . . . f e e f 4 5 5 f . . . 
                    . . . . . . f f f f f f . . . . 
                    . . . . . . . f f f . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . f f f f f f . . . . 
                    . . . . f f e e e e f 2 f . . . 
                    . . . f f e e e e f 2 2 2 f . . 
                    . . . f e e e f f e e e e f . . 
                    . . . f f f f e e 2 2 2 2 e f . 
                    . . . f e 2 2 2 f f f f e 2 f . 
                    . . f f f f f f f e e e f f f . 
                    . . f f e 4 4 e b f 4 4 e e f . 
                    . . f e e 4 d 4 1 f d d e f . . 
                    . . . f e e e e e d d d f . . . 
                    . . . . . f 4 d d e 4 e f . . . 
                    . . . . . f e d d e 2 2 f . . . 
                    . . . . f f f e e f 5 5 f f . . 
                    . . . . f f f f f f f f f f . . 
                    . . . . . f f . . . f f f . . . 
                    `,img`
                    . . . . . . f f f f f f . . . . 
                    . . . . f f e e e e f 2 f . . . 
                    . . . f f e e e e f 2 2 2 f . . 
                    . . . f e e e f f e e e e f . . 
                    . . . f f f f e e 2 2 2 2 e f . 
                    . . . f e 2 2 2 f f f f e 2 f . 
                    . . f f f f f f f e e e f f f . 
                    . . f f e 4 4 e b f 4 4 e e f . 
                    . . f e e 4 d 4 1 f d d e f . . 
                    . . . f e e e 4 d d d d f . . . 
                    . . . . f f e e 4 4 4 e f . . . 
                    . . . . . 4 d d e 2 2 2 f . . . 
                    . . . . . e d d e 2 2 2 f . . . 
                    . . . . . f e e f 4 5 5 f . . . 
                    . . . . . . f f f f f f . . . . 
                    . . . . . . . f f f . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . f f f f f f . . . . 
                    . . . . f f e e e e f 2 f . . . 
                    . . . f f e e e e f 2 2 2 f . . 
                    . . . f e e e f f e e e e f . . 
                    . . . f f f f e e 2 2 2 2 e f . 
                    . . . f e 2 2 2 f f f f e 2 f . 
                    . . f f f f f f f e e e f f f . 
                    . . f f e 4 4 e b f 4 4 e e f . 
                    . . f e e 4 d 4 1 f d d e f . . 
                    . . . f e e e 4 d d d d f . . . 
                    . . . . 4 d d e 4 4 4 e f . . . 
                    . . . . e d d e 2 2 2 2 f . . . 
                    . . . . f e e f 4 4 5 5 f f . . 
                    . . . . f f f f f f f f f f . . 
                    . . . . . f f . . . f f f . . . 
                    `],
                100,
                false
                )
                music.play(music.melodyPlayable(music.footstep), music.PlaybackMode.InBackground)
            })
        }
        if (controller.left.isPressed()) {
            mySprite.x += -1 * x_speed
            projectile_vx = -1 * projectile_speed
            last_moved = game.runtime()
            timer.throttle("walk_left", 400, function () {
                animation.runImageAnimation(
                mySprite,
                [img`
                    . . . . f f f f f f . . . . . . 
                    . . . f 2 f e e e e f f . . . . 
                    . . f 2 2 2 f e e e e f f . . . 
                    . . f e e e e f f e e e f . . . 
                    . f e 2 2 2 2 e e f f f f . . . 
                    . f 2 e f f f f 2 2 2 e f . . . 
                    . f f f e e e f f f f f f f . . 
                    . f e e 4 4 f b e 4 4 e f f . . 
                    . . f e d d f 1 4 d 4 e e f . . 
                    . . . f d d d d 4 e e e f . . . 
                    . . . f e 4 4 4 e e f f . . . . 
                    . . . f 2 2 2 e d d 4 . . . . . 
                    . . . f 2 2 2 e d d e . . . . . 
                    . . . f 5 5 4 f e e f . . . . . 
                    . . . . f f f f f f . . . . . . 
                    . . . . . . f f f . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . f f f f f f . . . . . . 
                    . . . f 2 f e e e e f f . . . . 
                    . . f 2 2 2 f e e e e f f . . . 
                    . . f e e e e f f e e e f . . . 
                    . f e 2 2 2 2 e e f f f f . . . 
                    . f 2 e f f f f 2 2 2 e f . . . 
                    . f f f e e e f f f f f f f . . 
                    . f e e 4 4 f b e 4 4 e f f . . 
                    . . f e d d f 1 4 d 4 e e f . . 
                    . . . f d d d e e e e e f . . . 
                    . . . f e 4 e d d 4 f . . . . . 
                    . . . f 2 2 e d d e f . . . . . 
                    . . f f 5 5 f e e f f f . . . . 
                    . . f f f f f f f f f f . . . . 
                    . . . f f f . . . f f . . . . . 
                    `,img`
                    . . . . f f f f f f . . . . . . 
                    . . . f 2 f e e e e f f . . . . 
                    . . f 2 2 2 f e e e e f f . . . 
                    . . f e e e e f f e e e f . . . 
                    . f e 2 2 2 2 e e f f f f . . . 
                    . f 2 e f f f f 2 2 2 e f . . . 
                    . f f f e e e f f f f f f f . . 
                    . f e e 4 4 f b e 4 4 e f f . . 
                    . . f e d d f 1 4 d 4 e e f . . 
                    . . . f d d d d 4 e e e f . . . 
                    . . . f e 4 4 4 e e f f . . . . 
                    . . . f 2 2 2 e d d 4 . . . . . 
                    . . . f 2 2 2 e d d e . . . . . 
                    . . . f 5 5 4 f e e f . . . . . 
                    . . . . f f f f f f . . . . . . 
                    . . . . . . f f f . . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . f f f f f f . . . . . . 
                    . . . f 2 f e e e e f f . . . . 
                    . . f 2 2 2 f e e e e f f . . . 
                    . . f e e e e f f e e e f . . . 
                    . f e 2 2 2 2 e e f f f f . . . 
                    . f 2 e f f f f 2 2 2 e f . . . 
                    . f f f e e e f f f f f f f . . 
                    . f e e 4 4 f b e 4 4 e f f . . 
                    . . f e d d f 1 4 d 4 e e f . . 
                    . . . f d d d d 4 e e e f . . . 
                    . . . f e 4 4 4 e d d 4 . . . . 
                    . . . f 2 2 2 2 e d d e . . . . 
                    . . f f 5 5 4 4 f e e f . . . . 
                    . . f f f f f f f f f f . . . . 
                    . . . f f f . . . f f . . . . . 
                    `],
                100,
                false
                )
                music.play(music.melodyPlayable(music.footstep), music.PlaybackMode.InBackground)
            })
        }
        if (game.runtime() - last_moved > 1000) {
            mySprite.setImage(assets.image`hero`)
        }
        if (controller.A.isPressed()) {
            if (sprites.readDataString(mySprite, "powerup") == "cannon") {
                timer.throttle("pressed_fire", 150, function () {
                    projectile = sprites.createProjectileFromSprite(img`
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
                        `, mySprite, projectile_vx, 0)
                    music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
                })
            }
        }
    }
})
game.onUpdate(function () {
    for (let b2 of baddy_list) {
        if (b2.isHittingTile(CollisionDirection.Left)) {
            b2.vx = baddy_speed
        }
        if (b2.isHittingTile(CollisionDirection.Right)) {
            b2.vx = -1 * baddy_speed
        }
        if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation((b2.x + 8) / 16, b2.y / 16 + 1)))) {
            b2.vx = -1 * baddy_speed
        }
        if (!(tiles.tileAtLocationIsWall(tiles.getTileLocation((b2.x + -8) / 16, b2.y / 16 + 1)))) {
            b2.vx = baddy_speed
        }
        b2.vy += 5
        if (b2.vx > 0) {
            timer.throttle(sprites.readDataString(b2, "id"), 300, function () {
                animation.runImageAnimation(
                b2,
                [img`
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
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . 2 2 2 2 2 e . . . . 
                    . . . . . 2 2 2 2 d 2 2 e . . . 
                    . . . . e 2 2 2 2 2 2 2 e . . . 
                    . . . . e 2 2 2 2 2 2 2 e . . . 
                    . . . . e 2 2 2 2 2 e f f c c . 
                    . . . . e e 2 2 e f f f f b c . 
                    . . . e e e f e 2 b f f f d c . 
                    . . e e 2 2 d f 2 1 1 1 1 b c . 
                    . . e e 2 2 d f e e c c c . . . 
                    . . b 1 1 d e 2 e e c . . . . . 
                    . . f f f f d d f . . . . . . . 
                    f f f f f f d d . . . . . . . . 
                    f f f . f f f e . . . . . . . . 
                    f f . . . . e e e . . . . . . . 
                    . . . . . . e e e e . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . 2 2 2 2 2 e . . . . 
                    . . . . . 2 2 2 2 d 2 2 e . . . 
                    . . . . e 2 2 2 2 2 2 2 e . . . 
                    . . . . e 2 2 2 2 2 2 2 e . . . 
                    . . . . e 2 2 2 2 2 e f f c c . 
                    . . . . e e 2 2 e f f f f b c . 
                    . . e e e f e 2 2 b f f f d c . 
                    . e e 2 2 d f e 2 1 1 1 1 b c . 
                    . e e 2 2 d f e e e c c c . . . 
                    . b 1 1 e e 2 2 e e c . . . . . 
                    . . f d d 2 2 2 f f f d d . . . 
                    e e f d d e e e . f f d d . . . 
                    e e e f f f f f . . . . . . . . 
                    e e . . . . f f f . . . . . . . 
                    . . . . . . f f f f . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . 2 2 2 2 2 e . . . 
                    . . . . . . 2 2 2 2 d 2 2 e . . 
                    . . . . . e 2 2 2 2 2 2 2 e . . 
                    . . . . . e 2 2 2 2 2 2 2 e . . 
                    . . . . . e 2 2 2 2 2 e f f c c 
                    . . . . . e e 2 2 e f f f f b c 
                    . . . e e e f e 2 2 b f f f d c 
                    . . e e 2 2 d f e 2 1 1 1 1 b c 
                    . . e e 2 2 d f e e e c c c . . 
                    . . b 1 1 d e 2 2 e e c . . . . 
                    . . . f f f d d 2 2 f d d . . . 
                    . . . . f f d d e e f d d . . . 
                    . . . . . f f f f f . . . . . . 
                    . . . . e e e f f . . . . . . . 
                    . . . . e e e e f f . . . . . . 
                    `],
                100,
                false
                )
            })
        }
        if (b2.vx < 0) {
            timer.throttle(sprites.readDataString(b2, "id"), 300, function () {
                animation.runImageAnimation(
                b2,
                [img`
                    . . . . . . e 2 2 2 2 2 . . . . 
                    . . . . . e 2 2 d 2 2 2 2 . . . 
                    . . . . . e 2 2 2 2 2 2 2 e . . 
                    . . . . . e 2 2 2 2 2 2 2 e . . 
                    . . . c c f f e 2 2 2 2 2 e . . 
                    . . . c b f f f f e 2 2 e e . . 
                    . . . c d f f f b 2 e f e e e . 
                    . . . c b 1 1 1 1 2 f d 2 2 e e 
                    . . . . . c c c e e f d 2 2 e e 
                    . . . . . . c e e 2 2 e d 1 1 b 
                    . . . . . . . e 2 2 2 2 e f f . 
                    . . . . d d f f 2 2 d d f f . . 
                    . . . . d d f f e e d d f f . . 
                    . . . . . . . . . f f f f . . . 
                    . . . . . . . . f f f e e e . . 
                    . . . . . . . f f f e e e e . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . e 2 2 2 2 2 . . . . . . 
                    . . . e 2 2 d 2 2 2 2 . . . . . 
                    . . . e 2 2 2 2 2 2 2 e . . . . 
                    . . . e 2 2 2 2 2 2 2 e . . . . 
                    . c c f f e 2 2 2 2 2 e . . . . 
                    . c b f f f f e 2 2 e e . . . . 
                    . c d f f f b 2 e f e e e . . . 
                    . c b 1 1 1 1 2 f d 2 2 e e . . 
                    . . . c c c e e f d 2 2 e e . . 
                    . . . . . c e e 2 e d 1 1 b . . 
                    . . . . . . . f d d f f f f . . 
                    . . . . . . . . d d f f f f f f 
                    . . . . . . . . e f f f . f f f 
                    . . . . . . . e e e . . . . f f 
                    . . . . . . e e e e . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . . e 2 2 2 2 2 . . . . . . 
                    . . . e 2 2 d 2 2 2 2 . . . . . 
                    . . . e 2 2 2 2 2 2 2 e . . . . 
                    . . . e 2 2 2 2 2 2 2 e . . . . 
                    . c c f f e 2 2 2 2 2 e . . . . 
                    . c b f f f f e 2 2 e e . . . . 
                    . c d f f f b 2 2 e f e e e . . 
                    . c b 1 1 1 1 2 e f d 2 2 e e . 
                    . . . c c c e e e f d 2 2 e e . 
                    . . . . . c e e 2 2 e e 1 1 b . 
                    . . . d d f f f 2 2 2 d d f . . 
                    . . . d d f f . e e e d d f e e 
                    . . . . . . . . f f f f f e e e 
                    . . . . . . . f f f . . . . e e 
                    . . . . . . f f f f . . . . . . 
                    `,img`
                    . . . . . . . . . . . . . . . . 
                    . . . e 2 2 2 2 2 . . . . . . . 
                    . . e 2 2 d 2 2 2 2 . . . . . . 
                    . . e 2 2 2 2 2 2 2 e . . . . . 
                    . . e 2 2 2 2 2 2 2 e . . . . . 
                    c c f f e 2 2 2 2 2 e . . . . . 
                    c b f f f f e 2 2 e e . . . . . 
                    c d f f f b 2 2 e f e e e . . . 
                    c b 1 1 1 1 2 e f d 2 2 e e . . 
                    . . c c c e e e f d 2 2 e e . . 
                    . . . . c e e 2 2 e d 1 1 b . . 
                    . . . d d f 2 2 d d f f f . . . 
                    . . . d d f e e d d f f . . . . 
                    . . . . . . f f f f f . . . . . 
                    . . . . . . . f f e e e . . . . 
                    . . . . . . f f e e e e . . . . 
                    `],
                100,
                false
                )
            })
        }
    }
})
game.onUpdate(function () {
    if (mySprite.x > 1000) {
        game.gameOver(true)
    }
})
