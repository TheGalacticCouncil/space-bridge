#include "Core.h"
#include "RawReader.h"
#include "HwManager.h"
#include "MotorDriver.h"
#include "ProgramOptions.h"
#include "NetworkManager.h"
#include "AnalogApiProvider.h"
#include "TouchSenseMotorEnabler.h"

// FOr testing purposes
//#include "BroadcastEventReceiver.h"
#include "EventReader.h"

#include <iostream>
#include <chrono>
#include <thread>

class IMotorEnable;

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
    
    // Create event receiver
//    _motorTargetEventReader = std::make_unique<EventReader>(_networkManager, "MOTOR_1_POSITION");

    // Create motors
    _motors = _initMotors();
    
    // Add motors to AnalogApiProvider
    _analogApiProvider->setMotorsVector(_motors);
    
    for (int i = 0; i < _motors.size(); ++i)
    {
        _motorTargetEventReaders.push_back(std::make_unique<EventReader>(_networkManager, "MOTOR_" + std::to_string(i+_cliOptions->firstMotorNumber) + "_POSITION"));
    }

    while (true) {
        // Tick the motors
        for (auto const &motor : _motors) {
            motor->tick();
        }

        // Update the provided APIs
        _analogApiProvider->tick();

        // just a hacky way to not to utilize processor 100% :)
        std::this_thread::sleep_for(std::chrono::milliseconds(5));
        
        
        // TODO: Implement MotorizedLinearPotentiometer class to run one instance per motor in their own threads to drive motor
        //       to desired position.
        for (int i = 0; i < _motors.size(); ++i)
        {
//            // Debug logging, print current motor positions
//            std::cout << 
//                _motorTargetEventReaders.at(i)->getEventName() << "\n" <<
//                _motorTargetEventReaders.at(i)->readCurrentValue() << std::endl;
            _motors.at(i)->driveToValue(_motorTargetEventReaders.at(i)->readCurrentValue());
        }
    }

    return 0;
}

std::vector<std::shared_ptr<IMotor>> Core::_initMotors()
{
    std::cout << "Core::_initMotors - Initializing motors...\n";

    std::vector<std::shared_ptr<IMotor>> motors;

    // For now only direct reading of MCP3008 is supported

//    // (for now) there are two pins for each motor
//    for (unsigned int i = 0, j = 0; i < _cliOptions->pwmPins.size(); i += 2, j += 1) {
//        unsigned pin1 = _cliOptions->pwmPins.at(i);
//        unsigned pin2 = _cliOptions->pwmPins.at(i + 1);
//        unsigned positionPin = _cliOptions->positionPins.at(j);
//
//        std::cout 
//            << "Core::_initMotors - Creating motor\n"
//            << "PWM pins:\t" << pin1 << " and " << pin2 << "\n"
//            << "Analog input pin:\t" << positionPin << "\n";
//
//        // Create IPositionFeedback for the MotorDriver
//        std::unique_ptr<IPositionFeedback> position = std::make_unique<RawReader>(RawReader(positionPin, _hw));
//        //std::unique_ptr<IPositionFeedback> position = std::make_unique<EventReader>(_networkManager);
//
//        // Create IMotor from MotorDriver
//        motors.push_back(std::make_unique<MotorDriver>(std::move(position), pin1, pin2));
//
////        motors.back()->setOperatingMode(OperatingMode::Guide, 7U);
//        motors.back()->setOperatingMode(OperatingMode::Target);
//    }
    for (auto const motorConfig : _cliOptions->motorOptions)
    {
        // TODO: This checking should happen in ProgramOptions, not here!
        if (motorConfig.size() != 7)
        {
            std::cout << "Each motor needs to have 7 input arguments" << std::endl;
            
            throw 1;
        }
        
        unsigned driveEnabled = motorConfig.at(0);
        unsigned motorPin1 = motorConfig.at(1);
        unsigned motorPin2 = motorConfig.at(2);
        unsigned positionMcpChannel = motorConfig.at(3);
        unsigned positionMcpPin = motorConfig.at(4);
        unsigned touchMcpChannel = motorConfig.at(5);
        unsigned touchMcpPin = motorConfig.at(6);
        
        std::cout 
            << "Core::_initMotors - Creating motor\n"
            << "PWM pins:\t" << motorPin1 << " and " << motorPin2 << "\n"
            << "Position MCP channel:\t" << positionMcpChannel << "\n"
            << "Position MCP pin:\t" << positionMcpPin << "\n"
            << "Touch MCP channel:\t" << touchMcpChannel << "\n"
            << "Touch MCP pin:\t" << touchMcpPin << "\n";
        
        // Create IPositionFeedback for the MotorDriver
        std::unique_ptr<IPositionFeedback> position = std::make_unique<RawReader>(RawReader(positionMcpChannel, positionMcpPin, _hw));
        
        // Create IMotorEnable for touch sense
        std::unique_ptr<IMotorEnable> motorEnabler = std::make_unique<TouchSenseMotorEnabler>(TouchSenseMotorEnabler(touchMcpChannel, touchMcpPin, _hw));

        // Create IMotor from MotorDriver
        motors.push_back(std::make_shared<MotorDriver>(std::move(position), std::move(motorEnabler), motorPin1, motorPin2, _cliOptions->motorEnablePin));

        motors.back()->setOperatingMode(OperatingMode::Target);
    }

    return motors;
}

Core::~Core() = default;
