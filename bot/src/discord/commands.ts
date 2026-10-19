import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
  InteractionContextType,
  LocalizationMap,
  RESTPutAPIApplicationCommandsJSONBody,
} from 'discord-api-types/v10';
import { Translator } from '../i18n/translator.js';

/**
 * Definitions of the `/steam` commands
 * @param i18n messages
 * @returns body for registering the global commands
 */
export function buildCommands(
  i18n: Translator,
): RESTPutAPIApplicationCommandsJSONBody {
  const text = (
    key: string,
  ): { description: string; description_localizations: LocalizationMap } => ({
    description: i18n.t('en', key),
    description_localizations: i18n.localizations(key),
  });

  return [
    {
      type: ApplicationCommandType.ChatInput,
      name: 'steam',
      ...text('steam_command.description'),
      integration_types: [
        ApplicationIntegrationType.GuildInstall,
        ApplicationIntegrationType.UserInstall,
      ],
      contexts: [
        InteractionContextType.Guild,
        InteractionContextType.BotDM,
        InteractionContextType.PrivateChannel,
      ],
      options: [
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'setup',
          ...text('setup_command.description'),
          options: [
            {
              type: ApplicationCommandOptionType.String,
              name: 'client_id',
              ...text('setup_command.description_client_id'),
              required: true,
            },
          ],
        },
        {
          type: ApplicationCommandOptionType.Subcommand,
          name: 'invite',
          ...text('invite_command.description'),
          options: [
            {
              type: ApplicationCommandOptionType.Number,
              name: 'game_id',
              ...text('invite_command.description_game_id'),
              required: false,
            },
          ],
        },
      ],
    },
  ];
}
