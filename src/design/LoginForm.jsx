import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function LoginForm({ fields, setFields, children }) {
  return (
    <>
      <CardHeader>
        <h1 className="mt-0 text-2xl">Async React Course</h1>
        <Separator className="my-4" />
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              value={fields.username}
              onChange={(e) =>
                setFields((f) => ({ ...f, username: e.target.value }))
              }
              type="email"
              placeholder="m@example.com"
            />
          </Field>
          <Field>
            <div className="flex items-center">
              <FieldLabel htmlFor="password">Password</FieldLabel>
            </div>
            <Input
              id="password"
              value={fields.password}
              onChange={(e) =>
                setFields((f) => ({ ...f, password: e.target.value }))
              }
              type="password"
            />
          </Field>
          <Field>
            {children}
            <FieldDescription className="text-center">
              Don't have an account? <a href="#">Tough!</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
    </>
  );
}
