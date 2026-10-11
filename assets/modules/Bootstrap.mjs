import AbstractComponent from "./kwui/components/AbstractComponent.mjs";
import Core from "./kwui/components/core/Core.mjs";
import Loader from "./kwui/components/feedback/Loader.mjs";
import Palette from "./palette-gen/palette/Palette.mjs";
import PaletteTheme from "./palette-gen/palette/PaletteTheme.mjs";
import NOTIF from "./app/NOTIF.mjs";
import Tooltip from "./kwui/components/display/Tooltip.mjs";
import ColorPalette from "./palette-gen/components/ColorPalette.mjs";
import CTX from "./app/CTX.mjs";
import EVT from "./app/EVT.mjs";



console.log("%c===== STARTUP =====", "font-weight:bold;color:dodgerblue");
const APP = document.getElementById("app");

AbstractComponent.styleRegister.register(Core);
AbstractComponent.styleRegister.register(Tooltip);

NOTIF.mount(document.body);
const LOADER = new Loader({}, ['Loading']);
LOADER.mount(document.body);



try {
    // Get local storage drafts index
    let draftOptions = [];
    let index = localStorage.getItem(Palette._lsIndexKey());
    if (index) {
        index = JSON.parse(index);
        for (let name of index) {
            draftOptions.push(name);
        }
    }

    console.log(index);

    // If no local draft, create a new palette
    let palette = null;
    if (draftOptions.length === 0) {
        palette = new Palette('new-palette');

        let defaultTheme = new PaletteTheme({ name: 'default', palette: palette });
        palette.addTheme(defaultTheme);
    } else {
        // Load the first draft from local storage
        let draftData = localStorage.getItem(Palette._lsItemPrefix() + draftOptions[0]);
        if (draftData) {
            let draftObj = JSON.parse(draftData);
            palette = Palette.fromObject(draftObj);
        }
    }

    let colorPalette = new ColorPalette({
        palette: palette
    });
    CTX.palette = palette;
    CTX.ui = colorPalette;

    colorPalette.mount(APP);

    Object.values(EVT.list).forEach(type => {
        CTX.ui.addListener(type, () => console.log(CTX.json(true), CTX.minCSS()))
    })
} catch (e) {
    NOTIF.danger([`Failed to load app: ${e}`]);
    console.error(e);
} finally {
    LOADER.unmount();
}