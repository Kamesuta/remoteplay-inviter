/** Steam store category ID of "Remote Play Together" */
const CATEGORY_REMOTE_PLAY_TOGETHER = 44;

/** How long to wait for the Steam store */
const STORE_TIMEOUT_MS = 5_000;

/** Game shown on the invite panel */
export interface GameInfo {
  /** Game name */
  name: string;
  /** Header image URL */
  headerImage: string;
  /** Whether the game supports Remote Play Together */
  supportsRemotePlayTogether: boolean;
}

/** Part of the appdetails response the bot uses */
interface AppDetails {
  success?: boolean;
  data?: {
    name?: unknown;
    header_image?: unknown;
    categories?: { id: number }[];
  };
}

/**
 * Store link of a game
 * @param gameId Steam AppID
 * @param language Steam language name (e.g. `english`)
 * @returns URL
 */
export function storeLink(gameId: number, language: string): string {
  return `https://store.steampowered.com/app/${gameId}?l=${language}`;
}

/**
 * Get a game from the Steam store
 * @param gameId Steam AppID
 * @param language Steam language name (e.g. `english`)
 * @param fetchImpl fetch implementation
 * @returns the game, or undefined if it could not be retrieved
 */
export async function fetchGameInfo(
  gameId: number,
  language: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GameInfo | undefined> {
  try {
    const response = await fetchImpl(
      `https://store.steampowered.com/api/appdetails?appids=${gameId}&l=${language}`,
      { signal: AbortSignal.timeout(STORE_TIMEOUT_MS) },
    );
    if (!response.ok) return undefined;

    const json = await response.json<Record<string, AppDetails | null>>();
    const app = json[`${gameId}`];
    const name = app?.data?.name;
    const headerImage = app?.data?.header_image;
    if (
      !app?.success ||
      typeof name !== 'string' ||
      typeof headerImage !== 'string'
    ) {
      return undefined;
    }

    return {
      name,
      headerImage,
      supportsRemotePlayTogether: (app.data?.categories ?? []).some(
        (category) => category.id === CATEGORY_REMOTE_PLAY_TOGETHER,
      ),
    };
  } catch (err) {
    console.error(`Failed to get game ${gameId} from the Steam store`, err);
    return undefined;
  }
}
