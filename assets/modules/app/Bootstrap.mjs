import Color from "../palette-gen/palette/Color.mjs";
import Palette from "../palette-gen/palette/Palette.mjs";
import PaletteTheme from "../palette-gen/palette/PaletteTheme.mjs";
import ThemeColor from "../palette-gen/palette/ThemeColor.mjs";
import LightnessVariantsGenerator from "../palette-gen/palette/variants/LightnessVariantsGenerator.mjs";
import ColorValueConverter from "../palette-gen/tools/ColorValueConverter.mjs";
import ColorWheel from "../palette-gen/tools/ColorWheel.mjs";
import ConstrastChecker from "../palette-gen/tools/ContrastChecker.mjs";
import HexColorValue from "../palette-gen/values/HexColorValue.mjs";



const MAIN = document.getElementById('main');



// Get local storage drafts index
let draftOptions = [];
let index = localStorage.getItem(Palette._lsIndexKey);
if (index) {
    index = JSON.parse(index);
    for (let name of index) {
        draftOptions.push(name);
    }
}



// If no local draft, create a new palette
let palette = null;
if (draftOptions.length === 0) {
    palette = new Palette('new-palette');

    let defaultTheme = new PaletteTheme({ name: 'default', palette: palette });
    palette.addTheme(defaultTheme);
} else {
    // Load the first draft from local storage
    let draftData = localStorage.getItem(Palette._lsItemPrefix + draftOptions[0]);
    if (draftData) {
        let draftObj = JSON.parse(draftData);
        palette = Palette.fromObject(draftObj);
    }
}



// Create palette card
if (palette) {
    let paletteCard = palette.createPaletteCard();
    MAIN.appendChild(paletteCard);
}