#ifndef REMOTEPLAYINVITEHANDLER_H
#define REMOTEPLAYINVITEHANDLER_H

#include <Steamworks.h>
#include "Types.h"

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
	STEAM_CALLBACK(RemotePlayInviteHandler, OnRemotePlayStarted, RemoteClientStartStreamSession_t, m_remoteStartedCb);
	STEAM_CALLBACK(RemotePlayInviteHandler, OnRemotePlayStopped, RemoteClientStopStreamSession_t, m_remoteStoppedCb);
};

RemotePlayInviteHandler* GRemotePlayInviteHandler();

#endif // REMOTEPLAYINVITEHANDLER_H
