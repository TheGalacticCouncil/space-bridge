#pragma once
#include <vector>
#include <memory>

class IMotor;
class IHwAccess;
class ProgramOptions;
class NetworkManager;

class Core
{
public:
    Core();
    ~Core();

    int start(int argumentCount, char* argumentVector[]);

private:
    std::vector<std::unique_ptr<IMotor>> _initMotors();

    std::vector<std::unique_ptr<IMotor>> _motors;
    std::shared_ptr<IHwAccess> _hw{ nullptr };
    std::unique_ptr<ProgramOptions> _cliOptions;
    std::shared_ptr<NetworkManager> _networkManager;
};

