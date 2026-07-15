import { useState } from "react";

export default function AuthForm({
  title,
  fields,
  buttonText,
  onSubmit
}) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
        <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-96"
        >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
            {title}
        </h2>

        {fields.map((field) => (
            <input
            key={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            />
        ))}

        {/* 🔽 Custom extra content (location button etc.) */}
        {typeof onSubmit.extraUI === "function" &&
            onSubmit.extraUI({ setFormData, formData })}

        {error && (
            <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}

        <button
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
            {loading ? "Please wait..." : buttonText}
        </button>
        </form>
    </div>
    );

}
