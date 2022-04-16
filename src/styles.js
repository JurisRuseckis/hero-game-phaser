const isMobile = window.innerWidth <= 1024;

const misc = {
    padding: isMobile ? 20 : 10,
    borderWidth: isMobile ? 4 : 2,
}

const viewPort = {
    width: window.innerWidth * 2,
    height: window.innerHeight * 2
}

const fontSize = {
    default: isMobile ? 80 : 32,
    title: isMobile ? 80 : 80,
    large: isMobile ? 120 : 40,
}

const headerHeight = isMobile ? 450 : 140;


const navBtnCount = 4;
const panelLayout = {
    navHeight: headerHeight,
    navBtnWidth: (viewPort.width - misc.padding) / navBtnCount  - (misc.padding * navBtnCount),
    contentStart: headerHeight + misc.padding,
    contentHeight: viewPort.height - (headerHeight + misc.padding * 2) // nav height and padding before & after
};

const anchors = {
    topLeft: {
        left: `left+${misc.padding}`,
        top: `top+${misc.padding}`
    },
    top: {
        centerX: `center`,
        top: `top+${misc.padding}`
    },
    topRight: {
        right: `right-${misc.padding}`,
        top: `top+${misc.padding}`
    },
    middleLeft: {
        left: `left+${misc.padding}`,
        centerY: `center`,
    },
    middle: {
        centerX: `center`,
        centerY: `center`,
    },
    middleRight: {
        right: `right-${misc.padding}`,
        centerY: `center`,
    },
    bottomLeft: {
        left: `left+${misc.padding}`,
        bottom: `bottom-${misc.padding}`
    },
    bottom: {
        centerX: `center`,
        bottom: `bottom-${misc.padding}`
    },
    bottomRight: {
        right: `right-${misc.padding}`,
        bottom: `bottom-${misc.padding}`
    },
}

export const styles = {
    anchors: anchors,

    isMobile : isMobile,

    viewPort: {
        ...viewPort,
        centerX: viewPort.width/2,
        centerY: viewPort.height/2,
    },

    grid: {
        window: (isMobile ? viewPort.width : viewPort.width / 3) - misc.padding * 2,
    },

    panelLayout,

    colors: {
        black: 0x000000,
        white: 0xffffff,
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        modernBg: 0x141414,
        modernBorder: 0x656565,
        modernBtn: 0x3f3f3c,
        team1: 0x91a455,
        team2: 0x527db2,
        team3: 0xeaa51a,
        team4: 0xd86244,
    },

    textColors: {
        red: "#f00",
        green: "#0f0",
        black: "#000",
        white: "#fff",
        modernBg: "#141414",
        modernBorder: "#656565",
        modernBtn: "#3f3f3c",
        team1: "#91a455",
        team2: "#527db2",
        team3: "#eaa51a",
        team4: "#d86244"
    },

    fontSize,

    ...misc
};