export interface LoginResponse {
    operationType: string;
    credential?: any;
    additionalUserInfo: AdditionalUserInfo;
    user: User;
}
export interface User {
    uid: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerData: ProviderDatum[];
    stsTokenManager: StsTokenManager;
    createdAt: string;
    lastLoginAt: string;
    apiKey: string;
    appName: string;
}
export interface StsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
}
export interface ProviderDatum {
    providerId: string;
    uid: string;
    displayName?: any;
    email: string;
    phoneNumber?: any;
    photoURL?: any;
}
export interface AdditionalUserInfo {
    isNewUser: boolean;
    providerId: string;
    profile: Profile;
}
export interface Profile {
}