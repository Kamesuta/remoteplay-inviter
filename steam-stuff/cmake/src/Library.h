#ifndef CMAKE_LIBRARY_H
#define CMAKE_LIBRARY_H

#ifdef __cplusplus
extern "C" {
#endif

#include "Types.h"

bool SteamStuff_Init();
void SteamStuff_Shutdown();
void SteamStuff_RunCallbacks();
uint64_t SteamStuff_GetRunningGameID();
bool SteamStuff_CanRemotePlayTogether(uint64_t gameID);

uint64_t SteamStuff_SendInvite(uint64_t invitee, uint64_t gameID);
void SteamStuff_CancelInvite(uint64_t invitee, uint64_t guestID);
void SteamStuff_SetOnRemoteInvited(OnRemoteInvited cb);
void SteamStuff_SetOnRemoteStarted(OnRemoteStarted cb);
void SteamStuff_SetOnRemoteStopped(OnRemoteStopped cb);

#ifdef __cplusplus
}
#endif

#endif // CMAKE_LIBRARY_H