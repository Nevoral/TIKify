import Wheel from "./wheel";
import Output from "./output";
import Plug from "./plugboard";
import Wire from "./wire";
import Cesar, {Substitution, Substitution2, Substitution3} from "./cifers";

function Enigma(canvas) {
    const c = canvas.getContext('2d');
    const qwerty = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    this.wheel = [];
    this.output = [];
    this.plugboard = [];
    this.lines = [];
    this.selectedWheel = 0;
    this.selectedKey = 0;
    this.connection = 0;

    this.init = function () {
        this.wheel.push(new Wheel(canvas, 0.09, 0.25, 0.166, "cesar", alphabet));
        this.wheel.push(new Wheel(canvas, 0.09, 0.5, 0.166, "cesar", alphabet));
        this.wheel.push(new Wheel(canvas, 0.09  , 0.75, 0.166, "cesar", alphabet));

        for (let i = 0; i < 10; i++) {
            this.output.push(new Output(canvas, (i + 1) * 0.0909, 0.375, 20, qwerty[i]));
            this.plugboard.push(new Plug(canvas, (i + 1) * 0.0909, 0.625, 20, qwerty[i]));
        }
        for (let i = 0; i < 9; i++) {
            this.output.push(new Output(canvas, (i + 1) * 0.1, 0.4166, 20, qwerty[i + 10]));
            this.plugboard.push(new Plug(canvas, (i + 1) * 0.1, 0.75, 20, qwerty[i + 10]));
        }
        for (let i = 0; i < 7; i++) {
            this.output.push(new Output(canvas, (i + 1) * 0.125, 0.4583, 20, qwerty[i + 19]));
            this.plugboard.push(new Plug(canvas, (i + 1) * 0.125, 0.875, 20, qwerty[i + 19]));
        }
    }

    this.UpdateSizes = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    this.DrawWheel = function () {
        for (let i = 0; i < this.wheel.length; i++) {
            this.wheel[i].Draw();
        }
    }

    this.DrawOutput = function () {
        for (let i = 0; i < this.output.length; i++) {
            this.output[i].Draw();
        }
    }

    this.DrawPlugboard = function () {
        c.clearRect(canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top + canvas.height / 2,
            canvas.width, canvas.height / 2);
        for (let i = 0; i < this.plugboard.length; i++) {
            this.plugboard[i].UpdateCords();
        }
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].plug1.selected && this.lines[i].plug2.selected) {
                this.lines[i].Draw();
                continue;
            }
            this.lines[i].plug1.selected = false;
            this.lines[i].plug2.selected = false;
            this.lines.splice(i, 1);
            i--;
        }
        for (let i = 0; i < this.plugboard.length; i++) {
            this.plugboard[i].Draw();
        }
    }

    this.SelectedWheel = function (x, y) {
        for (let i = 0; i < this.wheel.length; i++) {
            if (this.wheel[i].Selected(x, y)) {
                this.selectedWheel = this.wheel[i];
                break;
            }
        }
    }

    this.SelectedPlug = function (x, y) {
        for (let i = 0; i < this.plugboard.length; i++) {
            if (this.plugboard[i].Selected(x, y)) {
                if (this.connection === 0) {
                    this.connection = this.plugboard[i];
                    // console.log(this.connection)
                    break;
                }
                if (this.connection !== this.plugboard[i]) {
                    this.lines.push(new Wire(canvas, this.connection, this.plugboard[i]));
                    this.connection = 0;
                }
            }
        }
    }

    this.UpdateWheel = function (finish, x, y) {
        if(finish) {
            this.selectedWheel.selected = false;
            this.selectedWheel.UpdateRotation();
            // console.log(this.selectedWheel.startOffset)
            this.selectedWheel.Draw();
            this.selectedWheel = 0;

        } else {
            const u = [this.selectedWheel.clickX - this.selectedWheel.x, this.selectedWheel.clickY - this.selectedWheel.y];
            const v = [x - this.selectedWheel.x, y - this.selectedWheel.y];

            this.selectedWheel.rotation += Math.atan2(v[1], v[0]) - Math.atan2(u[1], u[0]);
            this.selectedWheel.Draw();
            this.selectedWheel.clickX = x;
            this.selectedWheel.clickY = y;
        }
    }

    this.SelectKey = function (key) {
        if (key === "Backspace") {
            this.output[this.selectedKey].selected = false;
            this.output[this.selectedKey].Draw();
            this.selectedKey = 0;
            return;
        }
        key = key.toUpperCase();

        this.Offsets();

        let keyIndex = this.CheckPlugs(key);
        keyIndex = Cesar(keyIndex, this.wheel[0].offset, "BDFHJLCPRTXVZNYEIWGAKMUSQO", false);
        keyIndex = Cesar(keyIndex, this.wheel[1].offset, "AJDKSIRUXBLHWTMCQGZNPYFVOE", false);
        keyIndex = Cesar(keyIndex, this.wheel[2].offset, "EKMFLGDQVZNTOWYHXUSPAIBRCJ", false);
        keyIndex = Substitution(alphabet[keyIndex], "AYBRCUDHEQFSGLIPJXKNMOTZVW");
        keyIndex = Cesar(keyIndex, this.wheel[2].offset, "EKMFLGDQVZNTOWYHXUSPAIBRCJ", true);
        keyIndex = Cesar(keyIndex, this.wheel[1].offset, "AJDKSIRUXBLHWTMCQGZNPYFVOE", true);
        keyIndex = Cesar(keyIndex, this.wheel[0].offset, "BDFHJLCPRTXVZNYEIWGAKMUSQO", true);
        keyIndex = this.CheckPlugs(alphabet[keyIndex]);
        key = alphabet[keyIndex];

        keyIndex = qwerty.indexOf(key);

        if (keyIndex !== -1) {
            this.output[this.selectedKey].selected = false;
            this.output[this.selectedKey].Draw();
            this.selectedKey = keyIndex;
            this.output[keyIndex].selected = true;
            this.output[keyIndex].Draw();
        }
    }

    this.CheckPlugs = function (key) {
        for (let i = 0; i < this.lines.length; i++) {
            if (key === this.lines[i].plug1.val) {
                return alphabet.indexOf(this.lines[i].plug2.val);
            }
            if (key === this.lines[i].plug2.val) {
                return alphabet.indexOf(this.lines[i].plug1.val);
            }
        }
        return alphabet.indexOf(key);
    }

    this.Offsets = function () {
        let rotor = false;
        if (this.wheel[0].offset === 21) {
            rotor = true;
        }
        this.wheel[0].AddStep();
        this.wheel[0].Draw();
        if (rotor) {
            rotor = this.wheel[1].offset === 4;
            this.wheel[1].AddStep();
            this.wheel[1].Draw();
            if (rotor) {
                this.wheel[2].AddStep();
                this.wheel[2].Draw();
            }
        } else {
            if (this.wheel[1].offset === 4) {
                this.wheel[1].AddStep();
                this.wheel[1].Draw();
                this.wheel[2].AddStep();
                this.wheel[2].Draw();
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("enigma");

    const enigma = new Enigma(canvas);
    enigma.init();

    enigma.UpdateSizes();
    enigma.DrawWheel();
    enigma.DrawOutput();
    enigma.DrawPlugboard();

    window.addEventListener('resize',  () =>  {
        enigma.UpdateSizes();
        enigma.DrawWheel();
        enigma.DrawOutput();
        enigma.DrawPlugboard();
    });

    canvas.addEventListener('mousedown', (event) => {
        if (event.clientY < canvas.height / 3) {
            enigma.SelectedWheel(event.clientX, event.clientY);
        } else if (event.clientY > canvas.height / 2) {
            enigma.SelectedPlug(event.clientX, event.clientY);
            enigma.DrawPlugboard();
        }
    });

    canvas.addEventListener('mouseup', () => {
        if (enigma.selectedWheel !== 0) {
            enigma.UpdateWheel(true, 0, 0);
        }
    });

    canvas.addEventListener('mousemove', (event) => {
        if (enigma.selectedWheel !== 0) {
            enigma.UpdateWheel(false, event.clientX, event.clientY);
        }
    });

    document.addEventListener("keydown", (event) => {
        enigma.SelectKey(event.key);
    });
});