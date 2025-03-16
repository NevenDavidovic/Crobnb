import { reactive, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "./useAuth";
import type {
  FormData,
  FormErrors,
  PhoneValidationResult,
} from "~/types/pages/registration-form";

export const useRegistrationForm = () => {
  // Get the auth composable for registration
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

  // Update isLoading to reflect auth loading state
  watch(
    () => authLoading.value,
    (newValue) => {
      isLoading.value = newValue;
    }
  );

  // Watch for auth errors and display them in the form
  watch(
    () => authError.value,
    (newError) => {
      if (newError) {
        if (newError.includes("Email")) {
          errors.email = newError;
        } else {
          // Show general error in email field
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
    console.log("START");

    if (!isFormValid.value) {
      console.log("Form is invalid, stopping submission");
      return null;
    }

    console.log("Form is valid, proceeding with submission");

    try {
      const userData = {
        email: formData.email,
        password: formData.lozinka,
        first_name: formData.ime,
        last_name: formData.prezime,
        telefon: formData.telefon || undefined,
      };

      const { error: authError } = useAuth();

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
        if (authError.value) {
          const { $toast } = useNuxtApp();
          $toast.error(authError.value);

          if (authError.value.includes("email")) {
            errors.email = authError.value;
          }
        } else {
          const { $toast } = useNuxtApp();
          $toast.error(
            "Došlo je do greške prilikom registracije. Pokušajte ponovno."
          );
        }
        return false;
      }
    } catch (err: any) {
      console.error("Registration submission error:", err);

      if (err.errors && Array.isArray(err.errors)) {
        console.error("API validation errors:", err.errors);
      }

      try {
        const { $toast } = useNuxtApp();
        $toast.error(
          "Došlo je do greške prilikom registracije. Pokušajte ponovno."
        );
      } catch (toastError) {
        console.error("Toast error:", toastError);
        alert("Došlo je do greške prilikom registracije. Pokušajte ponovno.");
      }

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
