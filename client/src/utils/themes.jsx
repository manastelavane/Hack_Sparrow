const themes = {
    light: {
        palette: {
            mode: 'light',
            primary: {
                main: '#93e5ab', // Blue
            },
            secondary: {
                main: '#4e878c',
            },
            background: {
                paper: '#DBFFF1',
            },
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
    dark: {
        palette: {
            mode: 'dark',

            primary: {
                main: '#4e878c', // Dark blue
            },
            secondary: {
                main: '#93e5ab', // Light green
            },
            background: {
                paper: '#1a1a1a', // Dark gray
            },
            // other dark theme settings
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
    highContrast: {
        palette: {
            // custom theme settings
            primary: {
                main: '#000',
            },
            secondary: {
                main: '#fff',
            },
            error: {
                main: '#f00',
            },
            warning: {
                main: '#ff0',
            },
            info: {
                main: '#0ff',
            },
            success: {
                main: '#0f0',
            },
            text: {
                primary: '#000',
                secondary: '#fff',
            },
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
    redWeakProtoanomaly: {
        palette: {
            primary: {
                main: '#635dc1',
            },
            secondary: {
                main: '#7c9fa3',
            },
            error: {
                main: '#ab750c',
            },
            warning: {
                main: '#d0a807',
            },
            info: {
                main: '#81ace4',
            },
            success: {
                main: '#ace81e',
            },
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
    greenBlindDeuteranopia: {
        palette: {
            primary: {
                main: '#5a6da4', // Blue
            },
            secondary: {
                main: '#a196ae', // Purple
            },
            error: {
                main: '#a57c01', // Yellow
            },
            warning: {
                main: '#dba400', // Orange
            },
            info: {
                main: '#94a8ed',
            },
            success: {
                main: '#ffd392',
            },
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
    blueWeakTritanomaly: {
        palette: {
            primary: {
                main: '#a5517b', // Red
            },
            secondary: {
                main: '#6ebb86', // Gray
            },
            error: {
                main: '#d8593b', // Cyan
            },
            warning: {
                main: '#e99965', // Teal
            },
            info: {
                main: '#00a5cb', // Light red
            },
            success: {
                main: '#58f3af', // Light blue
            },
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
};

export default themes;
