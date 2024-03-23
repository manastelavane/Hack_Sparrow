const themes = {
    light: {
        palette: {
            mode: 'light',
            // other light theme settings
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
    dark: {
        palette: {
            mode: 'dark',
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
    colorBlind: {
        palette: {
            mode: 'dark',
            primary: {
                main: '#90caf9', // Light blue
            },
            secondary: {
                main: '#a5d6a7', // Light green
            },
            error: {
                main: '#ef9a9a', // Light red
            },
            warning: {
                main: '#ffb74d', // Light orange
            },
            info: {
                main: '#90caf9', // Light blue (similar to primary)
            },
            success: {
                main: '#a5d6a7', // Light green (similar to secondary)
            },
            text: {
                primary: '#ccc', // Light gray
                secondary: '#999', // Medium gray
            },
        },
        typography: {
            fontFamily: ['Poppins', 'Work Sans', 'sans-serif'].join(','),
        },
    },
};

export default themes;
