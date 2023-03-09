import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { env } from "~/env.mjs";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    async onUnauthenticated() {
      await router.push("/login");
    },
  });

  if (status === "loading") {
    return <div></div>;
  }
  return <Fragment>{children}</Fragment>;
};

export function getServersideProps() {
  return { props: { admin: env.ADMIN_EMAILS } };
}

export default PrivateRoute;
