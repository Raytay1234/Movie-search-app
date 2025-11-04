import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthInput from "../components/AuthInput";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const [form, setForm] = useState({ email: "", password: "" });
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(form.email, form.password);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center from-purple-600 to-pink-500 bg-linear-to-br">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Create an Account ✨
                </h2>

                <form onSubmit={handleSubmit}>
                    <AuthInput
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email"
                    />
                    <AuthInput
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                    />

                    <button
                        type="submit"
                        className="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-pink-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
