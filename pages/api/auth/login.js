import { getCsrfToken, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function LoginPage({ csrfToken }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (res.error) {
      toast.error("⛔ ورود ناموفق. ایمیل یا رمز عبور اشتباه است.");
    } else {
      toast.success("✅ ورود موفقیت‌آمیز!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-red-600">
          🔐 ورود به سیستم
        </h1>

        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ایمیل
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            placeholder="ایمیل خود را وارد کنید"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            رمز عبور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            placeholder="رمز عبور خود را وارد کنید"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}