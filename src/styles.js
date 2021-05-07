const viewPort = {
    width: 480,
    height: 800
}

const fontSize = {
    default: 16,
    title: 40,
    large: 20,
}

export const styles = {
    viewPort: {
        ...viewPort,
        centerX: viewPort.width/2,
        centerY: viewPort.height/2,
    },

    grid: {
      window: viewPort.width - 20,
    },

    colors: {
        windowBg : 0xaf826b,
        windowBorder: 0x574135,
        btnBg: 0xb16551,
        btnBorder:  0x462820
    },

    fontSize,

    padding: 15,
    borderWidth: 2,
};