import { describe, expect, it } from 'vitest';
import { i18n } from '../src/i18n/index.js';

describe('i18n', () => {
  it('uses Japanese for ja and English otherwise', () => {
    expect(i18n.t('ja', 'invite_panel.steam_language')).toBe('japanese');
    expect(i18n.t('en-US', 'invite_panel.steam_language')).toBe('english');
    expect(i18n.t('fr', 'invite_panel.steam_language')).toBe('english');
  });

  it('fills placeholders without escaping', () => {
    expect(i18n.t('en', 'invite_panel.title', { name: 'Tom & Jerry' })).toBe(
      "Let's play Tom & Jerry together for free!",
    );
    expect(
      i18n.t('en', 'invite_button.invite_message', {
        link: 'https://s.team/p/x',
      }),
    ).toContain('https://s.team/p/x');
  });

  it('returns the key for a missing message', () => {
    expect(i18n.t('en', 'no.such.key')).toBe('no.such.key');
  });

  it('gives localizations for Discord locales', () => {
    expect(i18n.localizations('steam_command.description')).toEqual({
      'en-US': i18n.t('en', 'steam_command.description'),
      'en-GB': i18n.t('en', 'steam_command.description'),
      ja: i18n.t('ja', 'steam_command.description'),
    });
  });
});
