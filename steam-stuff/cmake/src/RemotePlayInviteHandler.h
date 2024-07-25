#ifndef REMOTEPLAYINVITEHANDLER_H
#define REMOTEPLAYINVITEHANDLER_H

#include <Steamworks.h>
#include "Types.h"

// https://github.com/fire64/opensteamworks/blob/320f56f4cc9854eae686b5d8b86e79f16b8397f4/callbacks.json#L1822-L1826
struct StreamingClientConnected_t
{
	enum { k_iCallback = k_iClientRemoteClientManagerCallbacks + 17 };

	char unknown[0x80];
	RemotePlayPlayer_t m_player;
};

class RemotePlayInviteHandler
{
public:
	RemotePlayInviteHandler();
	virtual ~RemotePlayInviteHandler() {}

	/**
		@brief Send an invite to a friend to join a Remote Play session.
		@param invitee The Steam ID of the friend to invite.
		@param gameID The game ID of the game to play.
		@return The guest ID of the invitee or 0 if the invite failed.
	*/
	uint64 SendInvite(CSteamID invitee, CGameID gameID);

	/**
		@brief Cancel an invite to a friend to join a Remote Play session.
		@param invitee The Steam ID of the friend to cancel the invite for.
		@param guestID The guest ID of the invitee.
	*/
	void CancelInvite(CSteamID invitee, uint64 guestID);

private:
	/**
		@brief Non-Steam App ID.
	*/
	static const AppId_t m_nonsteamAppID = 480;

	/**
		@brief Next guest ID of the invitee.
	*/
	uint64 m_remoteGuestID;

public:
	OnRemoteInvited m_onRemoteInvited;
	OnRemoteStarted m_onRemoteStarted;
	OnRemoteStopped m_onRemoteStopped;

private:
	STEAM_CALLBACK(RemotePlayInviteHandler, OnRemotePlayInvited, RemotePlayInviteResult_t, m_remoteInvitedCb);
	STEAM_CALLBACK(RemotePlayInviteHandler, OnRemotePlayStarted, StreamingClientConnected_t, m_remoteStartedCb);
	STEAM_CALLBACK(RemotePlayInviteHandler, OnRemotePlayStopped, RemoteClientStopStreamSession_t, m_remoteStoppedCb);
};

RemotePlayInviteHandler* GRemotePlayInviteHandler();

#endif // REMOTEPLAYINVITEHANDLER_H
