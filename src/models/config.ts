import { IExercise } from "./exercise-obj";

export interface IConfigPath {
  base: string;
}

export interface IEditor {
  mode?: TMode;
  version: string;
  agent?: string;
}

export type TCompiler =
  | "webpack"
  | "vanillajs"
  | "vue"
  | "react"
  | "css"
  | "html";

export type TGrading = "isolated" | "incremental" | "no-grading";

export type TMode = "vscode" | "standalone";

export type TConfigAction = "test" | "build" | "tutorial" | "reset";

export interface TEntries {
  python3?: string;
  html?: string;
  node?: string;
  react?: string;
  java?: string;
}

export interface IConfig {
  port?: string;
  repository?: string;
  description?: string;
  slug?: string;
  dirPath: string;
  preview?: string; // Picture thumbnail
  entries: TEntries;
  grading: TGrading;
  configPath: string;
  translations: Array<string>;
  outputPath?: string;
  editor: IEditor;
  language: string;
  title: string;
  duration: number;
  difficulty?: string;
  exercisesPath: string;
  disableGrading: boolean; // TODO: Deprecate
  actions: Array<string>; // TODO: Deprecate
  // TODO: nameExerciseValidation
  disabledActions?: Array<TConfigAction>;
  compiler: TCompiler;
  publicPath: string;
  publicUrl?: string;
  skills: Array<string>;
  runHook: (...agrs: Array<any>) => void;
  testingFinishedCallback: (arg: any | undefined) => void;
}

export type TConfigObjAttributes = "config" | "exercises" | "grading";

export interface IConfigObj {
  session?: number;
  currentExercise?: any;
  config?: IConfig;
  exercises?: Array<IExercise>;
  confPath?: IConfigPath;
  address?: string; // Maybe
}
