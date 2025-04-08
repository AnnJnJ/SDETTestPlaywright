import * as dotenv from 'dotenv';
dotenv.config();

export const EnvVariables = {
    OrgUrl: process.env.ORG_URL!
}

export const enum Constants {
    emailStartName = "test-",
    emailDomain = "example.com",
    FilePath = "FileResource/My School Transcript.pdf",
    TextArea = "textarea",
    TagName = "tagName",
    Visible = "visible",
}

export const PersonalInfo = {
    FirstName: "Test",
    LastName: "User",
    PhoneNumber: "+1 123 456 7890",
    StreetAddress: "123 Main Street",
    State: "California",
    City: "Anytown",
    ZipCode: "91234",
    Country: "United States of America"
}

export const Extracurriculars = [
    {
        activity: "Table Tennis",
        totalYears: 1,
        recognitions: "Best Player",
        involvement: "Team Captain"
    },
    {
        activity: "Karate",
        totalYears: 1,
        recognitions: "Best Player",
        involvement: "Team Captain"
    },
    {
        activity: "Swimming",
        totalYears: 1,
        recognitions: "Best Player",
        involvement: "Team Captain"
    },
    {
        activity: "Skating",
        totalYears: 1,
        recognitions: "Best Player",
        involvement: "Team Captain"
    },
];

export const HighSchoolInfo = {
    SchoolName: "SVG High School",
    GPA: "4.0",
    GraduationYear: "2010",
    FileName: "My School Transcript.pdf",
    StreetAddress: "123 Main Street",
    State: "California",
    City: "Anytown",
    ZipCode: "91234",
    GraduationDate: "01/01/2010"
}

export const enum Controls {
    Button = "button",
    TextBox = "textbox",
    Checkbox = "checkbox",
    Option = "option",
    Enter = "Enter"
}

export const Essays = [
    { essayType: "Essay about Animals", value: "Lions are majestic" },
    { essayType: "Essay about School", value: "My school is great" }
]