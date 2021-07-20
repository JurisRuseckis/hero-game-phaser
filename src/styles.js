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

export const styles = {
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
        red: 0xff0000,
        blue: 0x0000ff,
        modernBg: 0x141414,
        modernBorder: 0x505050,
        modernBtn: 0x3f3f3c,
        team1: 0x91a455,
        team2: 0x527db2,
        team3: 0xeaa51a,
        team4: 0xd86244,
    },

    textColors: {
        red: "#f00"
    },

    fontSize,

    ...misc
};