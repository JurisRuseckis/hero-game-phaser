// TODO: rewrite to support mobile & desktop
const misc = {
    padding: 20,
    borderWidth: 4,
}

const viewPort = {
    width: 960,
    height: 1600
}

const fontSize = {
    default: 32,
    title: 80,
    large: 40,
}

const panelLayout = {
    navHeight: 140,
    contentStart: 140 + misc.padding,
    contentHeight: viewPort.height - (140 + misc.padding * 2) // nav height and padding before & after
};

export const styles = {
    viewPort: {
        ...viewPort,
        centerX: viewPort.width/2,
        centerY: viewPort.height/2,
    },

    grid: {
        window: viewPort.width - misc.padding * 2,
    },

    panelLayout,

    colors: {
        windowBg : 0xaf826b,
        windowBorder: 0x574135,
        btnBg: 0xb16551,
        btnBorder:  0x462820,
        red: 0xff0000,
        blue: 0x0000ff
    },

    textColors: {
        red: "#f00"
    },

    fontSize,

    ...misc
};