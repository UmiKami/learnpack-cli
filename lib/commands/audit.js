"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const exercise_1 = require("../managers/config/exercise");
const console_1 = require("../utils/console");
const audit_1 = require("../utils/audit");
const SessionCommand_1 = require("../utils/SessionCommand");
const path = require("path");
// eslint-disable-next-line
const fetch = require("node-fetch");
// eslint-disable-next-line
const fm = require("front-matter");
class AuditCommand extends SessionCommand_1.default {
  async init() {
    const { flags } = this.parse(AuditCommand);
    await this.initSession(flags);
  }
  async run() {
    var _a, _b, _c, _d, _e, _f, _g;
    console_1.default.log("Running command audit...");
    // Get configuration object.
    let config =
      (_a = this.configManager) === null || _a === void 0 ? void 0 : _a.get();
    if (config) {
      const errors = [];
      const warnings = [];
      const counter = {
        images: {
          error: 0,
          total: 0,
        },
        links: {
          error: 0,
          total: 0,
        },
        exercises: 0,
        readmeFiles: 0,
      };
      // Checks if learnpack clean has been run
      audit_1.default.checkLearnpackClean(config, errors);
      // Build exercises if they are not built yet.
      if (!config.exercises || config.exercises.length === 0) {
        (_b = this.configManager) === null || _b === void 0
          ? void 0
          : _b.buildIndex();
        config =
          (_c = this.configManager) === null || _c === void 0
            ? void 0
            : _c.get();
      }
      // Check if the exercises folder has some files within any ./exercise
      const exercisesPath = config.config.exercisesPath;
      fs.readdir(exercisesPath, (err, files) => {
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }
        // listing all files using forEach
        for (const file of files) {
          // Do whatever you want to do with the file
          const filePath = path.join(exercisesPath, file);
          if (fs.statSync(filePath).isFile())
            warnings.push({
              exercise: file,
              msg: "This file is not inside any exercise folder.",
            });
        }
      });
      // This function checks that each of the url's are working.
      const checkUrl = async (file, exercise) => {
        var _a, _b, _c, _d;
        if (!fs.existsSync(file.path)) return false;
        const content = fs.readFileSync(file.path).toString();
        const isEmpty = audit_1.default.checkForEmptySpaces(content);
        if (isEmpty || !content)
          errors.push({
            exercise: exercise.title,
            msg: `This file (${file.name}) doesn't have any content inside.`,
          });
        const frontmatter = fm(content);
        for (const attribute in frontmatter.attributes) {
          if (
            Object.prototype.hasOwnProperty.call(
              frontmatter.attributes,
              attribute
            ) &&
            (attribute === "intro" || attribute === "tutorial")
          ) {
            counter.links.total++;
            try {
              // eslint-disable-next-line
              let res = await fetch(frontmatter.attributes[attribute], {
                method: "HEAD",
              });
              if (!res.ok) {
                counter.links.error++;
                errors.push({
                  exercise: exercise.title,
                  msg: `This link is broken (${res.ok}): ${frontmatter.attributes[attribute]}`,
                });
              }
            } catch (_e) {
              counter.links.error++;
              errors.push({
                exercise: exercise.title,
                msg: `This link is broken: ${frontmatter.attributes[attribute]}`,
              });
            }
          }
        }
        // Check url's of each README file.
        const findings = audit_1.default.findInFile(
          ["relativeImages", "externalImages", "markdownLinks"],
          content
        );
        for (const finding in findings) {
          if (Object.prototype.hasOwnProperty.call(findings, finding)) {
            const obj = findings[finding];
            // Valdites all the relative path images.
            if (finding === "relativeImages" && Object.keys(obj).length > 0) {
              for (const img in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, img)) {
                  // Validates if the image is in the assets folder.
                  counter.images.total++;
                  const relativePath = path
                    .relative(
                      exercise.path.replace(/\\/gm, "/"),
                      `${
                        (_a = config.config) === null || _a === void 0
                          ? void 0
                          : _a.dirPath
                      }/assets/${obj[img].relUrl}`
                    )
                    .replace(/\\/gm, "/");
                  if (relativePath !== obj[img].absUrl.split("?").shift()) {
                    counter.images.error++;
                    errors.push({
                      exercise: exercise.title,
                      msg: `This relative path (${obj[img].relUrl}) is not pointing to the assets folder.`,
                    });
                  }
                  if (
                    !fs.existsSync(
                      `${
                        (_b = config.config) === null || _b === void 0
                          ? void 0
                          : _b.dirPath
                      }/assets/${obj[img].relUrl}`
                    )
                  ) {
                    counter.images.error++;
                    errors.push({
                      exercise: exercise.title,
                      msg: `The file ${obj[img].relUrl} doesn't exist in the assets folder.`,
                    });
                  }
                }
              }
            } else if (
              finding === "externalImages" &&
              Object.keys(obj).length > 0
            ) {
              // Valdites all the aboslute path images.
              for (const img in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, img)) {
                  counter.images.total++;
                  if (
                    fs.existsSync(
                      `${
                        (_c = config.config) === null || _c === void 0
                          ? void 0
                          : _c.dirPath
                      }/assets${obj[img].mdUrl.split("?").shift()}`
                    )
                  ) {
                    const relativePath = path
                      .relative(
                        exercise.path.replace(/\\/gm, "/"),
                        `${
                          (_d = config.config) === null || _d === void 0
                            ? void 0
                            : _d.dirPath
                        }/assets/${obj[img].mdUrl}`
                      )
                      .replace(/\\/gm, "/");
                    warnings.push({
                      exercise: exercise.title,
                      msg: `On this exercise you have an image with an absolute path "${obj[img].absUrl}". We recommend you to replace it by the relative path: "${relativePath}".`,
                    });
                  }
                  try {
                    // eslint-disable-next-line
                    let res = await fetch(obj[img].absUrl, { method: "HEAD" });
                    if (!res.ok) {
                      counter.images.error++;
                      errors.push({
                        exercise: exercise.title,
                        msg: `This link is broken: ${obj[img].absUrl}`,
                      });
                    }
                  } catch (_f) {
                    counter.images.error++;
                    errors.push({
                      exercise: exercise.title,
                      msg: `This link is broken: ${obj[img].absUrl}`,
                    });
                  }
                }
              }
            } else if (
              finding === "markdownLinks" &&
              Object.keys(obj).length > 0
            ) {
              for (const link in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, link)) {
                  counter.links.total++;
                  try {
                    // eslint-disable-next-line
                    let res = await fetch(obj[link].mdUrl, { method: "HEAD" });
                    if (res.status > 399 && res.status < 500) {
                      counter.links.error++;
                      errors.push({
                        exercise: exercise.title,
                        msg: `This link is broken: ${obj[link].mdUrl}`,
                      });
                    }
                  } catch (_g) {
                    counter.links.error++;
                    errors.push({
                      exercise: exercise.title,
                      msg: `This link is broken: ${obj[link].mdUrl}`,
                    });
                  }
                }
              }
            }
          }
        }
        return true;
      };
      // This function is being created because the find method doesn't work with promises.
      const find = async (file, lang, exercise) => {
        if (file.name === lang) {
          await checkUrl(file, exercise);
          return true;
        }
        return false;
      };
      console_1.default.debug("config", config);
      console_1.default.info(" Checking if the config file is fine...");
      // These two lines check if the 'slug' property is inside the configuration object.
      console_1.default.debug(
        "Checking if the slug property is inside the configuration object..."
      );
      if (!((_d = config.config) === null || _d === void 0 ? void 0 : _d.slug))
        errors.push({
          exercise: undefined,
          msg: "The slug property is not in the configuration object",
        });
      // These two lines check if the 'repository' property is inside the configuration object.
      console_1.default.debug(
        "Checking if the repository property is inside the configuration object..."
      );
      if (
        !((_e = config.config) === null || _e === void 0
          ? void 0
          : _e.repository)
      )
        errors.push({
          exercise: undefined,
          msg: "The repository property is not in the configuration object",
        });
      else
        audit_1.default.isUrl(
          (_f = config.config) === null || _f === void 0
            ? void 0
            : _f.repository,
          errors,
          counter
        );
      // These two lines check if the 'description' property is inside the configuration object.
      console_1.default.debug(
        "Checking if the description property is inside the configuration object..."
      );
      if (
        !((_g = config.config) === null || _g === void 0
          ? void 0
          : _g.description)
      )
        errors.push({
          exercise: undefined,
          msg: "The description property is not in the configuration object",
        });
      if (errors.length === 0) console_1.default.log("The config file is ok");
      // Validates if images and links are working at every README file.
      const exercises = config.exercises;
      const readmeFiles = [];
      if (exercises && exercises.length > 0) {
        console_1.default.info(" Checking if the images are working...");
        for (const index in exercises) {
          if (Object.prototype.hasOwnProperty.call(exercises, index)) {
            const exercise = exercises[index];
            if (!exercise_1.validateExerciseDirectoryName(exercise.title))
              errors.push({
                exercise: exercise.title,
                msg: `The exercise ${exercise.title} has an invalid name.`,
              });
            let readmeFilesCount = { exercise: exercise.title, count: 0 };
            if (Object.keys(exercise.translations).length === 0)
              errors.push({
                exercise: exercise.title,
                msg: `The exercise ${exercise.title} doesn't have a README.md file.`,
              });
            if (
              exercise.language === "python3" ||
              exercise.language === "python"
            ) {
              for (const f of exercise.files.map((f) => f)) {
                if (f.path.includes("test.py") || f.path.includes("tests.py")) {
                  const content = fs.readFileSync(f.path).toString();
                  const isEmpty = audit_1.default.checkForEmptySpaces(content);
                  if (isEmpty || !content)
                    errors.push({
                      exercise: exercise.title,
                      msg: `This file (${f.name}) doesn't have any content inside.`,
                    });
                }
              }
            } else {
              for (const f of exercise.files.map((f) => f)) {
                if (f.path.includes("test.js") || f.path.includes("tests.js")) {
                  const content = fs.readFileSync(f.path).toString();
                  const isEmpty = audit_1.default.checkForEmptySpaces(content);
                  if (isEmpty || !content)
                    errors.push({
                      exercise: exercise.title,
                      msg: `This file (${f.name}) doesn't have any content inside.`,
                    });
                }
              }
            }
            for (const lang in exercise.translations) {
              if (
                Object.prototype.hasOwnProperty.call(
                  exercise.translations,
                  lang
                )
              ) {
                const files = [];
                const findResultPromises = [];
                for (const file of exercise.files) {
                  const found = find(
                    file,
                    exercise.translations[lang],
                    exercise
                  );
                  findResultPromises.push(found);
                }
                // eslint-disable-next-line
                let findResults = await Promise.all(findResultPromises);
                for (const found of findResults) {
                  if (found) {
                    readmeFilesCount = Object.assign(
                      Object.assign({}, readmeFilesCount),
                      { count: readmeFilesCount.count + 1 }
                    );
                    files.push(found);
                  }
                }
                if (!files.includes(true))
                  errors.push({
                    exercise: exercise.title,
                    msg: "This exercise doesn't have a README.md file.",
                  });
              }
            }
            readmeFiles.push(readmeFilesCount);
          }
        }
      } else
        errors.push({
          exercise: undefined,
          msg: "The exercises array is empty.",
        });
      console_1.default.log(
        `${counter.images.total - counter.images.error} images ok from ${
          counter.images.total
        }`
      );
      console_1.default.info(
        " Checking if important files are missing... (README's, translations, gitignore...)"
      );
      // Check if all the exercises has the same ammount of README's, this way we can check if they have the same ammount of translations.
      const files = [];
      let count = 0;
      for (const item of readmeFiles) {
        if (count < item.count) count = item.count;
      }
      for (const item of readmeFiles) {
        if (item.count !== count) files.push(` ${item.exercise}`);
      }
      if (files.length > 0) {
        const filesString = files.join(",");
        warnings.push({
          exercise: undefined,
          msg:
            files.length === 1
              ? `This exercise is missing translations:${filesString}`
              : `These exercises are missing translations:${filesString}`,
        });
      }
      // Checks if the .gitignore file exists.
      if (!fs.existsSync(".gitignore"))
        warnings.push({
          exercise: undefined,
          msg: ".gitignore file doesn't exist",
        });
      counter.exercises = exercises.length;
      for (const readme of readmeFiles) {
        counter.readmeFiles += readme.count;
      }
      await audit_1.default.showWarnings(warnings);
      await audit_1.default.showErrors(errors, counter);
    }
  }
}
AuditCommand.description = `learnpack audit is the command in charge of creating an auditory of the repository
...
learnpack audit checks for the following information in a repository:
    1. The configuration object has slug, repository and description. (Error)
    2. The command learnpack clean has been run. (Error)
    3. If a markdown or test file doesn't have any content. (Error)
    4. The links are accessing to valid servers. (Error)
    5. The relative images are working (If they have the shortest path to the image or if the images exists in the assets). (Error)
    6. The external images are working (If they are pointing to a valid server). (Error)
    7. The exercises directory names are valid. (Error)
    8. If an exercise doesn't have a README file. (Error)
    9. The exercises array (Of the config file) has content. (Error)
    10. The exercses have the same translations. (Warning)
    11. The .gitignore file exists. (Warning)
    12. If there is a file within the exercises folder but not inside of any particular exercise's folder. (Warning)
`;
AuditCommand.flags = {
  // name: flags.string({char: 'n', description: 'name to print'}),
};
exports.default = AuditCommand;
