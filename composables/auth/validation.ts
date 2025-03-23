import { useAuth } from "./useAuth";
import type {
  FormData,
  FormErrors,
  PhoneValidationResult,
} from "~/types/pages/registration-form";
import type { ApiError } from "~/types/directus";

export const useRegistrationForm = () => {
  const {
    registerUser,
    isLoading: authLoading,
    error: authError,
    registrationSuccess,
  } = useAuth();
  const router = useRouter();

  const formData = reactive<FormData>({
    ime: "",
    prezime: "",
    email: "",
    telefon: "",
    lozinka: "",
    potvrdiLozinku: "",
  });

  const errors = reactive<FormErrors>({
    ime: "",
    prezime: "",
    email: "",
    telefon: "",
    lozinka: "",
    potvrdiLozinku: "",
  });

  const phoneValid = ref(true);

  const passwordCriteria = reactive({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const isFormValid = ref(false);
  const isLoading = ref(false);

  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };

  const toggleConfirmPassword = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };

  const validatePhone = (validationResult: PhoneValidationResult) => {
    errors.telefon = "";

    if (!formData.telefon || formData.telefon.trim() === "") {
      phoneValid.value = true;
      checkFormValidity();
      return;
    }

    phoneValid.value = validationResult.isValid;

    if (formData.telefon && !phoneValid.value) {
      errors.telefon = "Unesite ispravan broj telefona";
    }

    checkFormValidity();
  };

  const validateField = (field: keyof FormData) => {
    errors[field] = "";

    switch (field) {
      case "ime":
        if (!formData.ime.trim()) {
          errors.ime = "Ime je obavezno";
        } else if (formData.ime.length < 2) {
          errors.ime = "Ime mora sadržavati najmanje 2 znaka";
        } else if (!/^[A-ZŠĐČĆŽ][a-zšđčćž]+$/.test(formData.ime)) {
          errors.ime = "Ime mora početi velikim slovom i sadržavati samo slova";
        }
        break;

      case "prezime":
        if (!formData.prezime.trim()) {
          errors.prezime = "Prezime je obavezno";
        } else if (formData.prezime.length < 2) {
          errors.prezime = "Prezime mora sadržavati najmanje 2 znaka";
        } else if (!/^[A-ZŠĐČĆŽ][a-zšđčćž]+$/.test(formData.prezime)) {
          errors.prezime =
            "Prezime mora početi velikim slovom i sadržavati samo slova";
        }
        break;

      case "email":
        if (!formData.email.trim()) {
          errors.email = "Email je obavezan";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = "Unesite valjanu email adresu";
        }
        break;

      case "telefon":
        if (formData.telefon && !phoneValid.value) {
          errors.telefon = "Unesite ispravan broj telefona";
        }
        break;

      case "lozinka":
        updatePasswordCriteria();
        if (!formData.lozinka) {
          errors.lozinka = "Lozinka je obavezna";
        } else if (formData.lozinka.length < 8) {
          errors.lozinka = "Lozinka mora sadržavati najmanje 8 znakova";
        } else if (!/[A-Z]/.test(formData.lozinka)) {
          errors.lozinka = "Lozinka mora sadržavati barem jedno veliko slovo";
        } else if (!/[a-z]/.test(formData.lozinka)) {
          errors.lozinka = "Lozinka mora sadržavati barem jedno malo slovo";
        } else if (!/[0-9]/.test(formData.lozinka)) {
          errors.lozinka = "Lozinka mora sadržavati barem jedan broj";
        } else if (!/[!@#$%^&*]/.test(formData.lozinka)) {
          errors.lozinka =
            "Lozinka mora sadržavati barem jedan specijalni znak (!@#$%^&*)";
        }

        if (formData.potvrdiLozinku) {
          validateField("potvrdiLozinku");
        }
        break;

      case "potvrdiLozinku":
        if (!formData.potvrdiLozinku) {
          errors.potvrdiLozinku = "Potvrda lozinke je obavezna";
        } else if (formData.lozinka !== formData.potvrdiLozinku) {
          errors.potvrdiLozinku = "Lozinke se ne podudaraju";
        }
        break;
    }

    checkFormValidity();
  };

  const updatePasswordCriteria = () => {
    passwordCriteria.length = formData.lozinka.length >= 8;
    passwordCriteria.uppercase = /[A-Z]/.test(formData.lozinka);
    passwordCriteria.lowercase = /[a-z]/.test(formData.lozinka);
    passwordCriteria.number = /[0-9]/.test(formData.lozinka);
    passwordCriteria.special = /[!@#$%^&*]/.test(formData.lozinka);
  };

  const checkFormValidity = () => {
    const requiredFields: (keyof FormData)[] = [
      "ime",
      "prezime",
      "email",
      "lozinka",
      "potvrdiLozinku",
    ];
    const hasAllRequiredFields = requiredFields.every(
      (field) => formData[field].trim() !== ""
    );
    const hasNoErrors = Object.values(errors).every((error) => error === "");

    const isPhoneValid = !formData.telefon || phoneValid.value;

    isFormValid.value = hasAllRequiredFields && hasNoErrors && isPhoneValid;
  };

  watch(
    () => authLoading.value,
    (newValue) => {
      isLoading.value = newValue;
    }
  );

  watch(
    () => authError.value,
    (newError) => {
      if (newError) {
        if (newError.includes("Email")) {
          errors.email = newError;
        } else {
          errors.email = newError;
        }
      }
    }
  );

  const handleSubmit = async () => {
    validateField("ime");
    validateField("prezime");
    validateField("email");
    validateField("telefon");
    validateField("lozinka");
    validateField("potvrdiLozinku");

    if (!isFormValid.value) {
      return null;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.lozinka,
        first_name: formData.ime,
        last_name: formData.prezime,
        telefon: formData.telefon || undefined,
      };

      const success = await registerUser(userData);

      if (success) {
        registrationSuccess.value = true;

        const { $toast } = useNuxtApp();

        try {
          $toast.success(
            "Uspješna registracija! Provjerite svoj email za potvrdu računa."
          );
        } catch (toastError) {
          console.error("Toast error:", toastError);
          alert(
            "Uspješna registracija! Provjerite svoj email za potvrdu računa."
          );
        }

        setTimeout(() => {
          router.push("/auth/prijava");
        }, 3000);

        return true;
      } else {
        const { $toast } = useNuxtApp();
        $toast.error(authError.value || "Registracija nije uspjela");
        return false;
      }
    } catch (err: unknown) {
      console.error("Registration submission error:", err);

      const { $toast } = useNuxtApp();

      let errorMessage =
        "Došlo je do greške prilikom registracije. Pokušajte ponovno.";

      if (err && typeof err === "object") {
        if ("message" in err) {
          errorMessage = (err as Error).message;
        }

        const apiError = err as ApiError;
        if (apiError.errors && apiError.errors.length > 0) {
          const firstError = apiError.errors[0];

          if (firstError.extensions?.code === "RECORD_NOT_UNIQUE") {
            errorMessage = "Korisnik s ovom email adresom već postoji";
            errors.email = errorMessage;
          } else if (firstError.message.includes("email")) {
            errorMessage = firstError.message;
            errors.email = errorMessage;
          }
        }
      }

      $toast.error(errorMessage);
      return false;
    }
  };
  onMounted(() => {
    phoneValid.value = true;

    checkFormValidity();
  });

  watch(
    () => formData.lozinka,
    () => {
      updatePasswordCriteria();
    }
  );

  watch(
    formData,
    () => {
      checkFormValidity();
    },
    { deep: true }
  );

  return {
    formData,
    errors,
    passwordCriteria,
    showPassword,
    showConfirmPassword,
    isFormValid,
    isLoading,
    registrationSuccess,
    togglePassword,
    toggleConfirmPassword,
    validateField,
    handleSubmit,
    validatePhone,
  };
};
