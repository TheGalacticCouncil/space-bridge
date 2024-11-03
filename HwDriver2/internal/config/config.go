package config

import (
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

type ConfigProvider struct {
	config CombinedConfig
}

func NewConfigProvider() (*ConfigProvider, error) {
	// Find out our own path
	// This is necessary to find the config file relative to the binary
	executablePath, err := os.Executable()
	if err != nil {
		return nil, err
	}

	configPath := filepath.Join(filepath.Dir(executablePath), "config.yaml")
	file, err := os.Open(configPath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var config CombinedConfig
	decoder := yaml.NewDecoder(file)
	if err := decoder.Decode(&config); err != nil {
		return nil, err
	}

	return &ConfigProvider{
		config: config,
	}, nil
}

func (c *ConfigProvider) GetConfig() CombinedConfig {
	return c.config
}
