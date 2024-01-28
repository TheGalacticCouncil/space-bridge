#pragma once
#include <vector>
#include <memory>

class IMotor;
class IHwAccess;
class ProgramOptions;
class NetworkManager;
class AnalogApiProvider;
class EventReader;

class Core
{
public:
    Core();
    ~Core();

    int start(int argumentCount, char* argumentVector[]);

private:
    std::vector<std::shared_ptr<IMotor>> _initMotors();

    std::vector<std::shared_ptr<IMotor>> _motors;
    std::shared_ptr<IHwAccess> _hw{ nullptr };
    std::unique_ptr<ProgramOptions> _cliOptions;
    std::shared_ptr<NetworkManager> _networkManager;
    std::unique_ptr<AnalogApiProvider> _analogApiProvider;
    std::unique_ptr<EventReader> _motorTargetEventReader;
    std::vector<std::unique_ptr<EventReader>> _motorTargetEventReaders;
};

