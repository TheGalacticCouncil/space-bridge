#include "Core.h"
#include "RawReader.h"
#include "HwManager.h"
#include "MotorDriver.h"
#include "ProgramOptions.h"
#include "NetworkManager.h"
#include "AnalogApiProvider.h"

// FOr testing purposes
//#include "BroadcastEventReceiver.h"
#include "EventReader.h"

#include <iostream>
#include <chrono>
#include <thread>

// For debugoV

Core::Core():
    _networkManager(std::make_shared<NetworkManager>()), 
    _hw(std::make_shared<HwManager>()), 
    _analogApiProvider(std::make_unique<AnalogApiProvider>(_hw))
{
    _cliOptions = std::make_unique<ProgramOptions>();
}

int Core::start(int argumentCount, char* argumentVector[])
{
    // Parse the CLI options
    if (_cliOptions->parse(argumentCount, argumentVector) > 0)
        return -1; // TODO: Should we actually return the value from parse?

    // Start servers
    _networkManager->startServers();

    // Create motors
    _motors = _initMotors();

    while (true) {
        // Tick the motors
        for (auto const &motor : _motors) {
            motor->tick();
        }

        // Update the provided APIs
        _analogApiProvider->tick();

        // just a hacky way to not to utilize processor 100% :)
        std::this_thread::sleep_for(std::chrono::milliseconds(8));
    }

    return 0;
}

std::vector<std::unique_ptr<IMotor>> Core::_initMotors()
{
    std::cout << "Core::_initMotors - Initializing motors...\n";

    std::vector<std::unique_ptr<IMotor>> motors;

    // For now only direct reading of MCP3008 is supported

    // (for now) there are two pins for each motor
    for (unsigned int i = 0, j = 0; i < _cliOptions->pwmPins.size(); i += 2, j += 1) {
        unsigned pin1 = _cliOptions->pwmPins.at(i);
        unsigned pin2 = _cliOptions->pwmPins.at(i + 1);
        unsigned positionPin = _cliOptions->positionPins.at(j);

        std::cout 
            << "Core::_initMotors - Creating motor\n"
            << "PWM pins:\t" << pin1 << " and " << pin2 << "\n"
            << "Analog input pin:\t" << positionPin << "\n";

        // Create IPositionFeedback for the MotorDriver
        std::unique_ptr<IPositionFeedback> position = std::make_unique<RawReader>(RawReader(positionPin, _hw));
        //std::unique_ptr<IPositionFeedback> position = std::make_unique<EventReader>(_networkManager);

        // Create IMotor from MotorDriver
        motors.push_back(std::make_unique<MotorDriver>(std::move(position), pin1, pin2));

        motors.back()->setOperatingMode(OperatingMode::Guide, 10U);
    }

    return motors;
}

Core::~Core() = default;
