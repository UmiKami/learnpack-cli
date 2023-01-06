import { prompt } from "enquirer";
import SessionCommand from "../utils/SessionCommand";
import Console from "../utils/console";
import api from "../utils/api";
import { validateBugsUrl, validURL } from "../utils/validators";

// eslint-disable-next-line
const fetch = require("node-fetch");

class PublishCommand extends SessionCommand {
  static description = `Describe the command here
  ...
  Extra documentation goes here
  `;

  static flags: any = {
    // name: flags.string({char: 'n', description: 'name to print'}),
  };

  static args = [
    {
      name: "package", // name of arg to show in help and reference with args[name]
      required: false, // make the arg required with `required: true`
      description:
        "The unique string that identifies this package on learnpack", // help description
      hidden: false, // hide this arg from help
    },
  ];

  async init() {
    const { flags } = this.parse(PublishCommand);
    await this.initSession(flags, true);
  }

  async run() {
    const { flags, args } = this.parse(PublishCommand);

    // avoid annonymus sessions
    // eslint-disable-next-line
    if (!this.session) return;

    Console.info(
      `Session found for ${this.session.payload.email}, publishing the package...`
    );

    const configObject = this.configManager?.get();
    if (
      configObject?.config?.slug === undefined ||
      !configObject.config?.slug
    ) {
      throw new Error(
        "The package is missing a slug (unique name identifier), please check your learn.json file and make sure it has a 'slug'"
      );
    }

    if (!validURL(configObject?.config?.repository ?? "")) {
      throw new Error(
        "The package has a missing or invalid 'repository' on the configuration file, it needs to be a Github URL"
      );
    } else {
      const validateResp = await fetch(configObject.config?.repository, {
        method: "HEAD",
      });
      if (!validateResp.ok || validateResp.status !== 200) {
        throw new Error(
          `The specified repository URL on the configuration file does not exist or its private, only public repositories are allowed at the moment: ${configObject.config?.repository}`
        );
      }
    }

    if (!validateBugsUrl(configObject?.config?.bugsLink ?? "")) {
      throw new Error(
        "The package has a missing or invalid 'bugsLink' on the configuration file, it needs to be a Github URL"
      );
    } else {
      const validateResp = await fetch(configObject.config?.bugsLink, {
        method: "HEAD",
      });
      if (!validateResp.ok || validateResp.status !== 200) {
        throw new Error(
          `The specified bugs URL on the configuration file does not exist or it's unreachable: ${configObject.config?.bugsLink}`
        );
      }
    }

    // start watching for file changes
    try {
      await api.publish({
        ...configObject,
        author: this.session.payload.user_id,
      });
      Console.success(
        `Package updated and published successfully: ${configObject.config?.slug}`
      );
    } catch (error) {
      if ((error as any).status === 404) {
        const answer = await prompt([
          {
            type: "confirm",
            name: "create",
            message: `Package with slug ${configObject.config?.slug} does not exist, do you want to create it?`,
          },
        ]);
        if (answer) {
          await api.update({
            ...configObject,
            author: this.session.payload.user_id,
          });
          Console.success(
            `Package created and published successfully: ${configObject.config?.slug}`
          );
        } else {
          Console.error("No answer from server");
        }
      } else {
        Console.error((error as TypeError).message);
      }
    }
  }
}

export default PublishCommand;
