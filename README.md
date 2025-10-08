# Async React Demo

The final state of the React Conf 2025 Async React talk.

View the app: https://async-react.dev/

## Setup

Install:

```bash
yarn
```

Run the frontend:
```bash
yarn dev
```

Optional: you can use a real backend by updating `.env` to:

```
VITE_USE_REAL_SERVER=true
```

And run the backend:
```
yarn server
```

This is useful when viewing React Performance Tracks because you can see the real network requests.

## Motivation

This repo shows the future vision for how product code will be written in React without needing additional APIs.

This is possible, but implementing Async React features in:
- **Routing**: The router uses transitions by default, so users don't need to wrap navigation updates in additional transitions.
- **Data Fetching**: The data fetching layer uses suspense by default, so users can use transitions and suspense throughout their app.
- **Design Components**: The design components expose `action` props so callbacks are in async transitions by default. To provide user feedback, these components also use optimistic updates to automatically show results and delayed loading states, no matter what the product code does in the action.

In the app, there is a network debugger at the bottom. By changing the timing for events, you can see the experience for:
- **Fast network (<150ms)**: No loading states, the app performs and feels synchronous.
- **Slow network (>150ms)**: Automatically displays loading states, and batches updates to prevent async bugs.

## Examples

### Login

Our code for the login form is simple and declarative:

```js
export default function Login() {
  const router = useRouter();
  const [fields, setFields] = useState(initialFieldData);

  async function submitAction() {
    await login(fields.username, fields.password);
    await prefetchLessons();
    router.navigate("/");
  }
  return (
    <Design.LoginForm fields={fields} setFields={setFields}>
      <Design.Button action={submitAction}>Login</Design.Button>
    </Design.LoginForm>
  );
}
```

When network is fast, login will instantly navigate to the logged in page, with no visible loading states:

https://github.com/user-attachments/assets/6088811c-2a0f-4a14-a3bd-4a96b7dc12a8

When network is slow, but under a second, the prefetching allows us to still animate in the logged in page without a glimmer:

https://github.com/user-attachments/assets/51a158cc-f345-47d1-8408-bfdb48d3ba59

When network is over 1s, we animate to fallbacks while the data loads:

https://github.com/user-attachments/assets/6c04346e-903e-461c-b76e-b35b4c537698

### Home

Our code for the home page is also simple and declarative:

```js
export default function Home() {
  const router = useRouter();
  const search = router.search.q || "";
  const tab = router.search.tab || "all";

  function searchAction(value) {
    router.setParams("q", value);
  }
  function tabAction(value) {
    router.setParams("tab", value);
  }
  async function completeAction(id) {
    await data.mutateToggle(id);
    router.refresh();
  }
  return (
    <>
      <Design.SearchInput value={search} changeAction={searchAction} />
      <Design.TabList activeTab={tab} changeAction={tabAction}>
        <Suspense fallback={<Design.FallbackList />}>
          <LessonList
            tab={tab}
            search={search}
            completeAction={completeAction}
          />
        </Suspense>
      </Design.TabList>
    </>
  );
}
```

When network is fast, the app feels like it's synchronous:

https://github.com/user-attachments/assets/578a235c-92d7-467b-9664-16ec48f9555c

As network slows, the app will automatically show loading states:

https://github.com/user-attachments/assets/621f1789-19b0-4f29-b00e-55fd0b893cab

# Async React Working Group

At React Conf 2025, we announced a new working group to make Async React the default for React apps.

Check out the [Async React Working Group](https://github.com/reactwg/async-react/discussions) to follow the progress.
