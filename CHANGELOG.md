# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### December 7, 2021

- Deprecated "disableGrading" configuration property.
- Added `disabledActions` array instead, that way we can disable more than just the tests if we want.
- Fixed a bug on the dep merge configuration that was preventing the learn.json to merge with defaults.
- Added `learnpack test` command ready to start testing it.
- Added loading priority on files, html opens last to make it visible.

### February 16, 2022

- Added functionality to remove the `.session` folder from the `.learn` directory with the `learnpack clean` command.
- Added test to check that the `.session` folder has been removed from the `.learn` directory when using `learnpack clean` command.
- Migrate from isomorphic-fecth to node-fetch.
- Removed isomorphic-fetch from the package.json.

### March 2, 2022

- Added missing functionalities to call the dispatcher with the values which was making the build functionality to be broken.

### April 4. 2022

- Solved bug of actions weren't showing when you start the exercises.

### April 5, 2022

- The exercises' name validation won't be configurable yet, therefore I removed the property from the config object for now.
