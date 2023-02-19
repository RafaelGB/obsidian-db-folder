import { ColorsInterface } from "cdm/ModulesFnModel";
import { HSL } from "obsidian";
import { DbModule } from "../DbModule";

export class ColorsFn extends DbModule implements ColorsInterface {
    public name = "colors";

    static GREY_SCALE_REFERENCE = {
        0: '#fafafa', 1: '#f5f5f5', 2: '#eeeeee',
        3: '#e0e0e0', 4: '#bdbdbd', 5: '#9e9e9e',
        6: '#757575', 7: '#616161', 8: '#424242', 9: '#212121'
    }

    async create_static_functions(): Promise<void> {
        this.static_functions.set("hslToString", this.hslToString.bind(this));
        this.static_functions.set("stringtoHsl", this.stringtoHsl.bind(this));
        this.static_functions.set("getContrast", this.getContrast.bind(this));
        this.static_functions.set("randomColor", this.randomColor.bind(this));
        this.static_functions.set("greyScale", this.greyScale.bind(this));
    }

    async create_dynamic_functions(): Promise<void> {
        // No dynamic functions
    }

    hslToString(hsl: HSL): string {
        if (!hsl) return this.greyScale();

        return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
    }

    stringtoHsl(str: string): HSL {
        if (!str) {
            return { h: 0, s: 0, l: 0 };
        }

        const hslRegex = /^hsl\((\d{1,15}),\s*(\d{1,15})%,\s*(\d{1,15})%\)$/;
        const match = str.match(hslRegex);
        if (match) {
            const [, h, s, l] = match;
            return { h: parseInt(h), s: parseInt(s), l: parseInt(l) };
        }
        return { h: 0, s: 0, l: 0 };
    }

    getContrast(hsl: string | HSL): string {
        if (!hsl) return this.greyScale();

        if (typeof hsl === "string") {
            hsl = this.stringtoHsl(hsl);
        }
        if (hsl.l < 50) {
            hsl.l = 80;
        } else {
            hsl.l = 20;
        }
        return this.hslToString(hsl);
    }

    randomColor(): string {
        return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
    }

    greyScale(value = 5): string {
        return ColorsFn.GREY_SCALE_REFERENCE[value as keyof typeof ColorsFn.GREY_SCALE_REFERENCE] || ColorsFn.GREY_SCALE_REFERENCE[5];
    }
}