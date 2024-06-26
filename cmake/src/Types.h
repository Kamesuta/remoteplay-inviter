#ifndef CMAKE_TYPES_H
#define CMAKE_TYPES_H

#include <stdint.h>
#include <stdbool.h>

/**
	@brief Callback for when a Remote Play invite result is received.
	@param invitee The Steam ID of the invitee.
	@param guestID The guest ID of the invitee.
	@param connectURL The URL to connect to the Remote Play session.
*/
typedef void (*OnRemoteInvited)(uint64_t invitee, uint64_t guestID, const char* connectURL);

/**
	@brief Callback for when a Remote Play session is started.
	@param invitee The Steam ID of the invitee.
	@param guestID The guest ID of the invitee.
*/
typedef void (*OnRemoteStarted)(uint64_t invitee, uint64_t guestID);

/**
	@brief Callback for when a Remote Play session is closed.
	@param invitee The Steam ID of the invitee.
	@param guestID The guest ID of the invitee.
*/
typedef void (*OnRemoteStopped)(uint64_t invitee, uint64_t guestID);

#endif // CMAKE_TYPES_H
