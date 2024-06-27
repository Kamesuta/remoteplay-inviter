#include "SteamStuff.h"
#include "RemotePlayInviteHandler.h"

RemotePlayInviteHandler::RemotePlayInviteHandler() :
	m_remoteGuestID(1),
	m_remoteInvitedCb(this, &RemotePlayInviteHandler::OnRemotePlayInvited),
	m_remoteStartedCb(this, &RemotePlayInviteHandler::OnRemotePlayStarted),
	m_remoteStoppedCb(this, &RemotePlayInviteHandler::OnRemotePlayStopped),
	m_onRemoteInvited(nullptr),
	m_onRemoteStopped(nullptr)
{
}

uint64 RemotePlayInviteHandler::SendInvite(CSteamID invitee, CGameID gameID)
{
	RemotePlayPlayer_t rppInvitee = { invitee, m_remoteGuestID++, 0, 0, 0 };

	if (gameID.IsSteamApp() && gameID.AppID() != m_nonsteamAppID)
	{
		// Start Remote Play session
		GClientContext()->RemoteClientManager()->BCreateRemotePlayInviteAndSession(rppInvitee, gameID.AppID());
	}
	else
	{
		// non-Steam game is not supported
		return 0;
	}

	return rppInvitee.m_guestID;
}

void RemotePlayInviteHandler::CancelInvite(CSteamID invitee, uint64 guestID)
{
	if (GClientContext()->RemoteClientManager()->BIsStreamingSessionActive())
	{
		RemotePlayPlayer_t rppInvitee = { invitee, guestID, 0, 0, 0 };
		GClientContext()->RemoteClientManager()->CancelRemotePlayInviteAndSession(rppInvitee);
	}
}

void RemotePlayInviteHandler::OnRemotePlayInvited(RemotePlayInviteResult_t* cb)
{
	if (cb->m_eResult == k_ERemoteClientLaunchResultOK)
	{
		// Call the invite created callback
		if (m_onRemoteInvited)
		{
			m_onRemoteInvited(cb->m_player.m_playerID.ConvertToUint64(), cb->m_player.m_guestID, cb->m_szConnectURL);
		}
	}
}

void RemotePlayInviteHandler::OnRemotePlayStarted(RemoteClientStartStreamSession_t* cb)
{
	// Call the session started callback
	if (m_onRemoteStarted)
	{
		m_onRemoteStarted(cb->m_player.m_playerID.ConvertToUint64(), cb->m_player.m_guestID);
	}
}

void RemotePlayInviteHandler::OnRemotePlayStopped(RemoteClientStopStreamSession_t* cb)
{
	//if (!GClientContext()->RemoteClientManager()->BIsStreamingSessionActive())
	//{
	//    // Reset the guest ID
	//    m_remoteGuestID = 1;
	//}

	// Call the session stopped callback
	if (m_onRemoteStopped)
	{
		m_onRemoteStopped(cb->m_player.m_playerID.ConvertToUint64(), cb->m_player.m_guestID);
	}
}

// helper functions

RemotePlayInviteHandler* GRemotePlayInviteHandler()
{
	static RemotePlayInviteHandler handler;
	return &handler;
}
