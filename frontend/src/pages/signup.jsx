import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [skillsText, setSkillsText] = useState("");
  const [skillsArray, setSkillsArray] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillsText(value);
    // Split the input by commas and trim whitespace
    const skills = value.split(",").map((skill) => skill.trim()).filter(Boolean);
    setSkillsArray(skills);
    setForm((prev) => ({ ...prev, skills }));
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // import.meta.env.VITE_SERVER_URL is used to access the environment variable defined in .env file at the frontend.
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        toast.success("Signup Successful! Please login to continue.");
    
        navigate("/login");
      } else {
        toast.error("Signup failed: " + data.message);
        console.error("Signup error:", data);
      }
    } catch (err) {
      toast.error("Signup issue:", err);
      
    } finally {
      setLoading(false);
      // navigate("/login"); // Redirect to login after signup
      form.name = "";
      form.email = "";
      form.password = "";
      form.role = "";
      setSkillsText("");
      setSkillsArray([]);
    }

    // toast.success("Signup Successful! Please login to continue.");
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="min-h-screen bg-base-200 flex items-center align-center p-4">
        <div className="card w-full max-w-md shadow-xl bg-base-100">
          <div className="card-body">
            <h1 className="card-title text-2xl">Create your account</h1>
            <p className="text-sm opacity-70">
              Sign up with your basic details below.
            </p>

            <div className="mt-4 flex flex-col gap-4 items-center align-center">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label" htmlFor="name">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    onChange={handleChange}
                    value={form.name}
                    type="text"
                    placeholder="Your full name"
                    className="input input-bordered"
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered"
                    autoComplete="email"
                    required
                  />
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                    <span className="label-text-alt">min 6 chars</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input input-bordered w-full pr-16"
                      autoComplete="new-password"
                      required
                      minLength={6}
                    />

                    <div>
                      <label
                        htmlFor="skills"
                        className="block mb-2 font-semibold"
                      >
                        Skills (comma separated)
                      </label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={skillsText}
                        onChange={handleSkillsChange}
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="textarea textarea-bordered w-full"
                      ></textarea>
                   
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm absolute top-1/2 -translate-y-1/2 right-2"
                      onClick={() => setShowPwd((s) => !s)}
                      // aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {/* {showPwd ? "Hide" : "Show"} */}
                    </button>
                  </div>
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="role">
                    <span className="label-text">Role: </span>
                  </label>
                  <select
                    className="text-black select select-bordered w-full"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div className="form-control mt-6 flex items-center justify-between">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Sign up
                  </button>
                </div>
                <div className="text-sm mt-2">
                  Already have an account?
                  <button
                    className="link link-primary"
                    onClick={() => navigate("/login")}
                  >
                    Login here
                  </button>
                  </div>
              </form>
            </div>

            {/* Helper text */}
            <div className="text-xs opacity-60 mt-2">
              <p>
                By signing up, you agree to our Terms and acknowledge our
                Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
