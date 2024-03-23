import { SIGN_IN, SIGN_OUT } from '../actions/types';

const INITIAL_STATE = {
    isSignedIn: false,
    uid: null,
    email: null,
    bio: null,
    photoURL: null,
    name: null,
    username: null,
    socialLinks: null,
    testResults: {
        ocd: 0,
        adhd: 0,
        ptsd: 0,
        anxiety: 0,
        depression: 0,
    },
    isPrivacyAccepted: false,
    reportedBy: [],
    _id: null,
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGN_IN:
            // console.log(action.payload);
            window.localStorage.setItem(
                'healthApp',
                JSON.stringify({ dnd: action.payload.token, isSignedIn: true })
            );
            return {
                ...state,
                isSignedIn: true,
                uid: action.payload.uid,
                email: action.payload.email,
                bio: action.payload.bio,
                photoURL: action.payload.photoURL,
                name: action.payload.name,
                username: action.payload.username,
                socialLinks: action.payload.socialLinks,
                testResults: action.payload.testResults,
                isPrivacyAccepted: action.payload.isPrivacyAccepted,
                reportedBy: action.payload.reportedBy,
                _id: action.payload._id,
            };

        case SIGN_OUT:
            window.localStorage.removeItem('healthApp');
            return {
                ...state,
                isSignedIn: false,
                uid: null,
                email: null,
                bio: null,
                photoURL: null,
                name: null,
                username: null,
                socialLinks: null,
                testResults: {
                    ocd: 0,
                    adhd: 0,
                    ptsd: 0,
                    anxiety: 0,
                    depression: 0,
                },
                isPrivacyAccepted: false,
                reportedBy: [],
                _id: null,
            };

        default:
            return state;
    }
};

export default authReducer;
