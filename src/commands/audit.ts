import * as fs from "fs";
import { validateExerciseDirectoryName } from "../managers/config/exercise";
import Console from "../utils/console";
import Audit from "../utils/audit";
import SessionCommand from "../utils/SessionCommand";
import * as path from "path";
import { IFile } from "../models/file";
import { IExercise } from "../models/exercise-obj";
import { IFrontmatter } from "../models/front-matter";
import { IAuditErrors } from "../models/audit-errors";
import { ICounter } from "../models/counter";
import { IFindings } from "../models/findings";

// eslint-disable-next-line
const fetch = require("node-fetch");
// eslint-disable-next-line
const fm = require("front-matter");

class AuditCommand extends SessionCommand {
  async init() {
    const { flags } = this.parse(AuditCommand);
    await this.initSession(flags);
  }

  async run() {
    Console.log("Running command audit...");

    // Get configuration object.
    let config = this.configManager?.get();

    if (config) {
      const errors: IAuditErrors[] = [];
      const warnings: IAuditErrors[] = [];
      const counter: ICounter = {
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
      Audit.checkLearnpackClean(config, errors);

      // Build exercises if they are not built yet.
      this.configManager?.buildIndex();
      config = this.configManager?.get();

      // Check if the exercises folder has some files within any ./exercise
      const exercisesPath: string = config!.config!.exercisesPath;

      fs.readdir(exercisesPath, (err, files) => {
        if (err) {
          return console.log("Unable to scan directory: " + err);
        }

        // listing all files using forEach
        for (const file of files) {
          // Do whatever you want to do with the file
          const filePath: string = path.join(exercisesPath, file);
          if (fs.statSync(filePath).isFile())
            warnings.push({
              exercise: file!,
              msg: "This file is not inside any exercise folder.",
            });
        }
      });

      // This function checks that each of the url's are working.
      const checkUrl = async (file: IFile, exercise: IExercise) => {
        if (!fs.existsSync(file.path)) 
return false;
        const content: string = fs.readFileSync(file.path).toString();
        const isEmpty = Audit.checkForEmptySpaces(content);
        if (isEmpty || !content)
          errors.push({
            exercise: exercise.title!,
            msg: `This file (${file.name}) doesn't have any content inside.`,
          });

        const frontmatter: IFrontmatter = fm(content);
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
                  exercise: exercise.title!,
                  msg: `This link is broken (${res.ok}): ${frontmatter.attributes[attribute]}`,
                });
              }
            } catch {
              counter.links.error++;
              errors.push({
                exercise: exercise.title,
                msg: `This link is broken: ${frontmatter.attributes[attribute]}`,
              });
            }
          }
        }

        // Check url's of each README file.
        const findings: IFindings = Audit.findInFile(
          ["relativeImages", "externalImages", "markdownLinks"],
          content
        );
        type findingsType =
          | "relativeImages"
          | "externalImages"
          | "markdownLinks"
          | "url"
          | "uploadcare";
        for (const finding in findings) {
          if (Object.prototype.hasOwnProperty.call(findings, finding)) {
            const obj = findings[finding as findingsType];
            // Valdites all the relative path images.
            if (finding === "relativeImages" && Object.keys(obj!).length > 0) {
              for (const img in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, img)) {
                  // Validates if the image is in the assets folder.
                  counter.images.total++;
                  const relativePath = path
                    .relative(
                      exercise.path.replace(/\\/gm, "/"),
                      `${config!.config?.dirPath}/assets/${obj[img].relUrl}`
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
                      `${config!.config?.dirPath}/assets/${obj[img].relUrl}`
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
              Object.keys(obj!).length > 0
            ) {
              // Valdites all the aboslute path images.
              for (const img in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, img)) {
                  counter.images.total++;
                  if (
                    fs.existsSync(
                      `${config!.config?.dirPath}/assets${obj[img].mdUrl
                        .split("?")
                        .shift()}`
                    )
                  ) {
                    const relativePath = path
                      .relative(
                        exercise.path.replace(/\\/gm, "/"),
                        `${config!.config?.dirPath}/assets/${obj[img].mdUrl}`
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
                  } catch {
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
              Object.keys(obj!).length > 0
            ) {
              for (const link in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, link)) {
                  counter.links.total++;
                  try {
                    // eslint-disable-next-line
                    let res = await fetch(obj[link].mdUrl, { method: "HEAD" });
                    if (res.status > 399 && res.status < 500) {
                      Console.log(
                        "Response links:",
                        res.status,
                        obj[link].mdUrl,
                        res
                      );
                      counter.links.error++;
                      errors.push({
                        exercise: exercise.title,
                        msg: `This link is broken: ${obj[link].mdUrl}`,
                      });
                    }
                  } catch {
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
      const find = async (file: IFile, lang: string, exercise: IExercise) => {
        if (file.name === lang) {
          await checkUrl(file, exercise);
          return true;
        }

        return false;
      };

      Console.debug("config", config);

      Console.info(" Checking if the config file is fine...");
      // These two lines check if the 'slug' property is inside the configuration object.
      Console.debug(
        "Checking if the slug property is inside the configuration object..."
      );
      if (!config!.config?.slug)
        errors.push({
          exercise: undefined,
          msg: "The slug property is not in the configuration object",
        });

      // These two lines check if the 'repository' property is inside the configuration object.
      Console.debug(
        "Checking if the repository property is inside the configuration object..."
      );
      if (!config!.config?.repository)
        errors.push({
          exercise: undefined,
          msg: "The repository property is not in the configuration object",
        });
      else 
Audit.isUrl(config!.config?.repository, errors, counter);

      // These two lines check if the 'description' property is inside the configuration object.
      Console.debug(
        "Checking if the description property is inside the configuration object..."
      );
      if (!config!.config?.description)
        errors.push({
          exercise: undefined,
          msg: "The description property is not in the configuration object",
        });

      if (errors.length === 0) 
Console.log("The config file is ok");

      // Validates if images and links are working at every README file.
      const exercises = config!.exercises;
      const readmeFiles = [];

      if (exercises && exercises.length > 0) {
        Console.info(" Checking if the images are working...");
        for (const index in exercises) {
          if (Object.prototype.hasOwnProperty.call(exercises, index)) {
            const exercise = exercises[index];
            if (!validateExerciseDirectoryName(exercise.title))
              errors.push({
                exercise: exercise.title,
                msg: `The exercise ${exercise.title} has an invalid name.`,
              });
            let readmeFilesCount = { exercise: exercise.title, count: 0 };
            if (Object.keys(exercise.translations!).length === 0)
              errors.push({
                exercise: exercise.title,
                msg: `The exercise ${exercise.title} doesn't have a README.md file.`,
              });

            if (
              exercise.language === "python3" ||
              exercise.language === "python"
            ) {
              for (const f of exercise.files.map(f => f)) {
                if (f.path.includes("test.py") || f.path.includes("tests.py")) {
                  const content = fs.readFileSync(f.path).toString();
                  const isEmpty = Audit.checkForEmptySpaces(content);
                  if (isEmpty || !content)
                    errors.push({
                      exercise: exercise.title,
                      msg: `This file (${f.name}) doesn't have any content inside.`,
                    });
                }
              }
            } else {
              for (const f of exercise.files.map(f => f)) {
                if (f.path.includes("test.js") || f.path.includes("tests.js")) {
                  const content = fs.readFileSync(f.path).toString();
                  const isEmpty: boolean = Audit.checkForEmptySpaces(content);
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
                const files: any[] = [];
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
                    readmeFilesCount = {
                      ...readmeFilesCount,
                      count: readmeFilesCount.count + 1,
                    };
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

      Console.log(
        `${counter.images.total - counter.images.error} images ok from ${
          counter.images.total
        }`
      );

      Console.info(
        " Checking if important files are missing... (README's, translations, gitignore...)"
      );
      // Check if all the exercises has the same ammount of README's, this way we can check if they have the same ammount of translations.
      const files: string[] = [];
      let count = 0;
      for (const item of readmeFiles) {
        if (count < item.count) 
count = item.count;
      }

      for (const item of readmeFiles) {
        if (item.count !== count) 
files.push(` ${item.exercise}`);
      }

      if (files.length > 0) {
        const filesString: string = files.join(",");
        warnings.push({
          exercise: undefined,
          msg:
            files.length === 1 ?
              `This exercise is missing translations:${filesString}` :
              `These exercises are missing translations:${filesString}`,
        });
      }

      // Checks if the .gitignore file exists.
      if (!fs.existsSync(".gitignore"))
        warnings.push({
          exercise: undefined,
          msg: ".gitignore file doesn't exist",
        });

      counter.exercises = exercises!.length;
      for (const readme of readmeFiles) {
        counter.readmeFiles += readme.count;
      }

      await Audit.showWarnings(warnings);
      await Audit.showErrors(errors, counter);
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

export default AuditCommand;
