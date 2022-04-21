import { lightAction, 
    lightBgLight, 
    lightBgDark,
    lightCol,

    darkAction,
    darkBgLight,
    darkBgDark,
    darkCol } from "../utils/themecolours";

const userTheme = JSON.parse(
    window.localStorage.getItem(
        "socioTheme"
    ))?.theme 
    ||  {
        type: "light" // Default theme if user theme storage object doesn't exist
    }

const initialTheme = 
    userTheme ? 
        userTheme.type === "custom" ? 
        {
            action: userTheme.colors.action,
            bgPrim: userTheme.colors.bgPrim,
            bgSec: userTheme.colors.bgSec,
            actionCol: userTheme.colors.actionCol,
            col: userTheme.colors.col
        }
    :   userTheme.type === "light" ?
            {
                action: lightAction,
                bgPrim: lightBgLight,  // White bg
                bgSec: lightBgDark,    // Offwhite bg
                actionCol: darkCol,
                col: lightCol
            }
        :   {
                action: darkAction,
                bgPrim: darkBgLight,
                bgSec: darkBgDark,
                actionCol: lightCol,
                col: darkCol
            }
    :   {
        type: "light",
        action: lightAction,
        bgPrim: lightBgLight,  // White bg
        bgSec: lightBgDark,    // Offwhite bg
        actionCol: darkCol,
        col: lightCol
    }

export default function themeReducer(state = initialTheme, action) {
    switch (action.type) {
        case "SET_THEME":
            return { ...action.data }
        default:
            return state;
    };
};

function setTheme() {
    return async dispatch => {
        const storedTheme = JSON.parse(window.localStorage.getItem("socioTheme"))?.theme;

        if (storedTheme) {
            if (storedTheme.type === "light") {
                window.localStorage.setItem("socioTheme", 
                    JSON.stringify({
                        theme: { 
                            type: "dark" 
                        }   
                    })
                );

                dispatch({
                    type: "SET_THEME",
                    data: {
                        type: "dark",
                        action: darkAction,
                        bgPrim: darkBgLight,
                        bgSec: darkBgDark,
                        actionCol: lightCol,
                        col: darkCol
                    }
                });
            }
            else if (storedTheme.type === "dark") {
                window.localStorage.setItem("socioTheme", 
                    JSON.stringify({
                        theme: { 
                            type: "light" 
                        }   
                    })
                );

                dispatch({
                    type: "SET_THEME",
                    data: {
                        type: "light",
                        action: lightAction,
                        bgPrim: lightBgLight, // White bg
                        bgSec: lightBgDark,    // Offwhite bg
                        actionCol: darkCol,
                        col: lightCol
                    }
                });
            };
        }
        else {
            window.localStorage.setItem("socioTheme", 
                JSON.stringify({
                    theme: { 
                        type: "light" 
                    }   
                })
            );

            dispatch({
                type: "SET_THEME",
                type: "light",
                action: lightAction,
                bgPrim: lightBgLight,
                bgSec: lightBgDark,
                actionCol: darkCol,
                col: lightCol 
            })
        };
    };
};

function setLTheme() {
    return({
        type: "SET_THEME",
        data: {
            type: "light",
            action: lightAction,
            bgPrim: lightBgLight, // White bg
            bgSec: lightBgDark    // Offwhite bg
        }
    });
};

function setDTheme() {
    return({
        type: "SET_THEME",
        data: {
            type: "dark",
            action: darkAction,
            bgPrim: darkBgLight,
            bgSec: darkBgDark
        }
    })
}

export { setTheme, setLTheme, setDTheme };