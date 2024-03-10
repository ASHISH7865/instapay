export type OnboardingFormValuesType = {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  primaryEmailAddresses: string;
  gender: 'male' | 'female' | 'other';
  phoneNumbers: string;
  addresses: Address;

  walletSecurityPreferences: WalletSecurityPreferences;
  currencyPreferences: Currency;
  usagePreferences: 'Personal' | 'Business' | 'Testing' | 'Other';
};

interface Address {
  streetAddress?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
}

interface WalletSecurityPreferences {
  passwordType: 'PIN';
  value: string;
}

type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'Other'; // Add more supported currencies as needed
