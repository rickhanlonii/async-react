import { useRouter } from "@/router/index.jsx";
import { login, prefetchLessons } from "@/data/index.js";
import { useState, ViewTransition } from "react";
import * as Design from "@/design";

const initialFieldData = {
  username: "hi@react.dev",
  password: "reactisgoodactually",
};

export default function Login() {
  const router = useRouter();
  const [fields, setFields] = useState(initialFieldData);

  async function submitAction() {
    /**
     * Since we're in an Action we know we're in a transition.
     * This means we can await the login POST, and the pending state of
     * the action will be true until both the POST, and the navigation
     * after it is done.
     */
    await login(fields.username, fields.password);

    /**
     * Here we're pre-fetching the lessons data before navigating to
     * the home page. This allows the login to complete to the full content
     * as long as the data returns within 1s. Otherwise, the prefetch resolves
     * without the data, and the login will navigate to the page with fallbacks
     * while the data finishes loading.
     */
    await prefetchLessons();
    /**
     * This will navigate to a new page. Since the page is new, the transition
     * will complete to the suspended fallback state. Typically, you could
     * avoid the fallback state by using Activity, but in the login case,
     * you cannot load the new page until after the login is done, since
     * the resources to load are behind an auth wall.
     */
    router.navigate("/");
  }
  return (
    <Design.LoginForm fields={fields} setFields={setFields}>
      {/*
         Design.Button using the action prop pattern to automatically 
         show a loading state and disable the button while the action is pending.
      */}
      <Design.Button action={submitAction}>Login</Design.Button>
    </Design.LoginForm>
  );
}
