#! /usr/bin/env bash

export PYTHONPATH=$(pwd)

# # Create Vessel data in DB
python src/load_vessel_settings.py
