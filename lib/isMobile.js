export const isMobile = (() => {
    let isPortrait = window.matchMedia("(orientation: portrait)").matches;
    let isLandscape = window.matchMedia("(orientation: landscape)").matches;
    let isMobileWidth = window.matchMedia("(max-width: 1200px)").matches;
    return ((isPortrait || isLandscape) && isMobileWidth);
})();
