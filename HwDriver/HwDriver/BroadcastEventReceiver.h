#pragma once
#include "includes/asio.hpp"
#include <memory>
#include <thread>

class BroadcastEventReceiver
{
public:
    BroadcastEventReceiver();

	void startInThread();
	void start();

private:
	void _receiveData();

	std::shared_ptr<asio::io_context> _io_context;
	std::thread _serverThread;
	std::unique_ptr<asio::ip::udp::udp::socket> _socket;
	std::unique_ptr<asio::ip::udp::udp::endpoint> _senderEndpoint;

	char _data[1024];
};

