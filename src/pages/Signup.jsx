import AuthForm from "../components/AuthForm";
import { signup } from "../services/authApi";

export default function Signup() {
  const handleSignup = async (data) => {
    if (!data.location) {
      throw new Error("Please fetch location before signing up");
    }

    const payload = {
      ...data,
      role: "citizen",
      state: "Maharashtra",
      district: "Mumbai Suburban"
    };

    await signup(payload);
    alert("Signup successful! Please login.");
  };

  // 👇 attach extra UI
  handleSignup.extraUI = ({ setFormData, formData }) => {
    const fetchLocation = () => {
      if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;

          setFormData({
            ...formData,
            address: "Auto-detected location",
            location: {
              type: "Point",
              coordinates: [longitude, latitude]
            }
          });
        },
        () => alert("Location permission denied")
      );
    };

    return (
      <>
        <button
          type="button"
          onClick={fetchLocation}
          className="w-full mb-4 border border-green-600 text-green-700 py-2 rounded hover:bg-green-50"
        >
          📍 Fetch Location
        </button>

        {formData.location && (
          <p className="text-sm text-green-600 text-center mb-2">
            Location fetched successfully
          </p>
        )}
      </>
    );
  };

  return (
    <AuthForm
      title="Create Account"
      buttonText="Sign Up"
      onSubmit={handleSignup}
      fields={[
        { name: "name", type: "text", placeholder: "Full Name", required: true },
        { name: "email", type: "email", placeholder: "Email", required: true },
        { name: "phone", type: "text", placeholder: "Phone", required: true },
        { name: "password", type: "password", placeholder: "Password", required: true }
      ]}
    />
  );
}
