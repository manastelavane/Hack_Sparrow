import {
    NOTIFY,
    SIGN_IN,
    SIGN_OUT,
    START_LOADING,
    STOP_LOADING,
} from './types';

export const notifyAction = (open, severity, message) => {
    return {
        type: NOTIFY,
        payload: {
            open,
            severity,
            message,
        },
    };
};

export const signInAction = (
    isSignedIn,
    uid,
    email,
    bio,
    photoURL,
    name,
    username,
    socialLinks,
    testResults,
    isPrivacyAccepted,
    reportedBy,
    _id,
    token
) => {
    return {
        type: SIGN_IN,
        payload: {
            isSignedIn,
            uid,
            email,
            bio,
            photoURL,
            name,
            username,
            socialLinks,
            testResults,
            isPrivacyAccepted,
            reportedBy,
            _id,
            token,
        },
    };
};

export const signOutAction = () => {
    return {
        type: SIGN_OUT,
    };
};

export const startLoadingAction = () => {
    return {
        type: START_LOADING,
    };
};

export const stopLoadingAction = () => {
    return {
        type: STOP_LOADING,
    };
};
