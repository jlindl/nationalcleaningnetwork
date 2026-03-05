export type OnboardingData = {
    leadId?: string;
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
    logoFile?: File | null;
    logoUrl?: string; // Stored URL
    // Step 3 (Now Verification Dashboard only): Insurance
    insurerName?: string;
    insuranceDocFile?: File | null;
    insuranceDocUrl?: string; // Stored URL
    // Dashboard Only: Awards
    awards?: string;
};

export type StepProps = {
    data: Partial<OnboardingData>;
    updateData: (fields: Partial<OnboardingData>) => void;
    onNext?: () => void;
    onBack?: () => void; // Made optional as first step might not have back
    onSubmitFinal?: (awards?: string) => void;
    isSubmitting?: boolean;
};
