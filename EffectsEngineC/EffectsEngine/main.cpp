#include <iostream>
#include <signal.h>
#include <cstdlib>
#include <stdio.h>
#include <unistd.h>

#include <chrono>
#include <thread>

#include "include/ws2811.h"

//ws2811_t ledstring =
//{
//    .freq = WS2811_TARGET_FREQ,
//    .dmanum = 10,
//    .channel =
//    {
//        [0] =
//        {
//            .gpionum = 18,
//            .count = 40, // for weapons
//            .invert = 0,
//            .brightness = 255,
//            .strip_type = WS2811_STRIP_GBR
//        },
//        [1] =
//        {
//            .gpionum = 0,
//            .count = 0,
//            .invert = 0,
//            .brightness = 0,
//        },
//    },
//};

bool running{ true };

ws2811_t perkele =
{
    0,
    0,
    0,
    WS2811_TARGET_FREQ,
    10, // DMA
    18, // Channel start, GPIO
    0,  // invert
    40, // count
    WS2811_STRIP_GRB,
    nullptr,
    255,
};

void my_handler(int s) {
    printf("Caught signal %d\n", s);
    /*ws2811_fini(&perkele);*/

    //exit(1);

    running = false;
}

int main(int argc, char* argv[]) {

    struct sigaction sigIntHandler;

    sigIntHandler.sa_handler = my_handler;
    sigemptyset(&sigIntHandler.sa_mask);
    sigIntHandler.sa_flags = 0;

    sigaction(SIGINT, &sigIntHandler, NULL);


    std::cout << "Hello World!\n";

    auto ret = ws2811_init(&perkele);
    if (ret != WS2811_SUCCESS)
    {
        std::cout << "ws2811_init failed: %s\n" << ws2811_get_return_t_str(ret) << "\n";
        return ret;
    }

    std::cout << "Hello World!\n";

    while (running) {

        for (int i = perkele.channel[0].count; i != 0; --i) {
            perkele.channel[0].leds[i] = 0x00000A11;
        }
        
        auto ret = ws2811_render(&perkele);
        if (ret != WS2811_SUCCESS)
        {
            std::cout << "ws2811_render failed: %s\n" << ws2811_get_return_t_str(ret) << "\n";
            break;
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(8));
    }

    ws2811_fini(&perkele);

    return 0;
}