import { WasmExtension } from "@cosmjs/cosmwasm-stargate";
import { QueryClient } from "@cosmjs/stargate";
import { approxDateFromTimestamp, queryDrandWith } from "./drand";

export interface VerifiedBeacon {
  readonly round: number;
  readonly randomness: string;
  readonly published: Date;
  readonly verified: Date;
  /** Diff between verified and published in seconds */
  readonly diff: number;
}

export async function queryBeacons(
  client: QueryClient & WasmExtension,
  startAfter: number | null,
  itemsPerPage: number,
): Promise<VerifiedBeacon[]> {
  const response: { beacons: Array<any> } = await queryDrandWith(client, {
    beacons_desc: { start_after: startAfter, limit: itemsPerPage },
  });

  return response.beacons.map((beacon: any): VerifiedBeacon => {
    const { round, randomness, published, verified } = beacon;
    const publishedDate = approxDateFromTimestamp(published);
    const verifiedDate = approxDateFromTimestamp(verified);
    const diff = (verifiedDate.getTime() - publishedDate.getTime()) / 1000;
    const verifiedBeacon: VerifiedBeacon = {
      round: round,
      randomness: randomness,
      published: publishedDate,
      verified: verifiedDate,
      diff: diff,
    };
    return verifiedBeacon;
  });
}

export async function queryBeacon(
  client: QueryClient & WasmExtension,
  round: number,
): Promise<VerifiedBeacon | null> {
  const response: { beacon: any } = await queryDrandWith(client, { beacon: { round } });

  if (response.beacon) {
    const { round, randomness, published, verified } = response.beacon;
    const publishedDate = approxDateFromTimestamp(published);
    const verifiedDate = approxDateFromTimestamp(verified);
    const diff = (verifiedDate.getTime() - publishedDate.getTime()) / 1000;
    let verifiedBeacon: VerifiedBeacon = {
      round: round,
      randomness: randomness,
      published: publishedDate,
      verified: verifiedDate,
      diff: diff,
    };
    return verifiedBeacon;
  } else {
    return null;
  }
}
