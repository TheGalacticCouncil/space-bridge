#include "BroadcastEventReceiver.h"
#include "includes/asio.hpp"
#include <iostream>
#include <thread>

using asio::ip::udp;

BroadcastEventReceiver::BroadcastEventReceiver()
{
	// TODO: Make sure that we use only one io_context in the program!!!
	_io_context = std::make_shared<asio::io_context>();

	// TODO: Get rid of hard-coded port
	_socket = std::make_unique<udp::socket>(*_io_context, udp::endpoint(udp::v4(), 41114));

	_receiveData();

	//_socket->async_receive_from(
	//	asio::buffer(_data, 1024), *_senderEndpoint,
	//	[this](std::error_code ec, std::size_t bytes_recvd)
	//	{
	//		if (!ec && bytes_recvd > 0)
	//		{
	//			std::cout << "Event oujee!\n";
	//		}
	//		else {
	//			std::cout << "Nou gou\n";
	//		}
	//	}
	//);
}

void BroadcastEventReceiver::startInThread()
{
	_io_context->run();
}

void BroadcastEventReceiver::start()
{
	_serverThread = std::thread{ &BroadcastEventReceiver::startInThread, this };
}

void BroadcastEventReceiver::_receiveData()
{
	_socket->async_receive(
		asio::buffer(_data, 1024),
		[this](std::error_code ec, std::size_t bytes_recvd)
		{
			if (!ec && bytes_recvd > 0)
			{
				std::cout << "Event oujee!\n" << _data << "\n";
				_receiveData();
			}
			else {
				std::cout << "Nou gou\n";
			}
		}
	);
}
