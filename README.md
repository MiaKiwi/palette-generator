# Palette Generator
*kiwi.mia.0020*

Tired of writing your color palettes by hand? Tired of using preprocessors or CSS functions just to generate color variations? Want to spicy up your life with cool, customizable, and shareable color palettes?

Well you've come to the right place!

## Features

- Import existing color palettes from JSON files.
- Add, edit, and remove themes, colors, and variations.
- Generate CSS files for easy integration into your projects.
- Export your palettes as JSON files for sharing and backup.

## Structure

A palette can have multiple themes (e.g. light and dark), and each theme can have multiple theme colors (e.g. primary, secondary, accent). Each theme color can have multiple variations (e.g. primary-10, secondary-55, etc).

The default theme color variantions are based on the HSLA lightness scale from 0 to 100 in increments of 10 (i.e. primary-10 is hsla(x, x, 10, x), primary-20 is hsla(x, x, 20, x), etc).

The format for CSS variables is as follows:

```CSS
--{theme-color-name}: {theme-color-value};
--{theme-color-name}-{variation-percentage}: {theme-color-variation-value};
```

Theme color variations for themes with the name 'dark' or that start with 'dark- will have their lightness scale inverted (i.e. primary-10 is actually hsla(x, x, 90, x), primary-20 is actually hsla(x, x, 80, x), etc). That way, you can just replace the theme and have the UI stay somewhat consistent.

Themes can also be auto-detected, so if you have a theme named 'dark' a rule is added for the `prefers-color-scheme: dark` media query.