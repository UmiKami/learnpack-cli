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

### April 12, 2022

- The templates folder doesn't exist when publishing the package.

### April 19, 2022

- Hot Reload added. The webview will reload everytime the users changes a file inside the exercises folder.
- Misspelled console.debug message fixed.
- Hot Reload modified in order to only reload the webview when a md file is changed.

### June 15, 2022

- Bug on editor.mode value, it was being assigned "vscode" when the only acceptable values are "preview" or "standalone". "vscode" is an agent, not a mode.
- "gitpod" removed as agent.

### August 21, 2022

- "learnpack audit" command now working for projects as well, with completely different validations, according to this issue: https://github.com/4GeeksAcademy/About-4Geeks-Academy/issues/3099
- Config will now have a property named "projectType", where you define if it is a "tutorial" or a "project". By default every learnpack project will be a tutorial.

### August 24, 2022

- "learnpack audit"'s project validation is now checking for the README's integrity, adding the validation status and validation timestamp.
- "learnpack audit"'s is now ignoring twitter's links due bug related with them.

### August 27, 2022

- "learnpack init" command default learn.json value simplified. Now it will only contain slug, description, difficulty, duration and grading.

### August 30, 2022

- "learnpack audit" checking for preview improved, now checking that the response status code is not between 399 and 500.
