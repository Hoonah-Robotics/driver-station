input.onButtonPressed(Button.A, function () {
    if (power > 0) {
        comment.comment("STOP robot!")
        power = 0
        radio.sendValue("y", 0)
        radio.sendValue("x", 0)
        basic.showIcon(IconNames.No)
    } else {
        comment.comment("DRIVE robot!")
        power = 1
    }
    while (input.buttonIsPressed(Button.A)) {
        comment.comment("wait until button A is released")
    }
})
input.onButtonPressed(Button.AB, function () {
    radio.sendString("AB")
    basic.showString("AB")
})
input.onButtonPressed(Button.B, function () {
    comment.comment("Toggle maximum power")
    if (power == 1) {
        power = 0.4
    } else if (power == 0.4) {
        power = 1
    }
    while (input.buttonIsPressed(Button.B)) {
        comment.comment("wait until button B is released")
    }
})
input.onGesture(Gesture.Shake, function () {
    radio.sendString("S")
    basic.showIcon(IconNames.Angry)
})
let turn = 0
let roll = 0
let throttle = 0
let pitch = 0
let power = 0
comment.comment("connect to robot")
comment.comment("set UNIQUE group number 1-255")
radio.setGroup(0)
radio.setTransmitPower(7)
basic.showIcon(IconNames.Happy)
power = 1
basic.forever(function () {
    if (power != 0) {
        basic.clearScreen()
        comment.comment("throttle by tilt forwards/backwards")
        comment.comment("flat = 0; forwards = -180; backwards = 180")
        comment.comment("\"x -1\" to make forwards = 180")
        pitch = input.rotation(Rotation.Pitch) * -1
        if (pitch > -10 && pitch < 10) {
            comment.comment("dead band on pitch so nearly flat is still STOPPED (otherwise robot will creep)")
            throttle = 0
        } else {
            comment.comment("filter noisy accelerometer")
            throttle = Math.constrain(pitch, -40, 40)
        }
        comment.comment("turn by tilt left/right")
        comment.comment("flat = 0; left tilt = -180; right tilt = 180")
        roll = input.rotation(Rotation.Roll)
        if (roll > -10 && roll < 10) {
            comment.comment("dead band on roll so nearly flat is still straight (otherwise robot won't drive straight)")
            turn = 0
        } else {
            comment.comment("filter noisy accelerometer")
            turn = Math.constrain(roll, -40, 40)
        }
        radio.sendValue("y", throttle * power)
        radio.sendValue("x", turn * power)
        led.plot(2, 2)
        if (power == 1) {
            led.plot(4, 0)
        } else {
            led.plot(0, 4)
        }
        if (throttle >= 40) {
            led.plot(2, 0)
            led.plot(2, 1)
        } else if (throttle > 20) {
            led.plot(2, 1)
        } else if (throttle <= -40) {
            led.plot(2, 3)
            led.plot(2, 4)
        } else if (throttle < -20) {
            led.plot(2, 3)
        }
        if (turn >= 40) {
            led.plot(3, 2)
            led.plot(4, 2)
        } else if (turn > 20) {
            led.plot(3, 2)
        } else if (turn <= -40) {
            led.plot(1, 2)
            led.plot(0, 2)
        } else if (turn < -20) {
            led.plot(1, 2)
        }
    }
})
