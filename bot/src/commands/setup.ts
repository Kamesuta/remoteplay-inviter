import {
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
} from 'discord-api-types/v10';
import { i18n } from '../i18n/index.js';
import { ephemeral, interactionUser } from './common.js';
import { Services } from './services.js';

/**
 * `/steam setup client_id:<id>`: link the user to a client
 * @param interaction interaction
 * @param clientId client ID entered by the user
 * @param services services
 * @returns interaction response
 */
export async function handleSetup(
  interaction: APIChatInputApplicationCommandInteraction,
  clientId: string,
  services: Services,
): Promise<APIInteractionResponse> {
  const locale = interaction.locale;
  const user = interactionUser(interaction);

  // The client must be running to be linked (UUID length is 36 characters)
  const daemon = clientId.length <= 36 ? services.daemon(clientId) : undefined;
  const status = await daemon?.status();
  if (!daemon || !status?.online) {
    return ephemeral(
      i18n.t(locale, 'setup_command.error.daemon_offline', {
        daemon_download_url: services.downloadUrl,
      }),
    );
  }

  await services.users.link(
    { id: user.id, name: user.username },
    clientId,
    locale,
    status.version ?? null,
  );
  await daemon.sendMessage(
    i18n.t(locale, 'daemon.bind_message', { username: user.username }),
  );

  return ephemeral(i18n.t(locale, 'setup_command.setup_message'));
}
