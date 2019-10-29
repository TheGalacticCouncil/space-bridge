#include "NetworkManager.h"
#include "UdpEventReceiver.h"

#define ASIO_STANDALONE

#include "includes/asio.hpp"
#include <memory>

NetworkManager::NetworkManager() :
    _ioContext(std::make_shared<asio::io_context>()), _eventReceiver(std::make_shared<UdpEventReceiver>(_ioContext))
{
}


std::shared_ptr<asio::io_context> NetworkManager::getIoContext()
{
    return _ioContext;
}

std::shared_ptr<IEventReceiver> NetworkManager::getEventReceiver()
{
    return _eventReceiver;
}

NetworkManager::~NetworkManager() = default;

void NetworkManager::startServers()
{
    _eventReceiver->asyncStart();
}
