// Phone number utilities for proper formatting and validation

export interface CountryCode {
  code: string
  name: string
  flag: string
  example: string
}

// Common country codes with their flags and examples
export const COUNTRY_CODES: CountryCode[] = [
  { code: '+1', name: 'United States', flag: '🇺🇸', example: '+1 555 123 4567' },
  { code: '+1', name: 'Canada', flag: '🇨🇦', example: '+1 555 123 4567' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', example: '+44 20 7946 0958' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', example: '+49 30 12345678' },
  { code: '+33', name: 'France', flag: '🇫🇷', example: '+33 1 23 45 67 89' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', example: '+39 06 1234 5678' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', example: '+34 91 123 45 67' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', example: '+31 20 123 4567' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪', example: '+32 2 123 45 67' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', example: '+41 44 123 45 67' },
  { code: '+43', name: 'Austria', flag: '🇦🇹', example: '+43 1 123 4567' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰', example: '+45 12 34 56 78' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', example: '+46 8 123 456 78' },
  { code: '+47', name: 'Norway', flag: '🇳🇴', example: '+47 12 34 56 78' },
  { code: '+358', name: 'Finland', flag: '🇫🇮', example: '+358 9 123 4567' },
  { code: '+7', name: 'Russia', flag: '🇷🇺', example: '+7 495 123 45 67' },
  { code: '+86', name: 'China', flag: '🇨🇳', example: '+86 138 0013 8000' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', example: '+81 3 1234 5678' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷', example: '+82 2 1234 5678' },
  { code: '+91', name: 'India', flag: '🇮🇳', example: '+91 98765 43210' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', example: '+61 2 1234 5678' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', example: '+64 9 123 4567' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷', example: '+55 11 9 1234 5678' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽', example: '+52 55 1234 5678' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷', example: '+54 9 11 1234 5678' },
  { code: '+56', name: 'Chile', flag: '🇨🇱', example: '+56 9 1234 5678' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴', example: '+57 1 234 5678' },
  { code: '+51', name: 'Peru', flag: '🇵🇪', example: '+51 1 234 5678' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪', example: '+58 212 123 4567' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨', example: '+593 2 123 4567' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾', example: '+598 2 123 4567' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾', example: '+595 21 123 4567' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴', example: '+591 2 123 4567' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', example: '+27 11 123 4567' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬', example: '+20 2 1234 5678' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬', example: '+234 1 234 5678' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪', example: '+254 20 123 4567' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭', example: '+233 24 123 4567' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦', example: '+212 5 1234 5678' },
  { code: '+213', name: 'Algeria', flag: '🇩🇿', example: '+213 21 123 4567' },
  { code: '+216', name: 'Tunisia', flag: '🇹🇳', example: '+216 71 123 456' },
  { code: '+218', name: 'Libya', flag: '🇱🇾', example: '+218 21 123 4567' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦', example: '+966 50 123 4567' },
  { code: '+971', name: 'UAE', flag: '🇦🇪', example: '+971 50 123 4567' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦', example: '+974 50 123 4567' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼', example: '+965 5012 3456' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭', example: '+973 50 123 4567' },
  { code: '+968', name: 'Oman', flag: '🇴🇲', example: '+968 50 123 4567' },
  { code: '+964', name: 'Iraq', flag: '🇮🇶', example: '+964 750 123 4567' },
  { code: '+98', name: 'Iran', flag: '🇮🇷', example: '+98 21 1234 5678' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷', example: '+90 212 123 45 67' },
  { code: '+972', name: 'Israel', flag: '🇮🇱', example: '+972 50 123 4567' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧', example: '+961 1 123 456' },
  { code: '+963', name: 'Syria', flag: '🇸🇾', example: '+963 11 123 4567' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴', example: '+962 6 123 4567' },
  { code: '+970', name: 'Palestine', flag: '🇵🇸', example: '+970 2 123 4567' },
]

/**
 * Normalizes a phone number to international format
 * @param phoneNumber - The phone number to normalize
 * @param countryCode - Optional country code to use if not present
 * @returns Normalized phone number in international format
 */
export function normalizePhoneNumber(phoneNumber: string, countryCode?: string): string {
  if (!phoneNumber) return ''
  
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // If it already starts with +, return as is
  if (cleaned.startsWith('+')) {
    return cleaned
  }
  
  // If no country code provided, try to detect or return original
  if (!countryCode) {
    return phoneNumber
  }
  
  // Add country code if not present
  if (!countryCode.startsWith('+')) {
    countryCode = '+' + countryCode
  }
  
  return countryCode + cleaned
}

/**
 * Formats a phone number for WhatsApp URL
 * @param phoneNumber - The phone number to format
 * @returns Phone number formatted for WhatsApp URL (digits only, no +)
 */
export function formatForWhatsApp(phoneNumber: string): string {
  if (!phoneNumber) return ''
  
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // If it starts with +, remove it
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1)
  }
  
  return cleaned
}

/**
 * Validates if a phone number is in correct international format
 * @param phoneNumber - The phone number to validate
 * @param countryCode - Optional country code to use for validation
 * @returns Object with validation result and error message
 */
export function validatePhoneNumber(phoneNumber: string, countryCode?: string): { isValid: boolean; error?: string } {
  if (!phoneNumber) {
    return { isValid: false, error: 'Phone number is required' }
  }
  
  // Remove all non-digit characters except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '')
  
  // If country code is provided, validate against it
  if (countryCode) {
    const countryCodeDigits = countryCode.replace(/[^\d]/g, '')
    const phoneDigits = cleaned.replace(/[^\d]/g, '')
    
    // Check if phone number starts with country code
    if (phoneDigits.startsWith(countryCodeDigits)) {
      // Full international number provided
      if (phoneDigits.length < 10) {
        return { isValid: false, error: `Phone number is too short (${phoneDigits.length} digits). International numbers need at least 10 digits.` }
      }
      
      // Special validation for Kuwait numbers
      if (countryCodeDigits === '965' && phoneDigits.length < 11) {
        return { isValid: false, error: `Kuwait mobile numbers need 8 digits after country code (e.g., 50123456). You entered ${phoneDigits.length - 3} digits.` }
      }
      if (phoneDigits.length > 15) {
        return { isValid: false, error: 'Phone number is too long' }
      }
      return { isValid: true }
    } else {
      // Local number provided, validate length
      if (phoneDigits.length < 7) {
        return { isValid: false, error: `Local number is too short (${phoneDigits.length} digits). Most countries need 7-8 digits.` }
      }
      if (phoneDigits.length > 12) {
        return { isValid: false, error: 'Phone number is too long' }
      }
      return { isValid: true }
    }
  }
  
  // Fallback to original validation if no country code provided
  if (!cleaned.startsWith('+')) {
    return { isValid: false, error: 'Phone number must include country code (e.g., +1, +44, +91)' }
  }
  
  // Must have at least 7 digits (minimum for international number)
  const digitsOnly = cleaned.substring(1)
  if (digitsOnly.length < 7) {
    return { isValid: false, error: 'Phone number is too short' }
  }
  
  // Must not be too long (maximum 15 digits for international number)
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number is too long' }
  }
  
  return { isValid: true }
}

/**
 * Generates WhatsApp URL from phone number
 * @param phoneNumber - The phone number to convert to WhatsApp URL
 * @returns WhatsApp URL or null if invalid
 */
export function generateWhatsAppUrl(phoneNumber: string): string | null {
  if (!phoneNumber) {
    return null
  }
  
  // Clean the phone number and ensure it has proper format
  let cleanedNumber = phoneNumber.replace(/[^\d+]/g, '')
  
  // If it doesn't start with +, we need to add a country code
  if (!cleanedNumber.startsWith('+')) {
    // Try to detect country code from the number
    const detectedCountry = detectCountryCode('+' + cleanedNumber)
    if (detectedCountry) {
      cleanedNumber = '+' + cleanedNumber
    } else {
      // If we can't detect, assume it's a local number and return null
      // This prevents invalid URLs
      return null
    }
  }
  
  // Validate the international format
  const validation = validatePhoneNumber(cleanedNumber)
  if (!validation.isValid) {
    return null
  }
  
  const whatsappNumber = formatForWhatsApp(cleanedNumber)
  return `https://wa.me/${whatsappNumber}`
}

/**
 * Detects country code from phone number
 * @param phoneNumber - The phone number to analyze
 * @returns Country code object or null if not found
 */
export function detectCountryCode(phoneNumber: string): CountryCode | null {
  if (!phoneNumber || !phoneNumber.startsWith('+')) {
    return null
  }
  
  // Try to match country codes (longest first to avoid partial matches)
  const sortedCodes = COUNTRY_CODES.sort((a, b) => b.code.length - a.code.length)
  
  for (const country of sortedCodes) {
    if (phoneNumber.startsWith(country.code)) {
      return country
    }
  }
  
  return null
}

/**
 * Gets the full international number from local number and country code
 * @param phoneNumber - The local phone number
 * @param countryCode - The country code (e.g., "+965")
 * @returns Full international number
 */
export function getFullInternationalNumber(phoneNumber: string, countryCode: string): string {
  if (!phoneNumber || !countryCode) return phoneNumber
  
  // Clean the inputs
  const cleanedNumber = phoneNumber.replace(/[^\d]/g, '')
  const cleanedCountryCode = countryCode.replace(/[^\d]/g, '')
  
  // If number already starts with country code, return as is
  if (cleanedNumber.startsWith(cleanedCountryCode)) {
    return '+' + cleanedNumber
  }
  
  // Combine country code with local number
  return '+' + cleanedCountryCode + cleanedNumber
}

/**
 * Formats phone number for display
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number for display
 */
export function formatPhoneDisplay(phoneNumber: string): string {
  if (!phoneNumber) return ''
  
  const validation = validatePhoneNumber(phoneNumber)
  if (!validation.isValid) {
    return phoneNumber // Return original if invalid
  }
  
  const country = detectCountryCode(phoneNumber)
  if (country) {
    return `${country.flag} ${phoneNumber}`
  }
  
  return phoneNumber
}
