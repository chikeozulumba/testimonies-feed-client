'use client';
import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { AUTH_PROVIDERS, NAVIGATION_LINKS_PATH } from "@/constants";
import { signUpWithSocialAccount } from "@/lib/firebase/auth";
import { SignUpWithSocialAccountProvider } from "../../../definition";

export default function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params?.get("redirect");

  const handleAuthentication = async (
    provider: SignUpWithSocialAccountProvider
  ): Promise<boolean | void> => {
    const { error, response } = await signUpWithSocialAccount(provider);
    if (error || !response) {
      return;
    }

    const idTokenResult = await response.getIdTokenResult();
    await fetch("/api/login", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idTokenResult.token}`,
      },
    });

    return router.replace(redirect ?? NAVIGATION_LINKS_PATH.Home);
  };

  return (
    <Center minHeight={"100vh"} height={"100%"}>
      <Stack spacing={2} align={"center"} maxW={"md"} w={"full"}>
        {/* Google */}
        <Button
        backgroundColor={'white'}
          onClick={() => handleAuthentication(AUTH_PROVIDERS.Google)}
          w={"full"}
          variant={"outline"}
          leftIcon={<FcGoogle />}
        >
          <Center>
            <Text>Continue with Google</Text>
          </Center>
        </Button>
      </Stack>
    </Center>
  );
}
