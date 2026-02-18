export type OnboardingData = {
    // Step 1: Contact
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password?: string;
    // Step 1.5: Service & Location
    serviceTypes?: string[];
    otherService?: string;
    baseLocation?: string;
    serviceRadius?: number;
    // Step 2: Company
    companyName: string;
    companyNumber?: string; // Optional
    officeAddress: string;
    // Step 3: Insurance
    insurerName: string;
    insuranceDocFile?: File | null;
    insuranceDocUrl?: string; // Stored URL
    // Step 4: Awards
    awards?: string;
};

export type StepProps = {
    data: OnboardingData;
    updateData: (fields: Partial<OnboardingData>) => void;
    onNext: () => void;
    onBack: () => void;
    onSubmitFinal?: (awards?: string) => void;
    isSubmitting?: boolean;
};
