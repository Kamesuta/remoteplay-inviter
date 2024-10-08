#include "Library.h"
#include "SteamStuff.h"
#include "RemotePlayInviteHandler.h"


#ifdef __cplusplus
extern "C" {
#endif


// SteamStuff functions

bool SteamStuff_Init()
{
	return GClientContext()->Init();
}

void SteamStuff_Shutdown()
{
	GClientContext()->Shutdown();
}

void SteamStuff_RunCallbacks()
{
	GClientContext()->RunCallbacks();
}

uint64_t SteamStuff_GetRunningGameID()
{
	return GClientContext()->GetRunningGameID().ToUint64();
}

bool SteamStuff_CanRemotePlayTogether(uint64_t gameID)
{
	return GClientContext()->AppManager()->BCanRemotePlayTogether(CGameID(uint64(gameID)).AppID());
}


// RemotePlayInviteHandler functions

uint64_t SteamStuff_SendInvite(uint64_t invitee, uint64_t gameID)
{
	return GRemotePlayInviteHandler()->SendInvite(CSteamID(uint64(invitee)), CGameID(uint64(gameID)));
}

void SteamStuff_CancelInvite(uint64_t invitee, uint64_t guestID)
{
	GRemotePlayInviteHandler()->CancelInvite(CSteamID(uint64(invitee)), guestID);
}

void SteamStuff_SetOnRemoteInvited(OnRemoteInvited cb)
{
	GRemotePlayInviteHandler()->m_onRemoteInvited = cb;
}

void SteamStuff_SetOnRemoteStarted(OnRemoteStarted cb)
{
	GRemotePlayInviteHandler()->m_onRemoteStarted = cb;
}

void SteamStuff_SetOnRemoteStopped(OnRemoteStopped cb)
{
	GRemotePlayInviteHandler()->m_onRemoteStopped = cb;
}


#ifdef __cplusplus
}
#endif
