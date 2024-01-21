#pragma once
#include <vector>
#include <memory>

namespace CLI {
    class App;
}

class ProgramOptions
{
public:
    ProgramOptions();
    ~ProgramOptions();

    // Return 0 if all ok, otherwise error code (>0) is returned
    int parse(int argumentCount, char* argumentVector[]);

    std::vector<unsigned> pwmPins;
    std::vector<unsigned> positionPins;
    std::vector<std::vector<unsigned>> motorOptions;

private:
    std::unique_ptr<CLI::App> _app;
};

