export interface loginUser {
    clientId: string;
    username: string;
    password: string;
}

export interface LoginResponse {
    data: any;
    errorMessages: string;
    isValid: boolean;
    successMessages: string | null;
}

export interface User {
    companyId: string;
    currency: string;
    currencyId: number;
    employeeId: string;
    firstName: string;
    id: string;
    lastName: string;
    middleName: string;
    permissions: any;
    refreshToken: string | null;
    token: string | null;
}

export interface companyInfo {
    id: string;
    name: string;
    shortName: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    emailId: string;
    phoneNo1: string;
    phoneNo2: string;
    vatNo: string;
    crNo: string;
    logo: string;
    parentId: string;
    currencyId: number;
}

export interface employee {
    confirmationOn: string;
    departmentId: string;
    departmentName: string;
    designationId: string;
    designationName: string;
    employeeCode: string;
    firstName: string;
    fullName: string;
    id: string;
    isUserCreated: boolean;
    joiningOn: string;
    lastName: string;
    middleName: string;
    officeContactNo: string;
    officeEmailId: string;
    profilePhotoName: string;
    relievingOn: string;
    reportingToId: string;
    reportingToName: string;
    resignationOn: string;
    userId: string;
}

export interface newUser {
    firstName: string
    lastName: string
    middleName: string

    birthDate: string
    gender?: number,

    parmenantAddress: string
    currentAddress: string
    isCurrentSameAsParmenantAddress: boolean,

    personalEmailId: string
    personalMobileNo: string
    otherContactNo: string
    employeeCode: string
    joiningOn: string
}
