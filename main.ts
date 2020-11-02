input.onButtonPressed(Button.A, function () {
    comment.comment("STOP robot!")
    radio.sendValue("y", 0)
    radio.sendValue("x", 0)
    basic.showIcon(IconNames.No)
    basic.pause(200)
    while (!(input.buttonIsPressed(Button.B))) {
        comment.comment("loop here until button B is pressed")
    }
    basic.showIcon(IconNames.Happy)
    basic.pause(1000)
})
let turn = 0
let throttle = 0
comment.comment("connect to robot")
comment.comment("set UNIQUE group number 1-255")
radio.setGroup(0)
let power = 1
basic.showIcon(IconNames.Happy)
basic.forever(function () {
    basic.clearScreen()
    comment.comment("throttle by tilt forwards/backwards")
    comment.comment("flat = 0; forwards = -180; backwards = 180")
    comment.comment("\"x -1\" to make forwards = 180")
    throttle = input.rotation(Rotation.Pitch) * -1
    if (throttle > -10 && throttle < 10) {
        comment.comment("dead band on pitch so nearly flat is still STOPPED (otherwise robot will creep)")
        throttle = 0
    }
    comment.comment("turn by tilt left/right")
    comment.comment("flat = 0; left tilt = -180; right tilt = 180")
    turn = input.rotation(Rotation.Roll)
    if (turn > -10 && turn < 10) {
        comment.comment("dead band on roll so nearly flat is still straight (otherwise robot won't drive straight)")
        turn = 0
    }
    radio.sendValue("y", throttle)
    radio.sendValue("x", turn)
    led.plot(2, 2)
    if (throttle > 40) {
        led.plot(2, 0)
        led.plot(2, 1)
        led.plot(2, 2)
    } else if (throttle > 20) {
        led.plot(2, 1)
        led.plot(2, 2)
    } else if (throttle < -40) {
        led.plot(2, 2)
        led.plot(2, 3)
        led.plot(2, 4)
    } else if (throttle < -20) {
        led.plot(2, 2)
        led.plot(2, 3)
    }
    if (turn > 40) {
        led.plot(2, 2)
        led.plot(3, 2)
        led.plot(4, 2)
    } else if (turn > 20) {
        led.plot(2, 2)
        led.plot(3, 2)
    } else if (turn < -40) {
        led.plot(2, 2)
        led.plot(1, 2)
        led.plot(0, 2)
    } else if (turn < -20) {
        led.plot(2, 2)
        led.plot(1, 2)
    }
})
