package config

type GenericConfig struct {
	MainLoopSleepTimeMs int `yaml:"mainLoopSleepTimeMs"`
}

type EventsConfig struct {
	BroadcastPort           int    `yaml:"broadcastPort"`
	BroadcastListenAddress  string `yaml:"broadcastListenAddress"`
	EventReceiverBufferSize int    `yaml:"eventReceiverBufferSize"`
}

type FileApiConfig struct {
	PositionsFilePath      string `yaml:"positionsFilePath"`
	TouchFilePath          string `yaml:"touchFilePath"`
	TouchPositionsFilePath string `yaml:"touchPositionsFilePath"`
}

type MotorizedSlidersConfig struct {
	Config struct {
		MotorMaxPwm            int `yaml:"motorMaxPwm"`
		MotorMinPwm            int `yaml:"motorMinPwm"`
		MotorLoopIterationsMax int `yaml:"motorLoopIterationsMax"`
		AccuracyPromille       int `yaml:"accuracyPromille"`
		MinTimeFromLastTouchMs int `yaml:"minTimeFromLastTouchMs"`
		TouchSenseThreshold    int `yaml:"touchSenseThreshold"`
		CalibrationRunTimeMs   int `yaml:"calibrationRunTimeMs"`
	} `yaml:"config"`
	Sliders []struct {
		ID    int `yaml:"id"`
		Motor struct {
			Pin1      int `yaml:"pin1"`
			Pin2      int `yaml:"pin2"`
			EnablePin int `yaml:"enablePin"`
		} `yaml:"motor"`
		PositionSensor struct {
			AdcChannel int `yaml:"adcChannel"`
			SpiChannel int `yaml:"spiChannel"`
		} `yaml:"positionSensor"`
		TouchSensor struct {
			AdcChannel int `yaml:"adcChannel"`
			SpiChannel int `yaml:"spiChannel"`
		} `yaml:"touchSensor"`
	} `yaml:"sliders"`
}

type CombinedConfig struct {
	Generic          GenericConfig          `yaml:"generic"`
	Events           EventsConfig           `yaml:"events"`
	FileApi          FileApiConfig          `yaml:"fileApi"`
	MotorizedSliders MotorizedSlidersConfig `yaml:"motorizedSliders"`
}
