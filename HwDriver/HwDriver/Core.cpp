#include "Core.h"
#include "RawReader.h"
#include "HwManager.h"
#include "MotorDriver.h"
#include "ProgramOptions.h"

// FOr testing purposes
//#include "BroadcastEventReceiver.h"
#include "EventReader.h"

#include <iostream>
#include <chrono>
#include <thread>

// For debugoV

Core::Core()
{
    _hw = std::make_shared<HwManager>();
    _cliOptions = std::make_unique<ProgramOptions>();
}

int Core::start(int argumentCount, char* argumentVector[])
{
    // Parse the CLI options
    if (_cliOptions->parse(argumentCount, argumentVector) > 0)
        return -1; // TODO: Should we actually return the value from parse?

	// DEBUG: Start event receiver
	//BroadcastEventReceiver er;
	////er.asyncStart();
 //   EventReader er;
 //   std::this_thread::sleep_for(std::chrono::seconds(10));
 //   std::cout << "Current val:\t" << er.readCurrentValue() << "\n";
 //   std::this_thread::sleep_for(std::chrono::seconds(10));
 //   std::cout << "Current val:\t" << er.readCurrentValue() << "\n";
 //   std::this_thread::sleep_for(std::chrono::seconds(10));
 //   std::cout << "Current val:\t" << er.readCurrentValue() << "\n";
 //   std::this_thread::sleep_for(std::chrono::seconds(10));
 //   std::cout << "Current val:\t" << er.readCurrentValue() << "\n";
 //   std::this_thread::sleep_for(std::chrono::seconds(10));
 //   std::cout << "Current val:\t" << er.readCurrentValue() << "\n";
 //   std::this_thread::sleep_for(std::chrono::seconds(10));
 //   std::cout << "Current val:\t" << er.readCurrentValue() << "\n";

    // Create motors
    _motors = _initMotors();

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

        //motors.push_back(std::make_unique<IMotor>())
        //RawReader test = RawReader(positionPin, _hw);

        // Create IPositionFeedback for the MotorDriver
        //std::unique_ptr<IPositionFeedback> position = std::make_unique<RawReader>(RawReader(positionPin, _hw));
        std::unique_ptr<IPositionFeedback> position = std::make_unique<EventReader>();

        // Create IMotor from MotorDriver
        motors.push_back(std::make_unique<MotorDriver>(std::move(position), pin1, pin2));

        //for (int k = 0; k < 100; ++k) {
        //    std::cout << "Drivin:\t" << test.readCurrentValue() << "\n";
        //    std::this_thread::sleep_for(std::chrono::milliseconds(100));
        //}
        std::this_thread::sleep_for(std::chrono::milliseconds(200));

        int val;

        for (int i = 0; i < 20; ++i) {
            val = 100;
            std::cout << "Driving to " << val << "\n";
            motors.back()->driveToValue(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
            val = 700;
            std::cout << "Driving to " << val << "\n";
            motors.back()->driveToValue(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
            val = 200;
            std::cout << "Driving to " << val << "\n";
            motors.back()->driveToValue(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
            val = 900;
            std::cout << "Driving to " << val << "\n";
            motors.back()->driveToValue(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
            val = 700;
            std::cout << "Driving to " << val << "\n";
            motors.back()->driveToValue(val);
            std::this_thread::sleep_for(std::chrono::milliseconds(200));
        }
    }

    return motors;
}

Core::~Core() = default;
