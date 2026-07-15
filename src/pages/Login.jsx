import AuthForm from "../components/AuthForm";
import { login } from "../services/authApi";

export default function Login() {
  const handleLogin = async (data) => {
    const res = await login(data);

    // store JWT
    localStorage.setItem("token", res.token);

    // role-based redirect
    if (res.user.role === "admin") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/citizen/home";
    }
  };

  return (
    <AuthForm
      title="Login to PublicSeva"
      buttonText="Login"
      onSubmit={handleLogin}
      fields={[
        {
          name: "email",
          type: "email",
          placeholder: "Email",
          required: true
        },
        {
          name: "password",
          type: "password",
          placeholder: "Password",
          required: true
        }
      ]}
    />
  );
}
