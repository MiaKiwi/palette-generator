# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [STVP](https://mia.kiwi/projects/stvp).

## [26.3.1] - 2026-10-11

### Added

- `minified` argument (defaults to `false`) to `getCssDeclarationLines()` and `getFgCssDeclarationLines()` methods in `Palette`, `PaletteTheme`, `ThemeColor`, and `Color`. Removes CSS comments and omits some formatting spaces.
- `isDark()` method to `PaletteTheme` to determine whether a theme is considered 'dark'

### Changed

- `LightnessVariantsGenerator` to reference new `isDark()` method



## [26.3.0] - 2026-10-11

### Added

- [KWUI](https://github.com/MiaKiwi/kwui) dependency for upcoming UI make-over

### Changed

- `HexColorValue` and `ColorValueConverter` hex mode now omit opacity from hexadecimal color strings if it's set to full

### Deprecated

- UI system built into palette objects will be replaced by standalone KWUI system

### Fixed

- Color selector with `null` list attribute hides color picker in some browsers



## [25.2.4] - 2025-12-15

### Fixed

- Toolbar being dissociated from the palette when importing
- Color picker not working because of format and transparency issue



## [25.2.3] - 2025-12-15

### Added

- Support for opacity
- `hasColorByValues` method to `PaletteTheme` to check if a theme has a specified color by its name or value
- New theme colors are automatically added to other themes as well

### Changed

- Reworked toolbar

### Fixed

- Palette not being renamed properly
- Can't have multiple themes or theme colors with the same name



## [25.2.2] - 2025-11-26

### Added

- Favicon
- Footer



## [25.2.1] - 2025-11-25

### Added

- setup
- Colors
- Theme colors
- Palette themes
- Palettes
- Color tools
- Palette draft saving to local storage
- Palette editablility propagation
- Toolbar
- Made palette name editable

### Changed

- `_lsItemPrefix` and `_lsIndexKey` from getters to static methods

### Fixed

- Parsing for `PaletteTheme` from v1 object
