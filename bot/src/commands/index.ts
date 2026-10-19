import {
  APIApplicationCommandInteractionDataBasicOption,
  APIInteraction,
  APIInteractionResponse,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ComponentType,
  InteractionResponseType,
  InteractionType,
} from 'discord-api-types/v10';
import { i18n } from '../i18n/index.js';
import { ephemeral } from './common.js';
import { handleInvite } from './invite.js';
import { handleInviteButton, parseInviteButton } from './inviteButton.js';
import { Services } from './services.js';
import { handleSetup } from './setup.js';

/**
 * Value of a subcommand option
 * @param options options of the subcommand
 * @param name option name
 * @returns value, if given
 */
function optionValue(
  options: APIApplicationCommandInteractionDataBasicOption[],
  name: string,
): string | number | boolean | undefined {
  return options.find((option) => option.name === name)?.value;
}

/**
 * Handle an interaction from Discord
 * @param interaction verified interaction
 * @param services services
 * @returns interaction response
 */
export async function handleInteraction(
  interaction: APIInteraction,
  services: Services,
): Promise<APIInteractionResponse> {
  if (interaction.type === InteractionType.Ping) {
    return { type: InteractionResponseType.Pong };
  }

  if (
    interaction.type === InteractionType.ApplicationCommand &&
    interaction.data.type === ApplicationCommandType.ChatInput &&
    interaction.data.name === 'steam'
  ) {
    const command = { ...interaction, data: interaction.data };
    const subcommand = interaction.data.options?.[0];
    if (subcommand?.type === ApplicationCommandOptionType.Subcommand) {
      const options = subcommand.options ?? [];
      switch (subcommand.name) {
        case 'setup': {
          const clientId = optionValue(options, 'client_id');
          if (typeof clientId === 'string')
            return handleSetup(command, clientId, services);
          break;
        }
        case 'invite': {
          const gameId = optionValue(options, 'game_id');
          return handleInvite(
            command,
            typeof gameId === 'number' ? gameId : undefined,
            services,
          );
        }
      }
    }
  }

  if (
    interaction.type === InteractionType.MessageComponent &&
    interaction.data.component_type === ComponentType.Button
  ) {
    const params = parseInviteButton(interaction.data.custom_id);
    if (params) {
      return handleInviteButton(
        { ...interaction, data: interaction.data },
        params,
        services,
      );
    }
  }

  return ephemeral(i18n.t(interaction.locale, 'error.internal'));
}
