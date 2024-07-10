import { useNavigate } from "react-router";
import { useForm } from "../../hooks/useForm";
import { FormEvent } from "react";
import { Credentials } from "../../../../Backend/src/utils/types/credentials";
import { wrap_in_promise } from "../../../../Backend/src/utils/wrap_in_promis";
import { fetch_post_login } from "../../utils/fetcher";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { reset: usernameReset, ...username } = useForm("text");
  const { reset: passwordReset, ...password } = useForm("text");

  const navigate = useNavigate();

  async function handle_login(e: FormEvent) {
    e.preventDefault();
    navigate("/");

    const credentials: Credentials = {
      username: username.value,
      password: password.value,
    };

    const { data: user, error: user_error } = await wrap_in_promise(
      fetch_post_login(credentials),
    );
    console.log(user);

    if (user instanceof Error) {
      toast.error(user.message);
      return;
    }

    if (user_error) {
      toast.error(user_error.message);
      return;
    }

    usernameReset();
    passwordReset();

    const { error: localStorage_error } = await wrap_in_promise(
      window.localStorage.setItem("logged_in_user", JSON.stringify(user)),
    );

    if (localStorage_error) {
      toast.error(localStorage_error.message);
      return;
    }

    location.reload();
  }

  return (
    <section>
      <form className="flex gap-2" onSubmit={handle_login}>
        <input
          data-testid="username"
          className="border p-1 pl-2 border-zinc-500"
          {...username}
          name="Start"
          placeholder="Username"
          aria-label="Input field for username"
        />
        <input
          data-testid="username"
          className="border p-1 pl-2 border-zinc-500"
          {...password}
          name="Start"
          placeholder="Password"
          type="password"
          aria-label="Input field for username"
        />
        <button
          data-testid="login-button"
          aria-label="Login button"
          className="border border-zinc-500 p-1 px-2 hover:bg-zinc-50 active:bg-white active:border-black"
        >
          Login
        </button>
      </form>
    </section>
  );
}
