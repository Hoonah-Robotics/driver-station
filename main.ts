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
        radio.sendValue("P", 1)
    }
    while (input.buttonIsPressed(Button.A)) {
        comment.comment("wait until button A is released")
    }
})
input.onButtonPressed(Button.AB, function () {
    radio.sendValue("AB", 1)
    basic.showString("AB")
})
input.onButtonPressed(Button.B, function () {
    comment.comment("Toggle maximum power")
    if (power == 1) {
        power = 2
    } else if (power == 2) {
        power = 3
    } else if (power == 3) {
        power = 1
    }
    radio.sendValue("P", power)
    while (input.buttonIsPressed(Button.B)) {
        comment.comment("wait until button B is released")
    }
})
input.onGesture(Gesture.Shake, function () {
    radio.sendValue("S", 1)
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
        pitch = input.rotation(Rotation.Pitch)
        if (pitch > -5 && pitch < 5) {
            comment.comment("dead band on pitch so nearly flat is still STOPPED (otherwise robot will creep)")
            throttle = 0
        } else {
            comment.comment("filter noisy accelerometer")
            comment.comment("Scale motor power from 255 to -255, so pitch forwards = drive forwards")
            throttle = Math.map(Math.constrain(pitch, -40, 40), -40, 40, 255, -255)
        }
        comment.comment("turn by tilt left/right")
        comment.comment("flat = 0; left tilt = -180; right tilt = 180")
        roll = input.rotation(Rotation.Roll)
        if (roll > -5 && roll < 5) {
            comment.comment("dead band on roll so nearly flat is still straight (otherwise robot won't drive straight)")
            turn = 0
        } else {
            comment.comment("filter noisy accelerometer")
            comment.comment("Scale motor power from -255 to 255")
            turn = Math.map(Math.constrain(roll, -40, 40), -40, 40, -255, 255)
        }
        radio.sendValue("y", throttle)
        radio.sendValue("x", turn)
        led.plot(2, 2)
        if (power == 1) {
            led.plot(4, 0)
        } else if (power == 2) {
            led.plot(4, 4)
        } else if (power == 3) {
            led.plot(0, 4)
        }
        if (throttle >= 200) {
            led.plot(2, 0)
            led.plot(2, 1)
        } else if (throttle > 100) {
            led.plot(2, 1)
        } else if (throttle <= -200) {
            led.plot(2, 3)
            led.plot(2, 4)
        } else if (throttle < -100) {
            led.plot(2, 3)
        }
        if (turn >= 200) {
            led.plot(3, 2)
            led.plot(4, 2)
        } else if (turn > 100) {
            led.plot(3, 2)
        } else if (turn <= -200) {
            led.plot(1, 2)
            led.plot(0, 2)
        } else if (turn < -100) {
            led.plot(1, 2)
        }
    }
})
