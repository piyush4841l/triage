export interface MockAbhaProfile {
  abhaId: string;
  name: string;
  phone: string;
  bloodGroup: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  reportImage?: string; // Path to the uploaded report image in public/images
}

export const MOCK_ABHA_DATABASE: Record<string, MockAbhaProfile> = {
  "11111111111111": {
    abhaId: "11-1111-1111-1111",
    name: "TANMAY CHAUHAN",
    phone: "8546971235",
    bloodGroup: "O+",
    gender: "Male",
    age: 19,
    reportImage: "/images/tanmay-report.jpg"
  },
  "22222222222222": {
    abhaId: "22-2222-2222-2222",
    name: "SHASHWAT SUMAN",
    phone: "7765412340",
    bloodGroup: "B+",
    gender: "Male",
    age: 20,
    reportImage: "/images/shashwat-report.jpg"
  },
  "33333333333333": {
    abhaId: "33-3333-3333-3333",
    name: "MOHINI RATHORE",
    phone: "6541254785",
    bloodGroup: "A+",
    gender: "Female",
    age: 20,
    reportImage: "/images/mohini-report.jpg"
  },
  "44444444444444": {
    abhaId: "44-4444-4444-4444",
    name: "TRIPTI BALI",
    phone: "7896541239",
    bloodGroup: "B+",
    gender: "Female",
    age: 20,
    reportImage: "/images/tripti-report.jpg"
  },
  "55555555555555": {
    abhaId: "55-5555-5555-5555",
    name: "PIYUSH SINGH",
    phone: "7835698740",
    bloodGroup: "A-",
    gender: "Male",
    age: 20,
    reportImage: "/images/piyush-report.jpg"
  },
  "66666666666666": {
    abhaId: "66-6666-6666-6666",
    name: "AADIT GUPTA",
    phone: "9876543210",
    bloodGroup: "AB+",
    gender: "Male",
    age: 20,
    reportImage: "/images/aadit-report.jpg"
  }
};
