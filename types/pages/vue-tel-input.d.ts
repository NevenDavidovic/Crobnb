declare module "vue-tel-input" {
  import { DefineComponent } from "vue";

  export const VueTelInput: DefineComponent<
    {
      modelValue?: string;
      placeholder?: string;
      disabledFetchingCountry?: boolean;
      disabled?: boolean;
      disabledFormatting?: boolean;
      mode?: string;
      invalidMsg?: string;
      required?: boolean;
      allCountries?: any[];
      defaultCountry?: string;
      preferredCountries?: string[];
      onlyCountries?: string[];
      ignoredCountries?: string[];
      autocomplete?: string;
      name?: string;
      maxLen?: number;
      wrapperClasses?: string;
      inputClasses?: string;
      inputId?: string;
      dropdownOptions?: any;
      inputOptions?: any;
      validCharactersOnly?: boolean;
      autoFormat?: boolean;
    },
    any,
    any
  >;

  export interface PhoneValidationResult {
    isValid: boolean;
    number: string;
    country: {
      name: string;
      iso2: string;
      dialCode: string;
    };
    formatted: string;
  }
}
