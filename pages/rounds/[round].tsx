import {
  Code,
  Container,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { assert } from "@cosmjs/utils";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";

import { GlobalContext } from "../../lib/GlobalState";
import { VerifiedBeacon } from "../../lib/beacons";
import Link from "next/link";

const Round: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [beacon, setBeacon] = useState<VerifiedBeacon | null | undefined>(undefined);
  const { ready, getBeacon } = useContext(GlobalContext);

  const router = useRouter();
  const { round } = router.query;
  assert(!Array.isArray(round));

  useEffect(() => {
    if (!ready) return;

    setLoading(true);

    const numRound = parseInt(round ?? "0", 10);
    getBeacon(numRound)
      .then(
        (beacon) => {
          setBeacon(beacon);
        },
        (err) => console.error(err),
      )
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <>
      <Head>
        <title>Nois Oracle Round #{round}</title>
      </Head>
      <HStack padding="20px" direction="row">
        <Link href="/">
          <IconButton colorScheme="gray" aria-label="Home" size="md" icon={<FaHome />} />
        </Link>
        <Spacer />
      </HStack>
      <Container maxW="800px" paddingTop="5px" paddingBottom="25px">
        {loading && (
          <Stack spacing="25px">
            <Skeleton height="150px" />
            <Skeleton height="150px" />
            <Skeleton height="150px" />
            <Skeleton height="150px" />
            <Skeleton height="150px" />
          </Stack>
        )}

        <Stack>
          <Heading size="lg">Round #{round}</Heading>
          {beacon ? (
            <Text>
              Published: {beacon.published.toUTCString()}
              <br />
              Verified: {beacon.verified.toUTCString()} ({beacon.diff.toFixed(1)}s)
              <br />
              <Code>{beacon.randomness}</Code>
            </Text>
          ) : (
            <Text>Not found</Text>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Round;
