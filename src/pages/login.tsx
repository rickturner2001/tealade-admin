import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Button, Form, Input, type InputRef, Typography } from "antd";
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem";
import AdminDashboardLayout from "~/components/layout/AdminDashboardLayout";

const { Title, Text } = Typography;

const SignIn = () => {
  const { status } = useSession();
  const router = useRouter();

  const emailRef = useRef<InputRef>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.back();
    }
  }, [status, router]);

  if (status === "loading") {
    return <div></div>;
  }

  const handleSubmission = () => {
    // Get the value of the input element
    const emailValue = emailRef?.current?.input?.value;
    if (emailValue) {
      signIn("email", {
        email: emailValue,
      }).catch((e) => console.error(e));

      localStorage.setItem("emailVerification", emailValue);
    }
  };

  return (
    <AdminDashboardLayout
      breadCrumbs={[<BreadcrumbItem key={"login"}>Login</BreadcrumbItem>]}
    >
      <div className="mx-auto flex h-[70vh]  w-full max-w-lg flex-col items-center justify-center">
        <div className="w-full rounded-xl bg-white p-8 shadow-md">
          <Title className="text-center">Sign in to Tealade</Title>
          <Text className="text-center">
            Sign in with ease and speed! Choose email or Google to log in and
            enjoy a seamless experience.
          </Text>
          <Form
            className="mt-12 w-full"
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="Email"
              rules={[{ required: true, message: "Please input your email!" }]}
              className="w-full"
            >
              <Input
                placeholder="Your email"
                ref={emailRef}
                className="w-full"
              />
            </Form.Item>

            <Form.Item className="w-full">
              <Button type="default" block onClick={handleSubmission}>
                Sign in
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => signIn("google").catch((e) => console.error(e))}
                block
                className="w-full bg-blue-500"
              >
                Sign in with google
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

const signin = () => {
  return <SignIn />;
};

export default signin;
