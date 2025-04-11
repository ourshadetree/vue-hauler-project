<template>
  <div id="authContainer">
    <h1>Sign Up</h1>
    <form @submit.prevent="handleSignUp">
      <input v-model="firstName" type="text" placeholder="First Name" />
      <input v-model="lastName" type="text" placeholder="Last Name" />
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="confirmEmail" type="email" placeholder="Confirm Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
      
      <!-- New fields to be added to user_profiles -->
      <input v-model="companyName" type="text" placeholder="Company Name" />
      <input v-model="dotNumber" type="number" placeholder="DOT Number" />
      <input v-model="businessPhone" type="text" placeholder="Business Phone" />
      <input v-model="numberOfTrucks" type="number" placeholder="Number of Trucks" />
      
      <!-- Drop down for fleet type -->
      <select v-model="fleetType">
        <option value="" disabled selected>Fleet Type</option>
        <option value="heavy">Heavy</option>
        <option value="mixed">Mixed</option>
        <option value="light">Light</option>
      </select>
      
      <button type="submit">Create Account</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from '@/../supabaseClient';

export default {
  name: "SignUpForm",
  setup() {
    const router = useRouter();

    // Form fields
    const email = ref("");
    const confirmEmail = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const firstName = ref("");
    const lastName = ref("");

    // New fields for user_profiles
    const companyName = ref("");
    const dotNumber = ref("");  // Note: This value could be stored as string or number depending on your schema.
    const businessPhone = ref("");
    const numberOfTrucks = ref("");
    const fleetType = ref("");

    // Feedback messages
    const errorMessage = ref("");
    const successMessage = ref("");

    // Sign Up Handler
    const handleSignUp = async () => {
      try {
        errorMessage.value = "";
        successMessage.value = "";

        // 1) Check if emails match
        if (
          email.value.trim().toLowerCase() !== confirmEmail.value.trim().toLowerCase()
        ) {
          throw new Error("Emails do not match.");
        }

        // 2) Check if passwords match
        if (password.value !== confirmPassword.value) {
          throw new Error("Passwords do not match.");
        }

        // 3) Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email: email.value,
          password: password.value,
        });

        if (error) throw error;
        if (!data?.user) {
          throw new Error("No user returned from signUp.");
        }

        // 4) Insert into user_profiles with additional fields
        const { error: profileError } = await supabase.from("user_profiles").insert([
          {
            id: data.user.id,
            first_name: firstName.value || null,
            last_name: lastName.value || null,
            company_name: companyName.value || null,
            dot_number: dotNumber.value || null,
            business_phone: businessPhone.value || null,
            number_of_trucks: numberOfTrucks.value || null,
            fleet_type: fleetType.value || null,
          },
        ]);

        if (profileError) throw profileError;

        // Success Feedback
        successMessage.value =
          "Account created! Please check your email for verification.";

        // Redirect to sign in after a short delay
        setTimeout(() => router.push("/signin"), 2000);
      } catch (err) {
        errorMessage.value = err.message || "Unknown error.";
      }
    };

    return {
      email,
      confirmEmail,
      password,
      confirmPassword,
      firstName,
      lastName,
      companyName,
      dotNumber,
      businessPhone,
      numberOfTrucks,
      fleetType,
      errorMessage,
      successMessage,
      handleSignUp,
    };
  },
};
</script>

<style scoped>
/* Container */
#authContainer {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding: 40px;
  border-radius: 8px;
  background-color: #ffffff; /* White background */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Karla', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

/* Heading using Sora */
h1 {
  font-family: 'Sora', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
  color: #0c2442; /* Dark Blue */
  font-weight: 900;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

/* Form Styles */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

form input,
form select {
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #e5e5e5; /* Grey border */
  font-size: 1rem;
  font-family: 'Karla', sans-serif;
  color: #0c2442;
}

/* Button */
form button {
  padding: 12px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  background-color: #b11818; /* Red accent */
  color: #ffffff;
  font-size: 1rem;
  font-family: 'Sora', sans-serif;
  transition: background-color 0.3s;
}

form button:hover {
  background-color: #8f1212; /* Slightly darker red */
}

/* Feedback messages */
.error {
  color: #b11818;
  margin-top: 10px;
}

.success {
  color: #28a745;
  margin-top: 10px;
}
</style>
